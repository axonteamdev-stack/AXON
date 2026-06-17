import { catchAsync } from "../utils/catchAsync.js";
import { sendLocalizedResponse } from "../utils/response.js";
import { msg } from "../utils/i18n.js";
import AppError from "../utils/AppError.js";
import { moveFromTemp, cleanupTemp } from "../middlewares/upload.js";
import * as recordService from "../services/recordService.js";
import fs from "fs";
import path from "path";

const rollbackMovedFiles = (testData) => {
  const filesToDelete = [testData.image].filter(Boolean);
  for (const filePath of filesToDelete) {
    try {
      const fullPath = path.join(process.cwd(), filePath.replace(/^\//, ""));
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    } catch {
      /* ignore */
    }
  }
};

export const getMyRecord = catchAsync(async (req, res) => {
  const record = await recordService.getByPatient(req.user.id);
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب السجل الطبي", "Medical record fetched"),
    { record },
    req.lang,
  );
});

export const updateRecord = catchAsync(async (req, res) => {
  const record = await recordService.update(req.user.id, req.body);
  sendLocalizedResponse(
    res,
    200,
    msg("تم تحديث السجل الطبي", "Medical record updated"),
    { record },
    req.lang,
  );
});

export const addTest = catchAsync(async (req, res) => {
  const { type } = req.params;
  const testData = {
    description: req.body.description,
    date: new Date(),
  };

  const radiologyFile = req.files?.radiologyImage?.[0];
  const labFile = req.files?.labImage?.[0];

  try {
    if (type === "radiology" && radiologyFile) {
      const { url } = moveFromTemp(radiologyFile.filename, "radiologyImage");
      testData.image = url;
    } else if (type === "lab" && labFile) {
      const { url } = moveFromTemp(labFile.filename, "labImage");
      testData.image = url;
    }

    const record = await recordService.addTest(req.user.id, type, testData);
    sendLocalizedResponse(
      res,
      200,
      msg("تم إضافة التحليل", "Test added"),
      { record },
      req.lang,
    );
  } catch (err) {
    rollbackMovedFiles(testData);
    cleanupTemp(req.files);
    throw err;
  }
});

export const generateQR = catchAsync(async (req, res) => {
  const { qrCode, pin, expiresAt } = await recordService.generateQR(
    req.user.id,
  );
  sendLocalizedResponse(
    res,
    200,
    msg("تم إنشاء رمز QR", "QR code generated"),
    { qrCode, pin, expiresAt },
    req.lang,
  );
});

export const getByQR = catchAsync(async (req, res) => {
  const { patientId } = req.params;

  if (!patientId) {
    throw new AppError(msg("معرف المريض مطلوب", "Patient ID is required"), 400);
  }

  const record = await recordService.getByQRDirect(patientId, req.ip);
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب السجل الطبي للطوارئ", "Emergency medical record fetched"),
    { record },
    req.lang,
  );
});

export const renderEmergencyPage = catchAsync(async (req, res) => {
  const { token } = req.params;
  let record;

  try {
    record = await recordService.getByQRDirect(token, req.ip);
  } catch {
    record = null;
  }

  const name = record?.userId?.fullName || "";
  const blood = record?.bloodType || "";
  const conditions = (record?.conditions || []).join(", ");
  const allergies = (record?.allergies || []).join(", ");
  const contactName = record?.emergencyContact?.name || "";
  const contactPhone = record?.emergencyContact?.phone || "";

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Emergency Medical Data</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f4f4f4;
      padding: 20px;
      color: #333;
      line-height: 1.5;
    }
    .card {
      background: white;
      padding: 25px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      max-width: 500px;
      margin: 0 auto;
    }
    h1 { color: #d32f2f; margin-top: 0; font-size: 1.5rem; }
    .field {
      margin: 15px 0;
      border-bottom: 1px solid #eee;
      padding-bottom: 5px;
    }
    .offline-badge {
      display: inline-block;
      background: #ff9800;
      color: white;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .emergency-btn {
      display: block;
      background: #d32f2f;
      color: white;
      text-align: center;
      padding: 18px;
      text-decoration: none;
      font-size: 1.2rem;
      font-weight: bold;
      border-radius: 8px;
      margin-top: 20px;
    }
    .muted { color: #888; font-style: italic; }
  </style>
</head>
<body>
  <div class="card" id="emergency-card">
    <div id="offline-indicator"></div>
    <h1 id="patient-name">${name || "Loading..."}</h1>
    <div class="field"><strong>Blood Type:</strong> <span id="blood-type" class="muted">${blood || "—"}</span></div>
    <div class="field"><strong>Conditions:</strong> <span id="conditions" class="muted">${conditions || "—"}</span></div>
    <div class="field"><strong>Allergies:</strong> <span id="allergies" class="muted">${allergies || "—"}</span></div>
    <div class="field"><strong>Emergency Contact:</strong> <span id="contact-name" class="muted">${contactName} (${contactPhone || "—"})</span></div>
    <a class="emergency-btn" id="call-btn" href="${contactPhone ? "tel:" + contactPhone : "#"}">CALL EMERGENCY CONTACT</a>
  </div>

  <script>
    (function() {
      function parseOfflineData() {
        const params = new URLSearchParams(window.location.search);
        const dataParam = params.get("data");
        if (!dataParam) return null;
        try {
          let base64 = dataParam.replace(/-/g, "+").replace(/_/g, "/");
          while (base64.length % 4) base64 += "=";
          const decoded = decodeURIComponent(escape(atob(base64)));
          const parts = decoded.split("|");
          return {
            bloodType: parts[0] || "Unknown",
            conditions: parts[1] || "None",
            allergies: parts[2] || "None"
          };
        } catch (e) {
          console.error("Failed to decode offline data:", e);
          return null;
        }
      }

      function renderOffline(offlineData) {
        document.getElementById("offline-indicator").innerHTML =
          '<span class="offline-badge">Offline Mode</span>';
        document.getElementById("patient-name").textContent = "Emergency Patient";
        document.getElementById("blood-type").textContent = offlineData.bloodType;
        document.getElementById("conditions").textContent = offlineData.conditions;
        document.getElementById("allergies").textContent = offlineData.allergies;
      }

      const token = window.location.pathname.split("/").pop();
      const offlineData = parseOfflineData();
      const hasServerData = document.getElementById("blood-type").textContent.trim() !== "—";

      if (!hasServerData && offlineData) {
        renderOffline(offlineData);
      }

      if (!hasServerData) {
        fetch("/api/v1/records/emergency-data/" + token, { credentials: "same-origin" })
          .then(r => r.ok ? r.json() : Promise.reject())
          .then(data => {
            const rec = data.record || data.data || {};
            const user = rec.userId || {};
            document.getElementById("offline-indicator").innerHTML = "";
            document.getElementById("patient-name").textContent = user.fullName || "Unknown";
            document.getElementById("blood-type").textContent = rec.bloodType || "—";
            document.getElementById("conditions").textContent = (rec.conditions || []).join(", ") || "None";
            document.getElementById("allergies").textContent = (rec.allergies || []).join(", ") || "None";
            const ec = rec.emergencyContact || {};
            document.getElementById("contact-name").textContent = (ec.name || "—") + " (" + (ec.phone || "—") + ")";
            if (ec.phone) document.getElementById("call-btn").href = "tel:" + ec.phone;
          })
          .catch(() => { /* keep offline render */ });
      }
    })();
  </script>
</body>
</html>`);
});

import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const openViewer = (req, res) => {
  const filePath = path.join(__dirname, "..", "public", "viewer.html");
  res.sendFile(filePath);
};
