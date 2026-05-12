import { catchAsync } from "../utils/catchAsync.js";
import { sendResponse } from "../utils/response.js";
import { msg } from "../utils/i18n.js";
import { generateTokens, clearTokens } from "../services/tokenService.js";
import { moveFromTemp, cleanupTemp } from "../middlewares/upload.js";
import * as AuthService from "../services/authService.js";

export const signupPatient = catchAsync(async (req, res) => {
    const user = await AuthService.registerPatient(req.body);
    const tokens = generateTokens(res, user._id);
    sendResponse(res, 201, msg("تم التسجيل بنجاح", "Registration successful"), {
        user,
        tokens,
    });
});

export const signupDoctor = catchAsync(async (req, res) => {
    const data = { ...req.body };

    const licenseFile = req.files?.licenseImage?.[0];
    const photoFile = req.files?.personalPhoto?.[0];

    try {
        if (licenseFile) {
            const { url } = moveFromTemp(licenseFile.filename, "licenseImage");
            data.licenseImage = url;
        }
        if (photoFile) {
            const { url } = moveFromTemp(photoFile.filename, "personalPhoto");
            data.personalPhoto = url;
        }

        const user = await AuthService.registerDoctor(data);
        sendResponse(
            res,
            201,
            msg("تم التسجيل بنجاح", "Registration successful"),
            {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        );
    } catch (err) {
        cleanupTemp(req.files);
        throw err;
    }
});

export const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await AuthService.authenticate(email, password);
    const tokens = generateTokens(res, user._id);
    sendResponse(res, 200, msg("تم تسجيل الدخول بنجاح", "Login successful"), {
        user,
        tokens,
    });
});

export const logout = (req, res) => {
    clearTokens(res);
    sendResponse(res, 200, msg("تم الخروج بنجاح", "Logged out"));
};

export const refreshAccessToken = catchAsync(async (req, res) => {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    const accessToken = await AuthService.refreshAccessToken(token);
    sendResponse(res, 200, msg("تم تجديد التوكن", "Token refreshed"), {
        accessToken,
    });
});

export const forgotPassword = catchAsync(async (req, res) => {
    await AuthService.sendResetCode(req.body.email);
    sendResponse(res, 200, msg("تم إرسال الكود", "Code sent"));
});

export const resetPassword = catchAsync(async (req, res) => {
    await AuthService.resetPassword(req.body.token, req.body.password);
    sendResponse(
        res,
        200,
        msg("تم التغيير بنجاح", "Password reset successful"),
    );
});
