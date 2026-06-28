import BotConversation from "../models/BotConversation.js";
import BotMessage from "../models/BotMessage.js";
import User from "../models/User.js";
import Patient from "../models/Patient.js";
import Medication from "../models/Medication.js";
import AppError from "../utils/AppError.js";
import { msg, getLocalizedString } from "../utils/i18n.js";

const AI_TIMEOUT_MS = 10000;
const HISTORY_LIMIT = 20;

const callOpenRouter = async (systemPrompt, messages) => {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.CHATBOT_MODEL || "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
        signal: AbortSignal.timeout(AI_TIMEOUT_MS),
      },
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenRouter error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return {
      reply: data.choices?.[0]?.message?.content || "",
      modelUsed: data.model || "openrouter",
    };
  } catch (err) {
    console.warn("OpenRouter unavailable:", err.message);
    return null;
  }
};

const callGemini = async (systemPrompt, messages) => {
  try {
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const model =
      process.env.GEMINI_FALLBACK_MODEL || "gemini-1.5-flash";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemPrompt }] },
        }),
        signal: AbortSignal.timeout(AI_TIMEOUT_MS),
      },
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return {
      reply: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
      modelUsed: model,
    };
  } catch (err) {
    console.warn("Gemini unavailable:", err.message);
    return null;
  }
};

const getAiReply = async (systemPrompt, messages) => {
  const openRouterResult = await callOpenRouter(systemPrompt, messages);
  if (openRouterResult) return openRouterResult;

  const geminiResult = await callGemini(systemPrompt, messages);
  if (geminiResult) return geminiResult;

  return null;
};

const buildSystemPrompt = (user, patientData, lang) => {
  const role = user.role === "doctor" ? "doctor" : "patient";

  const intro =
    lang === "ar"
      ? `أنت مساعد AXON الصحي، مساعد طبي ذكي لمنصة AXON للرعاية الصحية.\nالمستخدم: ${role === "doctor" ? "طبيب" : "مريض"}\nاللغة: العربية`
      : `You are AXON Health Assistant, a helpful medical AI assistant for the AXON healthcare platform.\nUser: ${role === "doctor" ? "Doctor" : "Patient"}\nLanguage: English`;

  let profile = "";
  if (patientData) {
    if (lang === "ar") {
      profile += "\n\nملف المريض:";
      if (patientData.bloodType) profile += `\n- فصيلة الدم: ${patientData.bloodType}`;
      if (patientData.height) profile += `\n- الطول: ${patientData.height} سم`;
      if (patientData.weight) profile += `\n- الوزن: ${patientData.weight} كجم`;
      if (patientData.conditions?.length) profile += `\n- الحالات المرضية: ${patientData.conditions.join(", ")}`;
      if (patientData.allergies?.length) profile += `\n- الحساسية: ${patientData.allergies.join(", ")}`;
      if (patientData.activeMedications?.length) {
        const meds = patientData.activeMedications
          .map((m) => `${m.medicineName}${m.dosage?.value ? ` ${m.dosage.value}${m.dosage.unit || ""}` : ""}`)
          .join(", ");
        profile += `\n- الأدوية النشطة: ${meds}`;
      }
    } else {
      profile += "\n\nPatient profile:";
      if (patientData.bloodType) profile += `\n- Blood type: ${patientData.bloodType}`;
      if (patientData.height) profile += `\n- Height: ${patientData.height} cm`;
      if (patientData.weight) profile += `\n- Weight: ${patientData.weight} kg`;
      if (patientData.conditions?.length) profile += `\n- Conditions: ${patientData.conditions.join(", ")}`;
      if (patientData.allergies?.length) profile += `\n- Allergies: ${patientData.allergies.join(", ")}`;
      if (patientData.activeMedications?.length) {
        const meds = patientData.activeMedications
          .map((m) => `${m.medicineName}${m.dosage?.value ? ` ${m.dosage.value}${m.dosage.unit || ""}` : ""}`)
          .join(", ");
        profile += `\n- Active medications: ${meds}`;
      }
    }
  }

  const guidelines =
    lang === "ar"
      ? "\n\nإرشادات مهمة:\n- قدم معلومات واضحة ودقيقة ومفيدة\n- لا تقدم تشخيصاً طبياً نهائياً\n- أوصِ دائماً باستشارة أخصائي رعاية صحية للحالات الخطيرة\n- كن حذراً واستند إلى المعرفة الطبية العامة\n- عند مناقشة الأدوية، اذكر الآثار الجانبية المحتملة\n- رد بنفس لغة المستخدم"
      : "\n\nImportant guidelines:\n- Provide clear, accurate, and helpful information\n- Do NOT provide definitive medical diagnoses\n- Always recommend consulting a healthcare professional for serious concerns\n- Base your answers on general medical knowledge\n- When discussing medications, mention possible side effects\n- Respond in the user's language";

  return intro + profile + guidelines;
};

const processQuestion = async (userId, { message, conversationId }, isPersonalized) => {
  const user = await User.findById(userId).select("role preferredLanguage");
  if (!user) throw new AppError(msg("المستخدم غير موجود", "User not found"), 404);

  let patientData = null;
  if (isPersonalized && user.role === "patient") {
    const patient = await Patient.findOne({ userId })
      .select("bloodType height weight conditions allergies");
    if (patient) {
      const medications = await Medication.find({ patientId: userId, isActive: true })
        .select("medicineName dosage");
      patientData = { ...patient.toObject(), activeMedications: medications };
    }
  }

  // Get or create conversation
  let conversation;
  if (conversationId) {
    conversation = await BotConversation.findOne({ _id: conversationId, userId });
    if (!conversation) {
      throw new AppError(
        msg("المحادثة غير موجودة", "Conversation not found"),
        404,
      );
    }
  } else {
    conversation = await BotConversation.create({
      userId,
      title: message.length > 100 ? `${message.slice(0, 100)}...` : message,
      lastMessage: message,
      lastMessageAt: new Date(),
    });
  }

  // Save user message
  await BotMessage.create({
    conversation: conversation._id,
    role: "user",
    content: message,
  });

  // Load conversation history
  const history = await BotMessage.find({ conversation: conversation._id })
    .sort({ createdAt: -1 })
    .limit(HISTORY_LIMIT)
    .then((msgs) =>
      msgs.reverse().map((m) => ({ role: m.role, content: m.content })),
    );

  // Build system prompt
  const lang = user.preferredLanguage || "ar";
  const systemPrompt = buildSystemPrompt(user, patientData, lang);

  // Call AI
  const result = await getAiReply(systemPrompt, history);

  const reply =
    result?.reply ||
    getLocalizedString(
      msg(
        "عذراً، خدمة المساعد الذكي غير متوفرة حالياً. يرجى المحاولة لاحقاً.",
        "Sorry, the AI assistant is currently unavailable. Please try again later.",
      ),
      lang,
    );

  // Save AI reply
  await BotMessage.create({
    conversation: conversation._id,
    role: "assistant",
    content: reply,
  });

  conversation.lastMessage = reply;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  return {
    reply,
    conversationId: conversation._id,
    modelUsed: result?.modelUsed || null,
  };
};

export const askQuestion = (userId, body) =>
  processQuestion(userId, body, false);

export const personalizedAsk = (userId, body) =>
  processQuestion(userId, body, true);

export const getConversations = async (userId) => {
  return BotConversation.find({ userId })
    .sort("-lastMessageAt")
    .limit(50);
};

export const getConversationMessages = async (userId, conversationId) => {
  const conversation = await BotConversation.findOne({
    _id: conversationId,
    userId,
  });
  if (!conversation) {
    throw new AppError(
      msg("المحادثة غير موجودة", "Conversation not found"),
      404,
    );
  }

  return BotMessage.find({ conversation: conversationId })
    .sort("createdAt")
    .limit(100);
};
