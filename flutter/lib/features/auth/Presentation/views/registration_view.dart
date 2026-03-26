import 'dart:io';

import 'package:Axon/core/di/di.dart';
import 'package:Axon/core/helpers/validation_helper.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/service/shared_pref/shared_pref.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
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

/// ================== MAIN VIEW ==================
class RegistrationView extends StatelessWidget {
  const RegistrationView({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => getIt<DoctorRegistrationCubit>()),
        BlocProvider(create: (_) => getIt<GenderCubit>()),
      ],
      child: const RegistrationBody(),
    );
  }
}

/// ================== BODY ==================
class RegistrationBody extends StatelessWidget {
  const RegistrationBody({super.key});

  @override
  Widget build(BuildContext context) {
    final cubit = context.read<DoctorRegistrationCubit>();

    return BlocBuilder<DoctorRegistrationCubit, DoctorRegistrationState>(
      builder: (context, state) {
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

                  /// profile image
                  Center(
                    child: ProfileImagePicker(
                      image: image != null ? File(image.path) : null,
                      onPick: () {
                        cubit.pickImage(ImageType.personal);
                      },
                    ),
                  ),

                  SizedBox(height: 25.h),

                  /// full name
                  FormLabel(text: context.l10n.full_name),
                  CustomTextField(
                    controller: cubit.fullNameController,
                    hintText: context.l10n.enter_full_name,
                    validator: ValidationHelper.validateName,
                  ),

                  SizedBox(height: 22.h),

                  /// email
                  FormLabel(text: context.l10n.email),
                  CustomTextField(
                    controller: cubit.emailController,
                    hintText: context.l10n.enter_email,
                    validator: ValidationHelper.validateEmail,
                  ),

                  SizedBox(height: 22.h),

                  /// phone
                  FormLabel(text: context.l10n.phone_number),
                  CustomTextField(
                    controller: cubit.phoneController,
                    hintText: context.l10n.enter_phone,
                    validator: ValidationHelper.validatePhone,
                  ),

                  SizedBox(height: 22.h),

                  /// gender
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

                  /// password
                  FormLabel(text: context.l10n.password),
                  CustomTextField(
                    controller: cubit.passwordController,
                    hintText: context.l10n.create_password,
                    isPassword: true,
                    validator: ValidationHelper.validatePassword,
                  ),

                  SizedBox(height: 25.h),

                  /// next button
                  CustomButton(
                    text: context.l10n.next,
                    height: 50.h,
                    onPressed: () async {
                      if (cubit.formKey.currentState!.validate()) {
                        final prefs = SharedPref();

                        await prefs.setString(
                            "fullName", cubit.fullNameController.text);
                        await prefs.setString(
                            "email", cubit.emailController.text);
                        await prefs.setString(
                            "phone", cubit.phoneController.text);
                        await prefs.setString(
                            "password", cubit.passwordController.text);

                        final gender =
                            context.read<GenderCubit>().genderValue;

                        await prefs.setString("gender", gender);

                        if (cubit.personalPhoto != null) {
                          await prefs.setString(
                              "personalImage", cubit.personalPhoto!.path);
                        }

                        Navigator.pushNamed(
                          context,
                          AppRoutes.registrationDoctor,
                        );
                      }
                    },
                  ),

                  SizedBox(height: 40.h),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}