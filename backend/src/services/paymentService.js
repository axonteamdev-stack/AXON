import Stripe from "stripe";
import Payment from "../models/Payment.js";
import AppError from "../utils/AppError.js";
import { msg } from "../utils/i18n.js";

let stripe;
const getStripe = () => {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
};

export const createSetupIntent = async (appointmentId, patientId) => {
  const payment = await Payment.findOne({ appointment: appointmentId, patient: patientId });
  if (!payment) {
    throw new AppError(msg("الدفعة غير موجودة", "Payment not found"), 404);
  }
  if (!["pending", "requires_payment_method"].includes(payment.status)) {
    throw new AppError(
      msg("تمت معالجة الدفع بالفعل", "Payment already processed"),
      400,
    );
  }

  const setupIntent = await getStripe().setupIntents.create({
    payment_method_types: ["card"],
    metadata: {
      appointmentId: appointmentId.toString(),
      patientId: patientId.toString(),
    },
  });

  payment.stripeSetupIntentId = setupIntent.id;
  payment.clientSecret = setupIntent.client_secret;
  payment.status = "requires_payment_method";
  await payment.save();

  return {
    clientSecret: setupIntent.client_secret,
    setupIntentId: setupIntent.id,
  };
};

export const attachPaymentMethod = async (appointmentId, patientId, setupIntentId) => {
  const setupIntent = await getStripe().setupIntents.retrieve(setupIntentId);
  if (setupIntent.status !== "succeeded") {
    throw new AppError(
      msg(
        "لم يتم تأكيد طريقة الدفع، يرجى المحاولة مرة أخرى",
        "Payment method not confirmed, please try again",
      ),
      400,
    );
  }

  const paymentMethodId = setupIntent.payment_method;

  const payment = await Payment.findOne({ appointment: appointmentId, patient: patientId });
  if (!payment) {
    throw new AppError(msg("الدفعة غير موجودة", "Payment not found"), 404);
  }

  payment.stripePaymentMethodId = paymentMethodId;
  payment.stripeSetupIntentId = setupIntentId;
  payment.status = "pending";
  await payment.save();

  return { paymentMethodId };
};

export const chargeAfterAcceptance = async (appointmentId) => {
  const payment = await Payment.findOne({ appointment: appointmentId });
  if (!payment) {
    return null;
  }

  if (payment.amount <= 0) {
    payment.status = "succeeded";
    payment.paidAt = new Date();
    await payment.save();
    return payment;
  }

  if (!payment.stripePaymentMethodId) {
    payment.status = "requires_payment_method";
    await payment.save();
    return payment;
  }

  if (payment.status === "succeeded") {
    return payment;
  }

  try {
    const paymentIntent = await getStripe().paymentIntents.create({
      amount: payment.amount,
      currency: payment.currency,
      customer: payment.patient.toString(),
      payment_method: payment.stripePaymentMethodId,
      off_session: true,
      confirm: true,
      metadata: {
        appointmentId: appointmentId.toString(),
        paymentId: payment._id.toString(),
      },
    });

    payment.stripePaymentIntentId = paymentIntent.id;
    payment.clientSecret = paymentIntent.client_secret;

    if (paymentIntent.status === "succeeded") {
      payment.status = "succeeded";
      payment.paidAt = new Date();
    } else if (paymentIntent.status === "processing") {
      payment.status = "processing";
    } else if (
      paymentIntent.status === "requires_payment_method" ||
      paymentIntent.status === "requires_action"
    ) {
      payment.status = "requires_payment_method";
    } else {
      payment.status = "failed";
    }

    await payment.save();
    return payment;
  } catch (err) {
    if (err.code === "authentication_required") {
      payment.status = "requires_payment_method";
      await payment.save();
      return payment;
    }
    throw err;
  }
};

export const getPayment = async (appointmentId, userId) => {
  const payment = await Payment.findOne({ appointment: appointmentId });
  if (!payment) {
    throw new AppError(msg("الدفعة غير موجودة", "Payment not found"), 404);
  }
  if (
    payment.patient.toString() !== userId.toString() &&
    payment.doctor.toString() !== userId.toString()
  ) {
    throw new AppError(
      msg("لا يمكنك الوصول إلى هذه الدفعة", "Cannot access this payment"),
      403,
    );
  }
  return payment;
};

export const handleWebhook = async (rawBody, signature) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    const body = typeof rawBody === "string" ? rawBody : rawBody.toString();
    const event = JSON.parse(body);
    return handleEvent(event);
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    throw new AppError("Webhook signature verification failed", 400);
  }

  return handleEvent(event);
};

const handleEvent = async (event) => {
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const payment = await Payment.findOne({
        stripePaymentIntentId: paymentIntent.id,
      });
      if (payment && payment.status !== "succeeded") {
        payment.status = "succeeded";
        payment.paidAt = new Date();
        await payment.save();
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const payment = await Payment.findOne({
        stripePaymentIntentId: paymentIntent.id,
      });
      if (payment) {
        payment.status = "failed";
        await payment.save();
      }
      break;
    }

    case "setup_intent.succeeded": {
      const setupIntent = event.data.object;
      const payment = await Payment.findOne({
        stripeSetupIntentId: setupIntent.id,
      });
      if (payment) {
        payment.stripePaymentMethodId = setupIntent.payment_method;
        payment.status = "pending";
        await payment.save();
      }
      break;
    }

    case "setup_intent.setup_failed": {
      const setupIntent = event.data.object;
      const payment = await Payment.findOne({
        stripeSetupIntentId: setupIntent.id,
      });
      if (payment) {
        payment.status = "requires_payment_method";
        await payment.save();
      }
      break;
    }
  }
};

export const initPayment = async (appointment, patientId) => {
  const doctor = await (await import("../models/User.js")).default.findById(
    appointment.doctor,
  );
  const amount = doctor?.doctorProfile?.price || 0;

  const amountInPiastres = Math.round(amount * 100);

  const existingPayment = await Payment.findOne({ appointment: appointment._id });
  if (existingPayment) {
    return existingPayment;
  }

  return Payment.create({
    appointment: appointment._id,
    patient: patientId,
    doctor: appointment.doctor,
    amount: amountInPiastres,
    currency: "egp",
    status: amountInPiastres > 0 ? "pending" : "succeeded",
    paidAt: amountInPiastres > 0 ? null : new Date(),
  });
};
