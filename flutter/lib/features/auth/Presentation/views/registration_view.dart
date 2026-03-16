import 'package:Axon/core/helpers/validation_helper.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/auth/Presentation/manager/signup/registration_cubit.dart';
import 'package:Axon/features/auth/Presentation/manager/upload image/upload_image_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'widgets/form_label.dart';
import 'widgets/gender_selector.dart';
import 'widgets/registration_profile_image.dart';
import 'widgets/terms_checkbox.dart';

class RegistrationView extends StatelessWidget {
  const RegistrationView({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => RegistrationCubit()),
        BlocProvider(create: (_) => UploadImageCubit()),
      ],
      child: BlocBuilder<RegistrationCubit, RegistrationState>(
        builder: (context, state) {
          final regCubit = context.read<RegistrationCubit>();
          final imageCubit = context.watch<UploadImageCubit>();

          return Scaffold(
            backgroundColor: AppColors.white,
            body: SingleChildScrollView(
              padding: EdgeInsets.symmetric(horizontal: 24.w),
              child: Form(
                key: regCubit.formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(height: 55.h),

                    Center(
                      child: ProfileImagePicker(
                        image: imageCubit.state.image,
                        onPick: imageCubit.pickImage,
                      ),
                    ),

                    SizedBox(height: 25.h),

                    FormLabel(text: "Full Name"),
                    CustomTextField(
                      controller: regCubit.fullNameController,
                      hintText: "Enter your full name",
                      validator: ValidationHelper.validateName,
                    ),

                    SizedBox(height: 22.h),

                    FormLabel(text: "Email"),
                    SizedBox(height: 8.h),
                    CustomTextField(
                      controller: regCubit.emailController,
                      hintText: "Enter your email",
                      validator: ValidationHelper.validateEmail,
                    ),

                    SizedBox(height: 22.h),

                    FormLabel(text: "Phone Number"),
                    CustomTextField(
                      controller: regCubit.phoneController,
                      hintText: "Enter your phone number",
                      validator: ValidationHelper.validatePhone,
                    ),

                    SizedBox(height: 22.h),

                    FormLabel(text: "Gender"),
                    GenderSelector(
                      selected: regCubit.selectedGender,
                      onSelect: regCubit.pickGender,
                    ),

                    SizedBox(height: 22.h),

                    FormLabel(text: "Password"),
                    CustomTextField(
                      controller: regCubit.passwordController,
                      hintText: "Create a strong password",
                      isPassword: true,
                      validator: ValidationHelper.validatePassword,
                    ),

                    SizedBox(height: 15.h),

                    TermsCheckbox(
                      checked: regCubit.termsAccepted,
                      onChanged: regCubit.toggleTerms,
                    ),

                    SizedBox(height: 20.h),

                    CustomButton(
                      text: "Next",
                      height: 50.h,
                      borderRadius: 10,
                      onPressed: () {
                        Navigator.pushNamed(context, AppRoutes.selectRole);
                      },
                    ),

                    SizedBox(height: 25.h),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        TextApp(
                          text: "Already have an account?",
                          fontSize: 14.sp,
                          color: Colors.grey,
                        ),
                        SizedBox(width: 4.w),
                        GestureDetector(
                          onTap: () {
                            Navigator.pushNamed(context, AppRoutes.login);
                          },
                          child: TextApp(
                            text: "Login",
                            fontSize: 14.sp,
                            weight: AppTextWeight.regular,
                            color: AppColors.primaryColor,
                          ),
                        ),
                      ],
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
