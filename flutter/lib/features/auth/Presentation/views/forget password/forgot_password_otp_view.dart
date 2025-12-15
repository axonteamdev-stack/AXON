import 'package:Axon/core/extensions/context_extension.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/auth/Presentation/manager/forgot password/forgot_password_cubit.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/form_label.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:pin_code_fields/pin_code_fields.dart';

class ForgotPasswordOtpView extends StatelessWidget {
  const ForgotPasswordOtpView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => ForgotPasswordCubit(),
      child: BlocBuilder<ForgotPasswordCubit, ForgotPasswordState>(
        builder: (context, state) {
          final cubit = context.read<ForgotPasswordCubit>();

          return Scaffold(
            backgroundColor: AppColors.white,
            body: SingleChildScrollView(
              padding: EdgeInsets.symmetric(horizontal: 24.w),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 80.h),
                  const TextApp(
                    text: 'Verification Code',
                    fontSize: 22,
                    weight: AppTextWeight.semiBold,
                  ),
                  SizedBox(height: 12.h),
                  const TextApp(
                    text:
                        'Enter the 4-digit code sent to your email address',
                    fontSize: 14,
                    color: AppColors.grey,
                  ),
                  SizedBox(height: 35.h),
                  const FormLabel(text: 'OTP Code'),
                  SizedBox(height: 12.h),
                  PinCodeTextField(
                    appContext: context,
                    length: 4,
                    controller: cubit.otpController,
                    keyboardType: TextInputType.number,
                    animationType: AnimationType.fade,
                    enableActiveFill: true,
                    cursorColor: AppColors.primaryColor,
                    textStyle: TextStyle(
                      fontSize: 20.sp,
                      fontWeight: FontWeight.w600,
                      color: AppColors.black,
                    ),
                    pinTheme: PinTheme(
                      shape: PinCodeFieldShape.box,
                      borderRadius: BorderRadius.circular(8.r),
                      fieldHeight: 55.h,
                      fieldWidth: 55.w,
                      activeColor: AppColors.primaryColor,
                      selectedColor: AppColors.primaryColor,
                      inactiveColor: AppColors.grey,
                      activeFillColor: AppColors.white,
                      selectedFillColor: AppColors.white,
                      inactiveFillColor: AppColors.white,
                    ),
                    onChanged: (value) {},
                  ),
                  SizedBox(height: 40.h),
                  CustomButton(
                    text: 'Verify',
                    height: 50.h,
                    onPressed: () {
                      context.pushName(AppRoutes.resetPassword);
                    },
                  ),
                  SizedBox(height: 25.h),
                  Center(
                    child: GestureDetector(
                      onTap: () {},
                      child: const TextApp(
                        text: 'Resend Code',
                        fontSize: 14,
                        color: AppColors.primaryColor,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
