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
import 'package:Axon/core/extensions/localization_ext.dart';


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

                    FormLabel(text: context.l10n.email),

                    SizedBox(height: 8.h),

                    CustomTextField(
                      controller: cubit.emailController,
                      hintText: context.l10n.enter_email,
                      prefixIcon: Icon(
                        Icons.email_outlined,
                        color: Colors.grey.shade600,
                      ),
                      validator: ValidationHelper.validateEmail,
                    ),

                    SizedBox(height: 22.h),

                    FormLabel(text: context.l10n.password),

                    SizedBox(height: 8.h),

                    CustomTextField(
                      controller: cubit.passwordController,
                      hintText: context.l10n.enter_password,
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
                      ),
                    ),

                    SizedBox(height: 35.h),

                    CustomButton(
                      text: context.l10n.sign_in,
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
                          text: context.l10n.dont_have_account,
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
                            text: context.l10n.sign_up,
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
                            text: context.l10n.sign_in_google,
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
