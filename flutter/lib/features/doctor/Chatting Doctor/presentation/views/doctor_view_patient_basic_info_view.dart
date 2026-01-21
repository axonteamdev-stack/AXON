import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/form_label.dart';

class DoctorViewPatientBasicInfoView extends StatelessWidget {
  const DoctorViewPatientBasicInfoView({super.key});

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
          'Basic Information',
          style: TextStyle(color: AppColors.black),
        ),
      ),

      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(horizontal: 20.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 24.h),

            const FormLabel(text: 'Full Name'),
            CustomTextField(
              controller: TextEditingController(
                text: 'Sara Mohamed',
              ),
              enabled: false,
            ),

            SizedBox(height: 20.h),

            const FormLabel(text: 'Email'),
            CustomTextField(
              controller: TextEditingController(
                text: 'sara@email.com',
              ),
              enabled: false,
            ),

            SizedBox(height: 20.h),

            const FormLabel(text: 'Phone'),
            CustomTextField(
              controller: TextEditingController(
                text: '+20 100 123 4567',
              ),
              enabled: false,
            ),

            SizedBox(height: 24.h),

            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const FormLabel(text: 'Height'),
                      CustomTextField(
                        controller: TextEditingController(
                          text: '165 cm',
                        ),
                        enabled: false,
                      ),
                    ],
                  ),
                ),
                SizedBox(width: 12.w),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const FormLabel(text: 'Weight'),
                      CustomTextField(
                        controller: TextEditingController(
                          text: '60 kg',
                        ),
                        enabled: false,
                      ),
                    ],
                  ),
                ),
              ],
            ),

            SizedBox(height: 40.h),
          ],
        ),
      ),
    );
  }
}
