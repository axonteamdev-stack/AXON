import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/form_label.dart';
import 'package:Axon/core/extensions/localization_ext.dart';

class DoctorViewPatientHealthConditionsView extends StatelessWidget {
  const DoctorViewPatientHealthConditionsView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        scrolledUnderElevation: 0,
        surfaceTintColor: Colors.transparent,
        backgroundColor: AppColors.white,
        elevation: 1,
        leading: IconButton(
          icon: const Icon(
            Icons.arrow_back_ios,
            color: AppColors.black,
          ),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          context.l10n.health_conditions,
          style: const TextStyle(color: AppColors.black),
        ),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(horizontal: 20.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 24.h),

            FormLabel(text: context.l10n.condition),
            CustomTextField(
              controller: TextEditingController(
                text: context.l10n.diabetes,
              ),
              enabled: false,
            ),

            SizedBox(height: 20.h),

            FormLabel(text: context.l10n.condition),
            CustomTextField(
              controller: TextEditingController(
                text: context.l10n.high_blood_pressure,
              ),
              enabled: false,
            ),

            SizedBox(height: 20.h),

            FormLabel(text: context.l10n.condition),
            CustomTextField(
              controller: TextEditingController(
                text: context.l10n.chronic_back_pain,
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
