import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_app_bar.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/features/auth/Presentation/manager/forgot password/forgot_password_cubit.dart';
import 'package:Axon/features/auth/Presentation/views/reset_password_view.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/form_label.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:pin_code_fields/pin_code_fields.dart';

class ForgotPasswordOtpView extends StatelessWidget {
  const ForgotPasswordOtpView({super.key});

  @override
  Widget build(BuildContext context) {
    final cubit = context.read<ForgotPasswordCubit>();

    return Scaffold(
      backgroundColor: AppColors.white,
      body: Column(
        children: [
          CustomAppBar(title: "Otp View"),
          SingleChildScrollView(
            padding: EdgeInsets.symmetric(horizontal: 24.w),

            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(height: 80.h),

                FormLabel(text: context.l10n.otp_code),

                SizedBox(height: 12.h),

                PinCodeTextField(
                  appContext: context,
                  length: 6,
                  controller: cubit.otpController,
                  keyboardType: TextInputType.number,
                  animationType: AnimationType.fade,
                  onChanged: (value) {},

                  pinTheme: PinTheme(
                    shape: PinCodeFieldShape.box,
                    borderRadius: BorderRadius.circular(12),
                    fieldHeight: 55.h,
                    fieldWidth: 50.w,

                    activeColor: AppColors.primaryColor,
                    selectedColor: AppColors.primaryColor,
                    inactiveColor: Colors.grey.shade300,

                    activeFillColor: Colors.white,
                    selectedFillColor: Colors.white,
                    inactiveFillColor: Colors.white,
                  ),

                  enableActiveFill: true,
                  cursorColor: AppColors.primaryColor,
                  textStyle: TextStyle(
                    fontSize: 20.sp,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),

                SizedBox(height: 40.h),

                CustomButton(
                  text: context.l10n.verify,
                  height: 50.h,
                  onPressed: () {
                    cubit.verifyOtp(context);

                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => BlocProvider.value(
                          value: cubit,
                          child: const ResetPasswordView(),
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
