import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import FormData from "form-data"; // npm install form-data
import fetch from "node-fetch";   // npm install node-fetch

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_URL = process.env.API_URL || "http://localhost:3000";

// ── Colorized logging ───────────────────────────────────────────
const log = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[OK]\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m[ERR]\x1b[0m ${msg}`),
  warn: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
};

// ── Store created entity IDs for cross-referencing ──────────────
const store = {
  users: {},      // email -> { id, token, role }
  appointments: [],
  conversations: [],
  posts: [],
  medications: [],
};

// ── Helper: create FormData with optional file ─────────────────
function createFormData(data, fileField = null, filePath = null) {
  const form = new FormData();

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      form.append(key, JSON.stringify(value));
    } else if (typeof value === "object") {
      form.append(key, JSON.stringify(value));
    } else {
      form.append(key, String(value));
    }
  }

  if (fileField && filePath && fs.existsSync(filePath)) {
    form.append(fileField, fs.createReadStream(filePath));
  }

  return form;
}

// ── Helper: API request ───────────────────────────────────────
async function api(method, endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const headers = options.token ? { Authorization: `Bearer ${options.token}` } : {};

  if (options.form) {
    // FormData handles Content-Type with boundary automatically
    delete headers["Content-Type"];
  } else if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  const fetchOptions = {
    method,
    headers,
  };

  if (options.form) {
    fetchOptions.body = options.form;
    // Let form-data set the Content-Type with boundary
    Object.assign(fetchOptions.headers, options.form.getHeaders());
  } else if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(url, fetchOptions);
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  } catch (err) {
    return { status: 0, error: err.message };
  }
}

// ═══════════════════════════════════════════════════════════════
//  SEED DATA
// ═══════════════════════════════════════════════════════════════

const PATIENTS = [
  {
    fullName: "Ahmed Hassan",
    email: "ahmed.patient@example.com",
    password: "password123",
    phoneNumber: "+201001234567",
    gender: "Male",
    preferredLanguage: "ar",
    photoFile: "patient1.jpg",
    healthProfile: {
      bloodType: "O+",
      height: 175,
      weight: 78,
      conditions: ["Diabetes Type 2", "Hypertension"],
      allergies: ["Penicillin", "Peanuts"],
      emergencyContactName: "Mona Hassan",
      emergencyContactPhone: "+201009876543",
      emergencyContactRelationship: "Wife",
    },
    radiologyImage: "xray-chest.jpg",
    radiologyDescriptions: ["Chest X-Ray - Routine checkup"],
    labImage: "blood-test.jpg",
    labDescriptions: ["CBC Blood Test - March 2026"],
  },
  {
    fullName: "Sarah Johnson",
    email: "sarah.patient@example.com",
    password: "password123",
    phoneNumber: "+14155551234",
    gender: "Female",
    preferredLanguage: "en",
    photoFile: "patient2.jpg",
    healthProfile: {
      bloodType: "A-",
      height: 162,
      weight: 58,
      conditions: ["Asthma"],
      allergies: ["Shellfish"],
      emergencyContactName: "Michael Johnson",
      emergencyContactPhone: "+14155555678",
      emergencyContactRelationship: "Husband",
    },
  },
  {
    fullName: "Omar Khaled",
    email: "omar.patient@example.com",
    password: "password123",
    phoneNumber: "+966501234567",
    gender: "Male",
    preferredLanguage: "ar",
    photoFile: "patient3.jpg",
  },
];

const DOCTORS = [
  {
    fullName: "Dr. Fatima Al-Rashid",
    email: "fatima.doctor@example.com",
    password: "password123",
    phoneNumber: "+201112223344",
    gender: "Female",
    preferredLanguage: "ar",
    photoFile: "doctor1.jpg",
    licenseFile: "license1.pdf",
    specialization: "Cardiology",
    yearsExperience: 12,
    medicalLicenseNumber: "EG-MED-2014-8842",
    about: "Senior cardiologist specializing in interventional cardiology.",
    price: 500,
  },
  {
    fullName: "Dr. James Wilson",
    email: "james.doctor@example.com",
    password: "password123",
    phoneNumber: "+14155559876",
    gender: "Male",
    preferredLanguage: "en",
    photoFile: "doctor2.jpg",
    licenseFile: "license2.pdf",
    specialization: "Neurology",
    yearsExperience: 8,
    medicalLicenseNumber: "US-NY-2018-4451",
    about: "Board-certified neurologist with focus on epilepsy.",
    price: 350,
  },
  {
    fullName: "Dr. Aisha Mahmoud",
    email: "aisha.doctor@example.com",
    password: "password123",
    phoneNumber: "+971501112233",
    gender: "Female",
    preferredLanguage: "ar",
    photoFile: "doctor3.jpg",
    licenseFile: "license3.pdf",
    specialization: "Pediatrics",
    yearsExperience: 15,
    medicalLicenseNumber: "AE-DHA-2011-2290",
    about: "Pediatrician with 15 years experience in neonatal care.",
    price: 400,
  },
];

// ═══════════════════════════════════════════════════════════════
//  STEP 1: CREATE PATIENTS
// ═══════════════════════════════════════════════════════════════

async function seedPatients() {
  log.info("Seeding patients...");

  for (const p of PATIENTS) {
    const data = {
      fullName: p.fullName,
      email: p.email,
      password: p.password,
      phoneNumber: p.phoneNumber,
      gender: p.gender,
      preferredLanguage: p.preferredLanguage,
      ...(p.healthProfile || {}),
    };

    const form = createFormData(data, "personalPhoto", getAssetPath(p.photoFile));

    // Add radiology/lab if present
    if (p.radiologyImage) {
      form.append("radiologyImage", fs.createReadStream(getAssetPath(p.radiologyImage)));
      if (p.radiologyDescriptions) {
        form.append("radiologyDescriptions", JSON.stringify(p.radiologyDescriptions));
      }
    }
    if (p.labImage) {
      form.append("labImage", fs.createReadStream(getAssetPath(p.labImage)));
      if (p.labDescriptions) {
        form.append("labDescriptions", JSON.stringify(p.labDescriptions));
      }
    }

    const res = await api("POST", "/auth/signup/patient", { form });

    if (res.status === 201) {
      store.users[p.email] = {
        id: res.data.data.user.id,
        token: res.data.data.tokens.accessToken,
        role: "patient",
        ...res.data.data,
      };
      log.success(`Patient created: ${p.email} (ID: ${res.data.data.user.id})`);
    } else {
      log.error(`Failed to create patient ${p.email}: ${JSON.stringify(res.data)}`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  STEP 2: CREATE DOCTORS
// ═══════════════════════════════════════════════════════════════

async function seedDoctors() {
  log.info("Seeding doctors...");

  for (const d of DOCTORS) {
    const data = {
      fullName: d.fullName,
      email: d.email,
      password: d.password,
      phoneNumber: d.phoneNumber,
      gender: d.gender,
      preferredLanguage: d.preferredLanguage,
      specialization: d.specialization,
      yearsExperience: d.yearsExperience,
      medicalLicenseNumber: d.medicalLicenseNumber,
      about: d.about,
      price: d.price,
    };

    const form = createFormData(data);
    form.append("licenseImage", fs.createReadStream(getAssetPath(d.licenseFile)));
    form.append("personalPhoto", fs.createReadStream(getAssetPath(d.photoFile)));

    const res = await api("POST", "/auth/signup/doctor", { form });

    if (res.status === 201) {
      store.users[d.email] = {
        id: res.data.data.user.id,
        token: res.data.data.tokens.accessToken,
        role: "doctor",
        ...res.data.data,
      };
      log.success(`Doctor created: ${d.email} (ID: ${res.data.data.user.id})`);
    } else {
      log.error(`Failed to create doctor ${d.email}: ${JSON.stringify(res.data)}`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  STEP 3: CREATE APPOINTMENTS
// ═══════════════════════════════════════════════════════════════

const APPOINTMENTS = [
  { patient: "ahmed.patient@example.com", doctor: "fatima.doctor@example.com", scheduledAt: "2026-05-20T10:00:00Z", notes: "Follow-up for blood pressure" },
  { patient: "sarah.patient@example.com", doctor: "james.doctor@example.com", scheduledAt: "2026-05-21T14:30:00Z", notes: "Migraine frequency increased" },
  { patient: "omar.patient@example.com", doctor: "aisha.doctor@example.com", scheduledAt: "2026-05-22T09:00:00Z", notes: "Vaccination schedule" },
  { patient: "ahmed.patient@example.com", doctor: "james.doctor@example.com", scheduledAt: "2026-05-25T11:00:00Z", notes: "Second opinion on MRI" },
];

async function seedAppointments() {
  log.info("Seeding appointments...");

  for (const appt of APPOINTMENTS) {
    const patient = store.users[appt.patient];
    const doctor = store.users[appt.doctor];

    if (!patient || !doctor) {
      log.warn(`Skipping appointment: missing user data`);
      continue;
    }

    const res = await api("POST", "/appointments", {
      token: patient.token,
      body: {
        doctorId: doctor.id,
        scheduledAt: appt.scheduledAt,
        notes: appt.notes,
      },
    });

    if (res.status === 201) {
      store.appointments.push({
        ...appt,
        id: res.data.data.appointment._id,
        patientId: patient.id,
        doctorId: doctor.id,
      });
      log.success(`Appointment created: ${appt.patient} -> ${appt.doctor}`);
    } else {
      log.error(`Failed appointment: ${JSON.stringify(res.data)}`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  STEP 4: DOCTOR ACCEPTS SOME APPOINTMENTS
// ═══════════════════════════════════════════════════════════════

async function seedAppointmentActions() {
  log.info("Doctors responding to appointments...");

  // Fatima accepts Ahmed's appointment
  const appt1 = store.appointments[0];
  if (appt1) {
    const doctor = store.users["fatima.doctor@example.com"];
    const res = await api("PATCH", `/appointments/${appt1.id}/status`, {
      token: doctor.token,
      body: { status: "accepted" },
    });
    if (res.status === 200) {
      log.success(`Fatima accepted appointment from Ahmed`);
    }
  }

  // James rejects Omar's appointment (if exists)
  const appt3 = store.appointments[2];
  if (appt3) {
    const doctor = store.users["aisha.doctor@example.com"];
    const res = await api("PATCH", `/appointments/${appt3.id}/status`, {
      token: doctor.token,
      body: { status: "accepted" },
    });
    if (res.status === 200) {
      log.success(`Aisha accepted appointment from Omar`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  STEP 5: CREATE MEDICATIONS
// ═══════════════════════════════════════════════════════════════

const MEDICATIONS = [
  {
    patient: "ahmed.patient@example.com",
    doctor: "fatima.doctor@example.com",
    medicineName: "Metformin",
    dosage: { value: 500, unit: "mg" },
    frequency: "twice daily",
    intakeTimes: ["08:00", "20:00"],
    startDate: "2026-05-01T00:00:00Z",
    endDate: "2026-08-01T00:00:00Z",
    indication: "Type 2 Diabetes management",
    notes: "Take with meals",
  },
  {
    patient: "ahmed.patient@example.com",
    doctor: "fatima.doctor@example.com",
    medicineName: "Amlodipine",
    dosage: { value: 5, unit: "mg" },
    frequency: "once daily",
    intakeTimes: ["08:00"],
    startDate: "2026-05-01T00:00:00Z",
    endDate: "2026-11-01T00:00:00Z",
    indication: "Hypertension",
    notes: "Monitor BP daily",
  },
  {
    patient: "sarah.patient@example.com",
    doctor: "james.doctor@example.com",
    medicineName: "Sumatriptan",
    dosage: { value: 50, unit: "mg" },
    frequency: "as needed",
    intakeTimes: ["06:00", "12:00", "18:00"],
    startDate: "2026-05-10T00:00:00Z",
    endDate: "2026-06-10T00:00:00Z",
    indication: "Acute migraine relief",
    notes: "Max 200mg/day",
  },
];

async function seedMedications() {
  log.info("Seeding medications...");

  for (const med of MEDICATIONS) {
    const doctor = store.users[med.doctor];
    const patient = store.users[med.patient];

    if (!doctor || !patient) continue;

    const res = await api("POST", "/medications", {
      token: doctor.token,
      body: {
        ...med,
        patientId: patient.id,
      },
    });

    if (res.status === 201) {
      store.medications.push(res.data.data.medication);
      log.success(`Medication created: ${med.medicineName} for ${med.patient}`);
    } else {
      log.error(`Failed medication ${med.medicineName}: ${JSON.stringify(res.data)}`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  STEP 6: CREATE ARTICLES (Doctor Posts)
// ═══════════════════════════════════════════════════════════════

const ARTICLES = [
  {
    author: "fatima.doctor@example.com",
    title: "Understanding Heart Disease: Prevention and Early Detection",
    content: "Heart disease remains the leading cause of death worldwide. In this comprehensive guide, we explore the risk factors including high blood pressure, cholesterol, smoking, and family history. Early detection through regular screenings can significantly reduce mortality rates.",
    image: "article-heart.jpg",
    category: "Cardiology",
    tags: ["heart", "prevention", "cardiology"],
  },
  {
    author: "james.doctor@example.com",
    title: "Migraine vs. Regular Headache: Know the Difference",
    content: "Many people confuse migraines with regular tension headaches. Migraines are neurological events characterized by throbbing pain, often accompanied by nausea, sensitivity to light and sound, and visual disturbances called auras.",
    image: "article-migraine.jpg",
    category: "Neurology",
    tags: ["neurology", "mental-health", "medication"],
  },
  {
    author: "aisha.doctor@example.com",
    title: "Childhood Vaccinations: A Complete Schedule Guide",
    content: "Vaccinations are one of the most effective public health interventions. This guide provides a month-by-month schedule from birth through age 18, explaining each vaccine's purpose.",
    image: "article-vaccine.jpg",
    category: "Pediatrics",
    tags: ["vaccination", "pediatrics", "prevention"],
  },
];

async function seedArticles() {
  log.info("Seeding articles...");

  for (const article of ARTICLES) {
    const doctor = store.users[article.author];
    if (!doctor) continue;

    const form = createFormData({
      title: article.title,
      content: article.content,
      category: article.category,
      tags: JSON.stringify(article.tags),
    });
    form.append("articleImage", fs.createReadStream(getAssetPath(article.image)));

    const res = await api("POST", "/posts/articles", {
      token: doctor.token,
      form,
    });

    if (res.status === 201) {
      store.posts.push(res.data.data.post);
      log.success(`Article created: "${article.title}"`);
    } else {
      log.error(`Failed article: ${JSON.stringify(res.data)}`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  STEP 7: CREATE COMMUNITY POSTS (Patient Posts)
// ═══════════════════════════════════════════════════════════════

const COMMUNITY_POSTS = [
  {
    author: "ahmed.patient@example.com",
    title: "My journey managing diabetes - 5 years on",
    content: "Five years ago I was diagnosed with Type 2 diabetes. It felt overwhelming at first, but with the right support system and medical team, I've managed to keep my A1C under 7%. Here are the lifestyle changes that worked for me.",
    image: "community-diabetes.jpg",
    tags: ["diabetes", "lifestyle", "nutrition"],
  },
  {
    author: "sarah.patient@example.com",
    title: "Dealing with asthma triggers in spring",
    content: "Spring is beautiful but brutal for us asthma sufferers. Pollen counts are through the roof here. I've found that using air purifiers at home helps a lot.",
    image: "community-asthma.jpg",
    tags: ["mental-health", "lifestyle", "prevention"],
  },
];

async function seedCommunityPosts() {
  log.info("Seeding community posts...");

  for (const post of COMMUNITY_POSTS) {
    const patient = store.users[post.author];
    if (!patient) continue;

    const form = createFormData({
      title: post.title,
      content: post.content,
      tags: JSON.stringify(post.tags),
    });
    form.append("postImage", fs.createReadStream(getAssetPath(post.image)));

    const res = await api("POST", "/posts/community", {
      token: patient.token,
      form,
    });

    if (res.status === 201) {
      store.posts.push(res.data.data.post);
      log.success(`Community post created: "${post.title}"`);
    } else {
      log.error(`Failed community post: ${JSON.stringify(res.data)}`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  STEP 8: LIKE POSTS
// ═══════════════════════════════════════════════════════════════

async function seedLikes() {
  log.info("Seeding likes...");

  // Patients like articles and community posts
  const patients = ["ahmed.patient@example.com", "sarah.patient@example.com", "omar.patient@example.com"];

  for (let i = 0; i < Math.min(store.posts.length, 5); i++) {
    const post = store.posts[i];
    const liker = store.users[patients[i % patients.length]];
    if (!liker) continue;

    const res = await api("POST", `/posts/${post._id}/like`, {
      token: liker.token,
    });

    if (res.status === 200) {
      log.success(`Like added to post: ${post.title?.substring(0, 30)}...`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  STEP 9: ADD COMMENTS
// ═══════════════════════════════════════════════════════════════

const COMMENTS = [
  { postIndex: 0, author: "sarah.patient@example.com", content: "Thank you for sharing! Your story gives me hope." },
  { postIndex: 0, author: "omar.patient@example.com", content: "Great tips! Has anyone tried intermittent fasting?" },
  { postIndex: 1, author: "ahmed.patient@example.com", content: "I use a HEPA filter mask when gardening. Makes a huge difference!" },
];

async function seedComments() {
  log.info("Seeding comments...");

  for (const comment of COMMENTS) {
    const post = store.posts[comment.postIndex];
    const author = store.users[comment.author];
    if (!post || !author) continue;

    const res = await api("POST", `/posts/${post._id}/comments`, {
      token: author.token,
      body: { content: comment.content },
    });

    if (res.status === 201) {
      log.success(`Comment added to: ${post.title?.substring(0, 30)}...`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  STEP 10: CHAT MESSAGES
// ═══════════════════════════════════════════════════════════════

async function seedChatMessages() {
  log.info("Seeding chat messages...");

  // Get conversations for accepted appointments
  for (const user of Object.values(store.users)) {
    const res = await api("GET", "/chat/conversations", { token: user.token });
    if (res.status === 200 && res.data.data.conversations) {
      for (const conv of res.data.data.conversations) {
        store.conversations.push(conv);
      }
    }
  }

  // Send messages in first conversation
  if (store.conversations.length > 0) {
    const conv = store.conversations[0];
    const participants = conv.participants;

    // Find tokens for participants
    const sender1 = Object.values(store.users).find(u => u.id === participants[0]._id);
    const sender2 = Object.values(store.users).find(u => u.id === participants[1]._id);

    if (sender1 && sender2) {
      await api("POST", `/chat/${conv._id}/messages`, {
        token: sender1.token,
        body: { text: "Hello doctor, should I fast before tomorrow's appointment?" },
      });

      await api("POST", `/chat/${conv._id}/messages`, {
        token: sender2.token,
        body: { text: "No fasting needed. Just bring your blood pressure log." },
      });

      log.success(`Chat messages seeded in conversation ${conv._id}`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  STEP 11: UPDATE PROFILES
// ═══════════════════════════════════════════════════════════════

async function seedProfileUpdates() {
  log.info("Updating profiles...");

  // Ahmed updates his profile with new photo
  const ahmed = store.users["ahmed.patient@example.com"];
  if (ahmed) {
    const form = createFormData({ fullName: "Ahmed Hassan Updated" });
    form.append("personalPhoto", fs.createReadStream(getAssetPath("patient1-new.jpg")));

    const res = await api("PATCH", "/users/me", {
      token: ahmed.token,
      form,
    });

    if (res.status === 200) {
      log.success(`Ahmed's profile updated with new photo`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  STEP 12: GENERATE QR CODE
// ═══════════════════════════════════════════════════════════════

async function seedQRCode() {
  log.info("Generating emergency QR codes...");

  const ahmed = store.users["ahmed.patient@example.com"];
  if (ahmed) {
    const res = await api("POST", "/records/qr", { token: ahmed.token });
    if (res.status === 200) {
      log.success(`QR code generated for Ahmed`);
      log.info(`PIN: ${res.data.data.pin} (save this for testing QR access)`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  UTILITIES
// ═══════════════════════════════════════════════════════════════

function getAssetPath(filename) {
  return path.join(__dirname, "test-assets", filename);
}

function ensureAssetsDir() {
  const dir = path.join(__dirname, "test-assets");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

// Create dummy image files if they don't exist
function createDummyAssets() {
  const dir = ensureAssetsDir();
  const assets = [
    "patient1.jpg", "patient2.jpg", "patient3.jpg",
    "doctor1.jpg", "doctor2.jpg", "doctor3.jpg",
    "license1.pdf", "license2.pdf", "license3.pdf",
    "xray-chest.jpg", "blood-test.jpg",
    "article-heart.jpg", "article-migraine.jpg", "article-vaccine.jpg",
    "community-diabetes.jpg", "community-asthma.jpg",
    "patient1-new.jpg",
  ];

  for (const file of assets) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) {
      // Create a minimal valid file
      if (file.endsWith(".jpg")) {
        // Minimal JPEG header
        const jpegHeader = Buffer.from([
          0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
          0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xD9
        ]);
        fs.writeFileSync(filePath, jpegHeader);
      } else if (file.endsWith(".pdf")) {
        // Minimal PDF header
        fs.writeFileSync(filePath, "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n>>\nendobj\ntrailer\n<<\n/Root 1 0 R\n>>\n%%EOF");
      }
      log.warn(`Created dummy asset: ${file}`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║         AXON Medical API - Dummy Data Seeder                 ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  createDummyAssets();

  await seedPatients();
  await seedDoctors();
  await seedAppointments();
  await seedAppointmentActions();
  await seedMedications();
  await seedArticles();
  await seedCommunityPosts();
  await seedLikes();
  await seedComments();
  await seedChatMessages();
  await seedProfileUpdates();
  await seedQRCode();

  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║              SEEDING COMPLETE                                ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  console.log("Created entities:");
  console.log(`  Users:        ${Object.keys(store.users).length}`);
  console.log(`  Appointments: ${store.appointments.length}`);
  console.log(`  Medications:  ${store.medications.length}`);
  console.log(`  Posts:        ${store.posts.length}`);
  console.log(`  Conversations:${store.conversations.length}`);

  console.log("\nTest accounts:");
  for (const [email, data] of Object.entries(store.users)) {
    console.log(`  ${email} (${data.role}) - ID: ${data.id}`);
  }

  // Save store for reference
  fs.writeFileSync(
    path.join(__dirname, "seed-output.json"),
    JSON.stringify({
      users: Object.fromEntries(
        Object.entries(store.users).map(([k, v]) => [k, { id: v.id, role: v.role, token: v.token }])
      ),
      appointments: store.appointments,
      posts: store.posts.map(p => ({ _id: p._id, title: p.title, type: p.type })),
    }, null, 2)
  );
  log.info("Seed data saved to seed-output.json");
}

main().catch(err => {
  log.error(`Fatal error: ${err.message}`);
  console.error(err);
  process.exit(1);
});
