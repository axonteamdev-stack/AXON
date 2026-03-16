import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/center_icon_header.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/form_label.dart';
import 'package:Axon/features/patient/profile_patient/presentation/manager/patient_edit_basic_info/patient_edit_basic_info_cubit.dart';
import 'package:Axon/core/extensions/context_extension.dart';

class PatientEditBasicInfoView extends StatelessWidget {
  const PatientEditBasicInfoView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => PatientEditBasicInfoCubit(),
      child: BlocBuilder<PatientEditBasicInfoCubit, bool>(
        builder: (context, isEdit) {
          final cubit =
              context.read<PatientEditBasicInfoCubit>();

          return Scaffold(
            backgroundColor: AppColors.white,

            bottomNavigationBar: Padding(
              padding: EdgeInsets.fromLTRB(20.w, 12.h, 20.w, 24.h),
              child: CustomButton(
                text: isEdit
                    ? context.l10n.save
                    : context.l10n.edit,
                onPressed: () {
                  isEdit ? cubit.save() : cubit.toggleEdit();
                },
              ),
            ),

            body: SingleChildScrollView(
              padding: EdgeInsets.symmetric(horizontal: 20.w),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 55.h),

                  CenterIconHeader(
                    icon: Icons.person_outline,
                    title: context.l10n.basic_information,
                    subtitle: context.l10n.personal_medical_info,
                  ),

                  SizedBox(height: 30.h),

                  FormLabel(text: context.l10n.full_name),
                  CustomTextField(
                    controller: cubit.nameCtrl,
                    enabled: isEdit,
                  ),

                  SizedBox(height: 20.h),

                  FormLabel(text: context.l10n.email),
                  CustomTextField(
                    controller: cubit.emailCtrl,
                    enabled: isEdit,
                  ),

                  SizedBox(height: 20.h),

                  FormLabel(text: context.l10n.phone),
                  CustomTextField(
                    controller: cubit.phoneCtrl,
                    enabled: isEdit,
                  ),

                  SizedBox(height: 30.h),

                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment:
                              CrossAxisAlignment.start,
                          children: [
                            FormLabel(text: context.l10n.height),
                            CustomTextField(
                              controller: cubit.heightCtrl,
                              enabled: isEdit,
                              keyboardType: TextInputType.number,
                            ),
                          ],
                        ),
                      ),
                      SizedBox(width: 12.w),
                      Expanded(
                        child: Column(
                          crossAxisAlignment:
                              CrossAxisAlignment.start,
                          children: [
                            FormLabel(text: context.l10n.weight),
                            CustomTextField(
                              controller: cubit.weightCtrl,
                              enabled: isEdit,
                              keyboardType: TextInputType.number,
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
          );
        },
      ),
    );
  }
}
