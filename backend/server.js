// 1. Move dotenv and path to the very top to load envs immediately
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import http from "http";
import { fileURLToPath } from "url";

// Determine which file to load based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production'  
  : '.env.local';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });
dotenv.config(); // Fallback to standard .env

// 2. Now import your local files that depend on those environment variables
import app from "./app.js";
import connectDB from "./Src/Config/db.js";
import AuthService from "./Src/Services/AuthService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- 1. ✅ FIXED: Environment validation at startup ---
try {
  AuthService.validateEnvironmentVariables();
  console.log("✅ Environment validation passed");
} catch (error) {
  console.error("❌ Environment validation failed:", error.message);
  process.exit(1);
}

// --- 2. Setup directories ---
const UPLOADS_PATH = process.env.UPLOADS_PATH || path.join(__dirname, "Uploads");

const uploadDirs = [
  path.join(UPLOADS_PATH, "Certificates"),
  path.join(UPLOADS_PATH, "PersonalPhoto"),
  path.join(UPLOADS_PATH, "Radiology"),
  path.join(UPLOADS_PATH, "LabTests"),
  path.join(UPLOADS_PATH, "Posts"),
];

const createDirIfNotExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o755 });
    console.log(`✅ Created directory: ${dir}`);
  }
};

uploadDirs.forEach(createDirIfNotExists);

// --- 3. Database connection ---

About GeminiOpens in a new window
Gemini AppOpens in a new window
SubscriptionsOpens in a new window
For BusinessOpens in a new window
Conversation with Gemini
connectDB()

  .then(() => {

    // ✅ FIXED: Create HTTP server with timeout configuration

    const server = http.createServer(app);



    // Set request timeout

    server.timeout = 30 * 1000; // 30 seconds



    // Keep-alive timeout

    server.keepAliveTimeout = 65 * 1000; // 65 seconds



    // Handle client errors gracefully

    server.on("clientError", (err, socket) => {

      if (err.code === "ECONNRESET" || !socket.writable) {

        return;

      }



      if (err instanceof SyntaxError && err.status === 400) {

        socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");

      } else if (err.code === "HPE_INVALID_CONSTANT") {

        socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");

      } else {

        socket.end("HTTP/1.1 500 Internal Server Error\r\n\r\n");

      }

    });



    const PORT = process.env.PORT || 5000 ;

    const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;



    const server_instance = server.listen(PORT, () => {

      console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);

      console.log(`📡 API URL: ${APP_URL}`);

      console.log(`🏥 Health Check: ${APP_URL}/health`);

    });



    // --- 4. Graceful shutdown handlers ---

    process.on("SIGTERM", () => {

      console.log("⚠️ SIGTERM received, shutting down gracefully");

      server_instance.close(() => {

        console.log("✅ HTTP server closed");

        process.exit(0);

      });



      setTimeout(() => {

        console.error("❌ Could not close connections in time, forcefully shutting down");

        process.exit(1);

      }, 10 * 1000);

    });



    process.on("SIGINT", () => {

      console.log("⚠️ SIGINT received, shutting down gracefully");

      server_instance.close(() => {

        console.log("✅ HTTP server closed");

        process.exit(0);

      });



      setTimeout(() => {

        console.error("❌ Could not close connections in time, forcefully shutting down");

        process.exit(1);

      }, 10 * 1000);

    });



    // --- 5. Unhandled error handlers ---

    process.on("unhandledRejection", (err) => {

      console.error("❌ Unhandled Rejection:", err);

      server_instance.close(() => {

        process.exit(1);

      });

    });



    process.on("uncaughtException", (err) => {

      console.error("❌ Uncaught Exception:", err);

      server_instance.close(() => {

        process.exit(1);

      });

    });

  }) // This closing brace for .then() was missing in your original logic

  .catch((err) => {

    console.error("❌ Failed to connect to database:", err.message);

    process.exit(1);

  });











connectDB().then(() => {

  const PORT = process.env.PORT;



  const server = app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

  });



  // 🔥 SOCKET INIT

  initSocket(server);



  process.on("unhandledRejection", (err) => {

    console.log(err);

    server.close(() => process.exit(1));

  });



  process.on("uncaughtException", (err) => {

    console.log(err);

    server.close(() => process.exit(1));

  });

});









ادمحهم من فير م يتغير ويبوظ

لدمج الكودين معاً بشكل صحيح، سنعتمد على الهيكل الأكثر أماناً (الأول) الذي يحتوي على إعدادات الـ Timeout، الـ Graceful Shutdown، ومعالجة أخطاء الـ Client Error، ثم نقوم بحقن سطر تشغيل الـ Socket.io بداخله.

إليك الكود المدمج والمنظم:

You stopped this response
connectDB()

  .then(() => {

    // ✅ FIXED: Create HTTP server with timeout configuration

    const server = http.createServer(app);



    // Set request timeout

    server.timeout = 30 * 1000; // 30 seconds



    // Keep-alive timeout

    server.keepAliveTimeout = 65 * 1000; // 65 seconds



    // Handle client errors gracefully

    server.on("clientError", (err, socket) => {

      if (err.code === "ECONNRESET" || !socket.writable) {

        return;

      }



      if (err instanceof SyntaxError && err.status === 400) {

        socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");

      } else if (err.code === "HPE_INVALID_CONSTANT") {

        socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");

      } else {

        socket.end("HTTP/1.1 500 Internal Server Error\r\n\r\n");

      }

    });



    const PORT = process.env.PORT ;

    const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;



    const server_instance = server.listen(PORT, () => {

      console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);

      console.log(`📡 API URL: ${APP_URL}`);

      console.log(`🏥 Health Check: ${APP_URL}/health`);

    });



    // --- 4. Graceful shutdown handlers ---

    process.on("SIGTERM", () => {

      console.log("⚠️ SIGTERM received, shutting down gracefully");

      server_instance.close(() => {

        console.log("✅ HTTP server closed");

        process.exit(0);

      });



      setTimeout(() => {

        console.error("❌ Could not close connections in time, forcefully shutting down");

        process.exit(1);

      }, 10 * 1000);

    });



    process.on("SIGINT", () => {

      console.log("⚠️ SIGINT received, shutting down gracefully");

      server_instance.close(() => {

        console.log("✅ HTTP server closed");

        process.exit(0);

      });



      setTimeout(() => {

        console.error("❌ Could not close connections in time, forcefully shutting down");

        process.exit(1);

      }, 10 * 1000);

    });



    // --- 5. Unhandled error handlers ---

    process.on("unhandledRejection", (err) => {

      console.error("❌ Unhandled Rejection:", err);

      server_instance.close(() => {

        process.exit(1);

      });

    });



    process.on("uncaughtException", (err) => {

      console.error("❌ Uncaught Exception:", err);

      server_instance.close(() => {

        process.exit(1);

      });

    });

  }) // This closing brace for .then() was missing in your original logic

  .catch((err) => {

    console.error("❌ Failed to connect to database:", err.message);

    process.exit(1);

  });











connectDB().then(() => {

  const PORT = process.env.PORT;



  const server = app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

  });



  // 🔥 SOCKET INIT

  initSocket(server);



  process.on("unhandledRejection", (err) => {

    console.log(err);

    server.close(() => process.exit(1));

  });



  process.on("uncaughtException", (err) => {

    console.log(err);

    server.close(() => process.exit(1));

  });

});









ادمحهم من غير م يتغيرو ويبوظ

لدمج الكودين بشكل سليم، سنأخذ "الهيكل القوي" من الكود الأول (الذي يحتوي على إعدادات الـ Timeout والإغلاق الآمن) ونضيف إليه سطر تشغيل الـ Socket من الكود الثاني.

إليك الكود المدمج والجاهز للعمل:

JavaScript
connectDB()
  .then(() => {
    // 1. إنشاء السيرفر مع تمرير تطبيق express (app)
    const server = http.createServer(app);

    // 2. إعدادات الوقت المستقطع (Timeouts) للأداء والاستقرار
    server.timeout = 30 * 1000; // 30 ثانية
    server.keepAliveTimeout = 65 * 1000; // 65 ثانية

    // 🔥 دمج السوكيت: يتم تمرير السيرفر الذي أنشأناه لـ initSocket
    initSocket(server);

    // 3. معالجة أخطاء العميل (Client Errors)
    server.on("clientError", (err, socket) => {
      if (err.code === "ECONNRESET" || !socket.writable) {
        return;
      }

      if (err instanceof SyntaxError && err.status === 400) {
        socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
      } else if (err.code === "HPE_INVALID_CONSTANT") {
        socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
      } else {
        socket.end("HTTP/1.1 500 Internal Server Error\r\n\r\n");
      }
    });

    const PORT = process.env.PORT || 5000;
    const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

    // 4. بدء الاستماع للطلبات
    const server_instance = server.listen(PORT, () => {
      console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`📡 API URL: ${APP_URL}`);
      console.log(`🏥 Health Check: ${APP_URL}/health`);
    });

    // 5. معالجة الإغلاق الآمن (Graceful Shutdown)
    const gracefulShutdown = (signal) => {
      console.log(`⚠️ ${signal} received, shutting down gracefully`);
      server_instance.close(() => {
        console.log("✅ HTTP server closed");
        process.exit(0);
      });

      setTimeout(() => {
        console.error("❌ Could not close connections in time, forcefully shutting down");
        process.exit(1);
      }, 10 * 1000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // 6. معالجة الأخطاء غير المتوقعة (Unhandled Errors)
    process.on("unhandledRejection", (err) => {
      console.error("❌ Unhandled Rejection:", err);
      server_instance.close(() => process.exit(1));
    });

    process.on("uncaughtException", (err) => {
      console.error("❌ Uncaught Exception:", err);
      server_instance.close(() => process.exit(1));
    });

  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err.message);
    process.exit(1);
  });
