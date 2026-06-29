import { catchAsync } from "../utils/catchAsync.js";
import { sendLocalizedResponse } from "../utils/response.js";
import { msg } from "../utils/i18n.js";
import * as PaymentService from "../services/paymentService.js";

export const createSetupIntent = catchAsync(async (req, res) => {
  const { appointmentId } = req.body;
  const result = await PaymentService.createSetupIntent(appointmentId, req.user.id);
  sendLocalizedResponse(
    res,
    200,
    msg("تم إنشاء طلب الدفع", "Setup intent created"),
    result,
    req.lang,
  );
});

export const attachPaymentMethod = catchAsync(async (req, res) => {
  const { appointmentId, setupIntentId } = req.body;
  const result = await PaymentService.attachPaymentMethod(
    appointmentId,
    req.user.id,
    setupIntentId,
  );
  sendLocalizedResponse(
    res,
    200,
    msg("تم ربط طريقة الدفع", "Payment method attached"),
    result,
    req.lang,
  );
});

export const getPayment = catchAsync(async (req, res) => {
  const payment = await PaymentService.getPayment(
    req.params.appointmentId,
    req.user.id,
  );
  sendLocalizedResponse(
    res,
    200,
    msg("تم جلب معلومات الدفع", "Payment fetched"),
    { payment },
    req.lang,
  );
});

export const webhook = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  await PaymentService.handleWebhook(req.body, sig);
  res.status(200).json({ received: true });
});
