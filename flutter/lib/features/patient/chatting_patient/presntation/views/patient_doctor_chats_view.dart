import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/widgets/custom_app_bar.dart';
import 'package:Axon/features/patient/chatting_patient/presntation/widgets/patient_doctor_connection_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';

class PatientDoctorChatsView extends StatelessWidget {
  const PatientDoctorChatsView({super.key});

  @override
  Widget build(BuildContext context) {
    final doctors = [
      {
        'name': 'Dr. Ahmed Hassan',
        'description': 'Cardiology Specialist',
        'image': AppImages.onboarding1,
      },
      {
        'name': 'Dr. Sara Mohamed',
        'description': 'Neurology Consultant',
        'image': AppImages.onboarding3,
      },
      {
        'name': 'Dr. Omar Ali',
        'description': 'Internal Medicine',
        'image': AppImages.onboarding2,
      },

      {
        'name': 'Dr. Ahmed Hassan',
        'description': 'Cardiology Specialist',
        'image': AppImages.onboarding1,
      },
      {
        'name': 'Dr. Sara Mohamed',
        'description': 'Neurology Consultant',
        'image': AppImages.onboarding3,
      },
      {
        'name': 'Dr. Omar Ali',
        'description': 'Internal Medicine',
        'image': AppImages.onboarding2,
      },
    ];

    return Scaffold(
      backgroundColor: AppColors.white,

      body: Column(
        children: [
          CustomAppBar(
            showBackButton: false,
            title: context.l10n.my_doctors,
            titleAlignment: Alignment.center,
            height: 100,
            padding: EdgeInsets.only(top: 24.h),
            gradient: LinearGradient(
              colors: [AppColors.primaryColor, AppColors.blue],
            ),
          ),
          Expanded(
            child: Padding(
              padding: EdgeInsets.all(16.w),
              child: ListView.separated(
                itemCount: doctors.length,
                separatorBuilder: (_, __) => SizedBox(height: 14.h),
                itemBuilder: (_, index) {
                  final doctor = doctors[index];
                  return PatientDoctorConnectionCard(
                    name: doctor['name']!,
                    description: doctor['description']!,
                    image: doctor['image']!,
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}
