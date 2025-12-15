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

class ForgotPasswordEmailView extends StatelessWidget {
  const ForgotPasswordEmailView({super.key});

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

                    TextApp(
                      text: "Forgot Password",
                      fontSize: 22.sp,
                      weight: AppTextWeight.semiBold,
                    ),

                    SizedBox(height: 12.h),

                    TextApp(
                      text: "Enter your email to receive a verification code",
                      fontSize: 14.sp,
                      color: Colors.grey,
                    ),

                    SizedBox(height: 30.h),

                    FormLabel(text: "Email"),
                    SizedBox(height: 8.h),

                    CustomTextField(
                      controller: cubit.emailController,
                      hintText: "Enter your email",
                      validator: ValidationHelper.validateEmail,
                    ),

                    SizedBox(height: 35.h),

                    CustomButton(
                      text: "Send Code",
                      height: 50.h,
                      isLoading: state is ForgotPasswordLoading,
                      onPressed: () {
                        cubit.sendEmail(context);
                        Navigator.pushNamed(
                          context,
                          AppRoutes.forgotPasswordOtp,
                        );
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
