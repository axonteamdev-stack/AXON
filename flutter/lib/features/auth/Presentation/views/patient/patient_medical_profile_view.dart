import 'package:Axon/core/extensions/context_extension.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/auth/Presentation/manager/patient_registration/patient_registration_cubit.dart';
import 'package:Axon/features/auth/Presentation/manager/patient_registration/patient_registration_state.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/center_icon_header.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/form_label.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/reusable_dropdown.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class PatientMedicalProfileView extends StatelessWidget {
  const PatientMedicalProfileView({super.key});

  @override
  Widget build(BuildContext context) {
    final cubit = context.read<PatientRegistrationCubit>();

    return Scaffold(
      backgroundColor: AppColors.white,
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: EdgeInsets.symmetric(horizontal: 20.w),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 55.h),
                  const CenterIconHeader(
                    imagePath: AppImages.medicalProfile,
                    title: 'Medical Profile',
                    subtitle:
                        'Help us understand your health better',
                  ),
                  SizedBox(height: 25.h),
                  const FormLabel(text: 'Blood Type'),
                  BlocBuilder<PatientRegistrationCubit,
                      PatientRegistrationState>(
                    builder: (context, state) {
                      return ReusableDropdown(
                        hint: 'Select Blood Type',
                        value: state.bloodType,
                        items: const [
                          'A+',
                          'A-',
                          'B+',
                          'B-',
                          'O+',
                          'O-',
                          'AB+',
                          'AB-'
                        ],
                        onChanged: (v) =>
                            cubit.setBloodType(v!),
                      );
                    },
                  ),
                  SizedBox(height: 20.h),
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment:
                              CrossAxisAlignment.start,
                          children: [
                            const FormLabel(
                                text: 'Height (cm)'),
                            CustomTextField(
                              controller: cubit.heightCtrl,
                              hintText: '170',
                              keyboardType:
                                  TextInputType.number,
                              prefixIcon: Image.asset(
                                AppImages.height,
                                width: 20,
                                height: 20,
                              ),
                              onChanged: cubit.setHeight,
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
                            const FormLabel(
                                text: 'Weight (kg)'),
                            CustomTextField(
                              controller: cubit.weightCtrl,
                              hintText: '62.5',
                              keyboardType:
                                  TextInputType.number,
                              prefixIcon: Image.asset(
                                AppImages.weight,
                                width: 16,
                                height: 16,
                                fit: BoxFit.contain,
                              ),
                              onChanged: cubit.setWeight,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 20.h),
                  Container(
                    padding: EdgeInsets.all(12.r),
                    decoration: BoxDecoration(
                      border:
                          Border.all(color: AppColors.blue),
                      borderRadius:
                          BorderRadius.circular(12),
                      color: AppColors.blue.withOpacity(0.1),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.info_outline,
                          color: AppColors.blue,
                          size: 20.sp,
                        ),
                        SizedBox(width: 10.w),
                        const Expanded(
                          child: TextApp(
                            text:
                                'Your medical information helps doctors provide better care.',
                            fontSize: 13,
                            color: AppColors.blue,
                          ),
                        ),
                      ],
                    ),
                  ),
                  SizedBox(height: 24),
                ],
              ),
            ),
          ),
          Padding(
            padding:
                EdgeInsets.fromLTRB(20.w, 0, 20.w, 24.h),
            child: CustomButton(
              text: 'Next',
              height: 50.h,
              onPressed: () {
                context.pushName(
                  AppRoutes.patientHealthConditions,
                  arguments:
                      context.read<PatientRegistrationCubit>(),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
