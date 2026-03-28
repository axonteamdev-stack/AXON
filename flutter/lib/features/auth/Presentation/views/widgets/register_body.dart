import 'dart:io';

import 'package:Axon/core/helpers/validation_helper.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/features/auth/Presentation/manager/general%20register%20data/general_register_cubit.dart';
import 'package:Axon/features/auth/Presentation/manager/general%20register%20data/general_register_state.dart';
import 'package:Axon/features/auth/Presentation/manager/selected gender/gender_cubit.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/form_label.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/gender_selector.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/registration_profile_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/extensions/localization_ext.dart';

class RegisterBody extends StatelessWidget {
  const RegisterBody({super.key});

  @override
  Widget build(BuildContext context) {
    final cubit = context.read<GeneralRegisterCubit>();

    return BlocBuilder<GeneralRegisterCubit, GeneralRegisterState>(
      builder: (context, state) {
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
                      image: cubit.personalPhoto != null
                          ? File(cubit.personalPhoto!.path)
                          : null,
                      onPick: () {
                        cubit.pickImage();
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
                      final gender = context.read<GenderCubit>().genderValue;

                      if (cubit.formKey.currentState!.validate()) {
                        cubit.saveAllData(gender);
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
