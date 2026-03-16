import 'package:Axon/core/extensions/context_extension.dart';
import 'package:Axon/core/helpers/validation_helper.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/auth/Presentation/manager/forgot%20password/forgot_password_cubit.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/form_label.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ResetPasswordView extends StatelessWidget {
  const ResetPasswordView({super.key});

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
              child: Form(
                key: cubit.formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(height: 80.h),
                    const TextApp(
                      text: 'Create New Password',
                      fontSize: 22,
                      weight: AppTextWeight.semiBold,
                    ),
                    SizedBox(height: 30.h),
                    const FormLabel(text: 'New Password'),
                    CustomTextField(
                      controller: cubit.passwordController,
                      hintText: 'Enter new password',
                      isPassword: true,
                      validator: ValidationHelper.validatePassword,
                    ),
                    SizedBox(height: 22.h),
                    const FormLabel(text: 'Confirm Password'),
                    CustomTextField(
                      controller: cubit.confirmPasswordController,
                      hintText: 'Confirm password',
                      isPassword: true,
                      validator: (value) =>
                          ValidationHelper.validateConfirmPassword(
                        value,
                        cubit.passwordController.text,
                      ),
                    ),
                    SizedBox(height: 35.h),
                    CustomButton(
                      text: 'Reset Password',
                      height: 50.h,
                      onPressed: () {
                        context.pushNamedAndRemoveUntil(AppRoutes.login);
                      },
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
