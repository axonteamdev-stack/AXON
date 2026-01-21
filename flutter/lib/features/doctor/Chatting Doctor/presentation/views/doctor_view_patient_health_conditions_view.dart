import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/form_label.dart';

class DoctorViewPatientHealthConditionsView extends StatelessWidget {
  const DoctorViewPatientHealthConditionsView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,

      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 1,
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_ios,
            color: AppColors.black,
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Health Conditions',
          style: TextStyle(color: AppColors.black),
        ),
      ),

      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(horizontal: 20.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 24.h),

            const FormLabel(text: 'Condition'),
            CustomTextField(
              controller: TextEditingController(
                text: 'Diabetes',
              ),
              enabled: false,
            ),

            SizedBox(height: 20.h),

            const FormLabel(text: 'Condition'),
            CustomTextField(
              controller: TextEditingController(
                text: 'High blood pressure',
              ),
              enabled: false,
            ),

            SizedBox(height: 20.h),

            const FormLabel(text: 'Condition'),
            CustomTextField(
              controller: TextEditingController(
                text: 'Chronic back pain',
              ),
              enabled: false,
            ),

            SizedBox(height: 40.h),
          ],
        ),
      ),
    );
  }
}
