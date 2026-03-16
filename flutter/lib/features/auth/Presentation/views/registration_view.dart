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
<<<<<<< HEAD
=======
import 'package:Axon/core/extensions/localization_ext.dart';

>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb

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

<<<<<<< HEAD
                    FormLabel(text: "Full Name"),
                    CustomTextField(
                      controller: regCubit.fullNameController,
                      hintText: "Enter your full name",
=======
                    FormLabel(text: context.l10n.full_name),
                    CustomTextField(
                      controller: regCubit.fullNameController,
                      hintText: context.l10n.enter_full_name,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                      validator: ValidationHelper.validateName,
                    ),

                    SizedBox(height: 22.h),

<<<<<<< HEAD
                    FormLabel(text: "Email"),
                    SizedBox(height: 8.h),
                    CustomTextField(
                      controller: regCubit.emailController,
                      hintText: "Enter your email",
=======
                    FormLabel(text: context.l10n.email),
                    SizedBox(height: 8.h),
                    CustomTextField(
                      controller: regCubit.emailController,
                      hintText: context.l10n.enter_email,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                      validator: ValidationHelper.validateEmail,
                    ),

                    SizedBox(height: 22.h),

<<<<<<< HEAD
                    FormLabel(text: "Phone Number"),
                    CustomTextField(
                      controller: regCubit.phoneController,
                      hintText: "Enter your phone number",
=======
                    FormLabel(text: context.l10n.phone_number),
                    CustomTextField(
                      controller: regCubit.phoneController,
                      hintText: context.l10n.enter_phone,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                      validator: ValidationHelper.validatePhone,
                    ),

                    SizedBox(height: 22.h),

<<<<<<< HEAD
                    FormLabel(text: "Gender"),
=======
                    FormLabel(text: context.l10n.gender),
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                    GenderSelector(
                      selected: regCubit.selectedGender,
                      onSelect: regCubit.pickGender,
                    ),

                    SizedBox(height: 22.h),

<<<<<<< HEAD
                    FormLabel(text: "Password"),
                    CustomTextField(
                      controller: regCubit.passwordController,
                      hintText: "Create a strong password",
=======
                    FormLabel(text: context.l10n.password),
                    CustomTextField(
                      controller: regCubit.passwordController,
                      hintText: context.l10n.create_password,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
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
<<<<<<< HEAD
                      text: "Next",
=======
                      text: context.l10n.next,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
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
<<<<<<< HEAD
                          text: "Already have an account?",
=======
                          text: context.l10n.already_have_account,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
                          fontSize: 14.sp,
                          color: Colors.grey,
                        ),
                        SizedBox(width: 4.w),
                        GestureDetector(
                          onTap: () {
                            Navigator.pushNamed(context, AppRoutes.login);
                          },
                          child: TextApp(
<<<<<<< HEAD
                            text: "Login",
=======
                            text: context.l10n.login,
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
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
