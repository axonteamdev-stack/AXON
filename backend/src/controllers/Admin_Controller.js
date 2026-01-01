import User from '../models/UserModel.js';
import { catchAsync } from '../utils/AppError.js';
import AppError from '../utils/AppError.js';

// 1. إضافة مستخدم جديد (بواسطة الأدمن)
export const addUser = catchAsync(async (req, res) => {
    const newUser = await User.create({
        ...req.body,
        isVerified: true // أي مستخدم يضيفه الأدمن يكون مفعلاً تلقائياً
    });
    res.status(201).json({ status: 'success', data: newUser });
});

// 2. تفعيل طبيب موجود (تغيير حالته لـ true)
export const activateDoctor = catchAsync(async (req, res, next) => {
    const doctor = await User.findOneAndUpdate(
        { _id: req.params.id, role: 'doctor' },
        { isVerified: true },
        { new: true, runValidators: true }
    );

    if (!doctor) {
        return next(new AppError('لم يتم العثور على طبيب بهذا المعرف', 404));
    }

    res.status(200).json({ status: 'success', message: "تم تفعيل حساب الطبيب بنجاح" });
});

// 3. تعديل بيانات مستخدم (واحد)
export const updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { 
        new: true, 
        runValidators: true 
    });
    
    if (!user) return next(new AppError('المستخدم غير موجود', 404));
    
    res.status(200).json({ status: 'success', data: user });
});

// 4. حذف مستخدم نهائياً
export const deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) return next(new AppError('المستخدم غير موجود', 404));
    
    res.status(204).json({ status: 'success', data: null });
});
