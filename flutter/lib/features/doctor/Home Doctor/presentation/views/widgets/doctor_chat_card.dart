import 'package:Axon/core/routes/app_routes.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/core/widgets/custom_button.dart';

class DoctorChatCard extends StatelessWidget {
  final String name;
  final String description;
  final String image;

  const DoctorChatCard({
    super.key,
    required this.name,
    required this.description,
    required this.image,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 14.h),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(18.r),
        border: Border.all(color: AppColors.grey.withOpacity(0.15)),
        boxShadow: [
          BoxShadow(
            color: AppColors.black.withOpacity(0.08),
            blurRadius: 18,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 26.r,
            backgroundImage: AssetImage(image),
          ),
          SizedBox(width: 14.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextApp(
                  text: name,
                  weight: AppTextWeight.semiBold,
                ),
                SizedBox(height: 6.h),
                TextApp(
                  text: description,
                  fontSize: 12,
                  color: AppColors.grey,
                  maxLines: 1,
                ),
              ],
            ),
          ),
          CustomButton(
            text: 'Chat',
            width: 82.w,
            height: 36.h,
            fontSize: 13,
            onPressed: () {
              Navigator.pushNamed(
                context,
                AppRoutes.doctorChat,
                arguments: {
                  'name': name,
                  'description': description,
                  'image': image,
                },
              );
            },
          ),
        ],
      ),
    );
  }
}
