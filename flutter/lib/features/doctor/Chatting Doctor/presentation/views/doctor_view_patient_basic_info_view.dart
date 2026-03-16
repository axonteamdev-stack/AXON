import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/form_label.dart';
import 'package:Axon/core/extensions/localization_ext.dart';

class DoctorViewPatientBasicInfoView extends StatelessWidget {
  const DoctorViewPatientBasicInfoView({super.key});

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
          icon: const Icon(Icons.arrow_back_ios, color: AppColors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          context.l10n.basic_information,
          style: const TextStyle(color: AppColors.black),
        ),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(horizontal: 20.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 24.h),

            FormLabel(text: context.l10n.full_name),
            CustomTextField(
              controller: TextEditingController(text: 'Sara Mohamed'),
              enabled: false,
            ),

            SizedBox(height: 20.h),

            FormLabel(text: context.l10n.email),
            CustomTextField(
              controller: TextEditingController(text: 'sara@email.com'),
              enabled: false,
            ),

            SizedBox(height: 20.h),

            FormLabel(text: context.l10n.phone),
            CustomTextField(
              controller: TextEditingController(text: '+20 100 123 4567'),
              enabled: false,
            ),

            SizedBox(height: 24.h),

            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      FormLabel(text: context.l10n.height),
                      CustomTextField(
                        controller: TextEditingController(text: '165 cm'),
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
                      FormLabel(text: context.l10n.weight),
                      CustomTextField(
                        controller: TextEditingController(text: '60 kg'),
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
