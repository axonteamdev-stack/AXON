import 'package:Axon/features/doctor/Chatting%20Doctor/presentation/views/widgets/document_preview_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';

class DoctorViewPatientRadiologyView extends StatelessWidget {
  const DoctorViewPatientRadiologyView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,

      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 1,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: AppColors.black),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Radiology',
          style: TextStyle(color: AppColors.black),
        ),
      ),

      body: Column(
        children: [
      

          Expanded(
            child: ListView(
              padding: EdgeInsets.symmetric(horizontal: 20.w),
              children: [
                DocumentPreviewCard(
                  title: 'Chest X-Ray',
                  image: 'assets/images/onboarding1.png',
                ),
                SizedBox(height: 16.h),
                DocumentPreviewCard(
                  title: 'MRI Scan',
                  image: 'assets/images/onboarding2.png',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
