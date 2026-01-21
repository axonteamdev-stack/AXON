import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/core/widgets/custom_button.dart';

class DoctorChatCard extends StatelessWidget {
  const DoctorChatCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: 16.w,
        vertical: 14.h,
      ),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(18.r),
        border: Border.all(
          color: AppColors.grey.withOpacity(0.15),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.black.withOpacity(0.08),
            blurRadius: 18,
            spreadRadius: 2,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 26.r,
            backgroundColor:
                AppColors.primaryColor.withOpacity(0.12),
            child: Icon(
              Icons.person,
              color: AppColors.primaryColor,
              size: 22.sp,
            ),
          ),
          SizedBox(width: 14.w),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextApp(
                  text: 'Abdallah Hassan',
                  color: AppColors.black,
                  weight: AppTextWeight.semiBold,
                ),
                SizedBox(height: 6),
                TextApp(
                  text: 'Back pain and spinal discomfort',
                  color: AppColors.grey,
                  fontSize: 12,
                ),
              ],
            ),
          ),
          SizedBox(width: 7.w),
          CustomButton(
            text: 'Chat',
            width: 82.w,
            height: 36.h,
            fontSize: 13,
            onPressed: () {},
          ),
        ],
      ),
    );
  }
}
