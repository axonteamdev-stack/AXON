import 'dart:io';

import 'package:Axon/core/di/di.dart';
import 'package:Axon/core/errors/mappers/failure_to_message_mapper.dart';
import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/helpers/snackbar.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/form_label.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/registration_profile_image.dart';
import 'package:Axon/features/patient/profile_patient/presentation/manager/patient_edit_basic_info/patient_edit_basic_info_cubit.dart';
import 'package:Axon/features/patient/profile_patient/presentation/manager/patient_edit_basic_info/patient_edit_basic_info_state.dart';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class PatientEditBasicInfoView extends StatelessWidget {
  PatientEditBasicInfoView({super.key});

  final cubit = getIt<PatientEditBasicInfoCubit>();

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<
        PatientEditBasicInfoCubit,
        PatientEditBasicInfoState>(
      bloc: cubit,
      listener: (context, state) {
        if (state is PatientEditBasicInfoSuccess) {
          Snackbar.showSuccess(
            context,
            message: "Profile Updated Successfully",
          );
        }

        if (state is PatientEditBasicInfoError) {
          Snackbar.showError(
            context,
            message: mapFailureToMessage(
              context,
              state.failure,
            ),
          );
        }
      },
      builder: (context, state) {
        return Scaffold(
          backgroundColor: AppColors.white,

          bottomNavigationBar: Padding(
            padding: EdgeInsets.fromLTRB(
              20.w,
              12.h,
              20.w,
              24.h,
            ),
            child: CustomButton(
              text: cubit.isEditMode
                  ? context.l10n.save
                  : context.l10n.edit,
              isLoading:
                  state is PatientEditBasicInfoLoading,
              onPressed: () {
                if (cubit.isEditMode) {
                  cubit.updatePatientProfile();
                } else {
                  cubit.toggleEditMode();
                }
              },
            ),
          ),

          body: SingleChildScrollView(
            padding: EdgeInsets.symmetric(
              horizontal: 20.w,
            ),
            child: Form(
              key: cubit.formKey,
              child: Column(
                crossAxisAlignment:
                    CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 55.h),

                  /// =========================
                  /// Profile Image بدل الايقونة
                  /// =========================
                  Center(
                    child: ProfileImagePicker(
                      image: cubit.personalPhoto != null
                          ? File(
                              cubit.personalPhoto!.path,
                            )
                          : null,
                      onPick: () {
                        if (cubit.isEditMode) {
                          cubit.pickImage();
                        }
                      },
                    ),
                  ),

                  SizedBox(height: 30.h),

                  /// =========================
                  /// Full Name (Disabled دائمًا)
                  /// =========================
                  FormLabel(
                    text: context.l10n.full_name,
                  ),
                  CustomTextField(
                    controller: cubit.nameCtrl,
                    enabled: false,
                  ),

                  SizedBox(height: 20.h),

                  /// =========================
                  /// Email
                  /// =========================
                  FormLabel(
                    text: context.l10n.email,
                  ),
                  CustomTextField(
                    controller: cubit.emailCtrl,
                    enabled: cubit.isEditMode,
                  ),

                  SizedBox(height: 20.h),

                  /// =========================
                  /// Phone
                  /// =========================
                  FormLabel(
                    text: context.l10n.phone,
                  ),
                  CustomTextField(
                    controller: cubit.phoneCtrl,
                    enabled: cubit.isEditMode,
                  ),

                  SizedBox(height: 30.h),

                  Row(
                    children: [
                      /// =========================
                      /// Height
                      /// =========================
                      Expanded(
                        child: Column(
                          crossAxisAlignment:
                              CrossAxisAlignment.start,
                          children: [
                            FormLabel(
                              text: context.l10n.height,
                            ),
                            CustomTextField(
                              controller:
                                  cubit.heightCtrl,
                              enabled:
                                  cubit.isEditMode,
                              keyboardType:
                                  TextInputType.number,
                            ),
                          ],
                        ),
                      ),

                      SizedBox(width: 12.w),

                      /// =========================
                      /// Weight
                      /// =========================
                      Expanded(
                        child: Column(
                          crossAxisAlignment:
                              CrossAxisAlignment.start,
                          children: [
                            FormLabel(
                              text: context.l10n.weight,
                            ),
                            CustomTextField(
                              controller:
                                  cubit.weightCtrl,
                              enabled:
                                  cubit.isEditMode,
                              keyboardType:
                                  TextInputType.number,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  SizedBox(height: 120.h),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}