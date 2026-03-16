import 'package:Axon/core/helpers/validation_helper.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/auth/Presentation/manager/login/login_cubit.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/form_label.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/or_divider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
<<<<<<< HEAD
=======
import 'package:Axon/core/extensions/localization_ext.dart';

>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb

class LoginView extends StatelessWidget {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => LoginCubit(),
      child: BlocConsumer<LoginCubit, LoginState>(
        listener: (context, state) {},
        builder: (context, state) {
          final cubit = context.read<LoginCubit>();

          return Scaffold(
            backgroundColor: AppColors.white,
            body: SingleChildScrollView(
              padding: EdgeInsets.symmetric(horizontal: 24.w),
              child: Form(
                key: cubit.formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(child: Image.asset(AppImages.logoApp, width: 250.w)),

<<<<<<< HEAD
                    FormLabel(text: "Email"),
=======
                    FormLabel(text: context.l10n.email),
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb

                    SizedBox(height: 8.h),

                    CustomTextField(
                      controller: cubit.emailController,
<<<<<<< HEAD
                      hintText: "Enter your email",
=======
                      hintText: context.l10n.enter_email,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                      prefixIcon: Icon(
                        Icons.email_outlined,
                        color: Colors.grey.shade600,
                      ),
                      validator: ValidationHelper.validateEmail,
                    ),

                    SizedBox(height: 22.h),

<<<<<<< HEAD
                    FormLabel(text: "Password"),
=======
                    FormLabel(text: context.l10n.password),
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb

                    SizedBox(height: 8.h),

                    CustomTextField(
                      controller: cubit.passwordController,
<<<<<<< HEAD
                      hintText: "Enter your password",
=======
                      hintText: context.l10n.enter_password,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                      isPassword: true,
                      prefixIcon: Icon(
                        Icons.lock_outline,
                        color: Colors.grey.shade600,
                      ),
                      validator: ValidationHelper.validatePassword,
                    ),

                    SizedBox(height: 10.h),

                    Align(
                      alignment: Alignment.centerRight,
<<<<<<< HEAD
                      child: TextApp(
                        text: "Forgot Password?",
                        fontSize: 12.sp,
                        weight: AppTextWeight.regular,
                        color: AppColors.primaryColor,
=======
                      child: InkWell(
                        onTap: () {
                          Navigator.pushNamed(
                            context,
                            AppRoutes.forgotPasswordEmail,
                          );
                        },
                        child: TextApp(
                          text: context.l10n.forgot_password,
                          fontSize: 12.sp,
                          weight: AppTextWeight.regular,
                          color: AppColors.primaryColor,
                        ),
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                      ),
                    ),

                    SizedBox(height: 35.h),

                    CustomButton(
<<<<<<< HEAD
                      text: "Sign In",
=======
                      text: context.l10n.sign_in,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                      height: 50.h,
                      borderRadius: 10,
                      isLoading: state is LoginLoading,
                      onPressed: () => cubit.login(context),
                    ),

                    SizedBox(height: 25.h),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        TextApp(
<<<<<<< HEAD
                          text: "Don’t have an account?",
=======
                          text: context.l10n.dont_have_account,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                          fontSize: 14.sp,
                          color: Colors.grey,
                        ),
                        SizedBox(width: 4.w),
                        GestureDetector(
                          onTap: () {
                            Navigator.pushNamed(
                              context,
                              AppRoutes.registration,
                            );
                          },
                          child: TextApp(
<<<<<<< HEAD
                            text: "Sign Up",
=======
                            text: context.l10n.sign_up,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                            fontSize: 14.sp,
                            weight: AppTextWeight.regular,
                            color: AppColors.primaryColor,
                          ),
                        ),
                      ],
                    ),

                    SizedBox(height: 22.h),

                    const OrDivider(),

                    SizedBox(height: 25.h),

                    Container(
                      height: 50.h,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10.r),
                        border: Border.all(color: Colors.grey.shade300),
                        color: Colors.white,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Image.asset(
                            AppImages.google,
                            width: 24.w,
                            height: 24.h,
                          ),
                          SizedBox(width: 12.w),
                          TextApp(
<<<<<<< HEAD
                            text: "Sign in with Google",
=======
                            text: context.l10n.sign_in_google,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                            fontSize: 15.sp,
                            weight: AppTextWeight.semiBold,
                          ),
                        ],
                      ),
                    ),

                    SizedBox(height: 40.h),
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
