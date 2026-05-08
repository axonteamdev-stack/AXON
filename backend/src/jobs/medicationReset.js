import cron from "node-cron";
import { logger } from "../config/logger.js";
import { resetDailyTrackers } from "../services/medicationService.js";

export const startMedicationResetJob = () => {
  cron.schedule(
    "0 0 * * *",
    async () => {
      logger.info("🕐 Running daily medication tracker reset...");
      try {
        const result = await resetDailyTrackers();
        logger.info(`✅ Reset ${result.modifiedCount} medication trackers`);
      } catch (err) {
        logger.error({ err: err.message }, "Failed to reset medication trackers");
      }
    },
    { timezone: process.env.CRON_TZ || "Africa/Cairo" }
  );
};
