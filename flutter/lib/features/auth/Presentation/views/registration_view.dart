import 'dart:io';

import 'package:Axon/core/di/di.dart';
import 'package:Axon/core/helpers/validation_helper.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/auth/Presentation/manager/doctor registration/doctor_registration_cubit.dart';
import 'package:Axon/features/auth/Presentation/manager/doctor registration/doctor_registration_state.dart';
import 'package:Axon/features/auth/Presentation/manager/selected gender/gender_cubit.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/gender_selector.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/registration_profile_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:image_picker/image_picker.dart';
import 'package:Axon/core/extensions/localization_ext.dart';
import 'widgets/form_label.dart';

class RegistrationView extends StatelessWidget {
  const RegistrationView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<DoctorRegistrationCubit>(),
      child: BlocBuilder<DoctorRegistrationCubit, DoctorRegistrationState>(
        builder: (context, state) {
          final cubit = context.read<DoctorRegistrationCubit>();

          // 📸 صورة البروفايل
          XFile? image;
          if (state is DoctorRegistrationInitial) {
            image = state.personalFile;
          }

          return Scaffold(
            backgroundColor: AppColors.white,
            body: SingleChildScrollView(
              padding: EdgeInsets.symmetric(horizontal: 24.w),
              child: Form(
                key: cubit.formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(height: 55.h),

                    // 🔥 Profile Image
                    Center(
                      child: ProfileImagePicker(
                        image: image != null ? File(image.path) : null,
                        onPick: () {
                          cubit.pickImage(ImageType.personal);
                        },
                      ),
                    ),

                    SizedBox(height: 25.h),

                    // 🔥 Name
                    FormLabel(text: context.l10n.full_name),
                    CustomTextField(
                      controller: cubit.fullNameController,
                      hintText: context.l10n.enter_full_name,
                      validator: ValidationHelper.validateName,
                    ),

                    SizedBox(height: 22.h),

                    // 🔥 Email
                    FormLabel(text: context.l10n.email),
                    CustomTextField(
                      controller: cubit.emailController,
                      hintText: context.l10n.enter_email,
                      validator: ValidationHelper.validateEmail,
                    ),

                    SizedBox(height: 22.h),

                    // 🔥 Phone
                    FormLabel(text: context.l10n.phone_number),
                    CustomTextField(
                      controller: cubit.phoneController,
                      hintText: context.l10n.enter_phone,
                      validator: ValidationHelper.validatePhone,
                    ),

                    SizedBox(height: 22.h),

                    // 🔥 Gender
                    FormLabel(text: context.l10n.gender),
                    BlocBuilder<GenderCubit, int>(
                      builder: (context, selectedGender) {
                        return GenderSelector(
                          selected: selectedGender,
                          onSelect: (index) {
                            context.read<GenderCubit>().changeGender(index);
                          },
                        );
                      },
                    ),

                    SizedBox(height: 22.h),

                    // 🔥 Password
                    FormLabel(text: context.l10n.password),
                    CustomTextField(
                      controller: cubit.passwordController,
                      hintText: context.l10n.create_password,
                      isPassword: true,
                      validator: ValidationHelper.validatePassword,
                    ),

                    SizedBox(height: 25.h),

                    // 🔥 Next Button
                    CustomButton(
                      text: context.l10n.next,
                      height: 50.h,
                      borderRadius: 10,
                      onPressed: () {
                        if (cubit.formKey.currentState!.validate()) {
                          Navigator.pushNamed(context, AppRoutes.selectRole);
                        }
                      },
                    ),

                    SizedBox(height: 25.h),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        TextApp(
                          text: context.l10n.already_have_account,
                          fontSize: 14.sp,
                          color: Colors.grey,
                        ),
                        SizedBox(width: 4.w),
                        GestureDetector(
                          onTap: () {
                            Navigator.pushNamed(context, AppRoutes.login);
                          },
                          child: TextApp(
                            text: context.l10n.login,
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
