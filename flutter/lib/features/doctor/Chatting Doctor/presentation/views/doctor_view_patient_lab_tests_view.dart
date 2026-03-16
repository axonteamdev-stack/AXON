import 'package:Axon/features/doctor/Chatting%20Doctor/presentation/views/widgets/document_preview_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/extensions/localization_ext.dart';

class DoctorViewPatientLabTestsView extends StatelessWidget {
  const DoctorViewPatientLabTestsView({super.key});

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
          context.l10n.lab_tests,
          style: const TextStyle(color: AppColors.black),
        ),
      ),
      body: ListView(
        padding: EdgeInsets.symmetric(horizontal: 20.w),
        children: [
          DocumentPreviewCard(
            title: context.l10n.blood_test,
            image: 'assets/images/onboarding1.png',
          ),
          SizedBox(height: 16.h),
          DocumentPreviewCard(
            title: context.l10n.sugar_analysis,
            image: 'assets/images/onboarding2.png',
          ),
          SizedBox(height: 16.h),
          DocumentPreviewCard(
            title: context.l10n.cholesterol_test,
            image: 'assets/images/onboarding3.png',
          ),
        ],
      ),
    );
  }
}
