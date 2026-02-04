import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/core/widgets/custom_button.dart';

class DoctorRequestCard extends StatelessWidget {
  const DoctorRequestCard({super.key});

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
      child: Column(
        children: [
          Row(
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
                  crossAxisAlignment:
                      CrossAxisAlignment.start,
                  children: [
                    TextApp(
                      text: 'Abdallah Hasan',
                      color: AppColors.black,
                      weight: AppTextWeight.semiBold,
                    ),
                    SizedBox(height: 6),
                    TextApp(
                      text: 'Chest pain and short breath',
                      color: AppColors.grey,
                      fontSize: 12,
                    ),
                  ],
                ),
              ),
            ],
          ),
          SizedBox(height: 16.h),
          Row(
            children: [
              Expanded(
                child: CustomButton(
                  text: 'Reject',
                  height: 42.h,
                  color: AppColors.white,
                  textColor: AppColors.primaryColor,
                  border: BorderSide(
                    color: AppColors.primaryColor,
                    width: 1.2,
                  ),
                  onPressed: () {},
                ),
              ),
              SizedBox(width: 12.w),
              Expanded(
                child: CustomButton(
                  text: 'Accept',
                  height: 42.h,
                  onPressed: () {},
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
