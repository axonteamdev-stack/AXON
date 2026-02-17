import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class MedicineCard extends StatelessWidget {
  final String name;
  final String frequency;
  final String nextTime;

  const MedicineCard({
    super.key,
    required this.name,
    required this.frequency,
    required this.nextTime,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.only(left: 12.h, right: 12.h),
      height: 200.h,
      width: double.infinity,
      padding: EdgeInsets.all(12.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.r),
        border: Border.all(
          color: AppColors.primaryColor.withOpacity(0.5),
          width: 1.5,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.12),
            blurRadius: 24,
            spreadRadius: 2,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          SizedBox(
            height: 90.h,
            child: Row(
              children: [
                Container(
                  height: 80.h,
                  width: 70.w,
                  padding: EdgeInsets.all(12.w),
                  decoration: BoxDecoration(
                    color: AppColors.primaryColor.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(24.r),
                  ),
                  child: Image.asset(
                    AppImages.medicineIcon2,
                    height: 40.h,
                    width: 40.h,
                  ),
                ),
                SizedBox(width: 32.w),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      TextApp(
                        text: name,
                        color: AppColors.primaryColor,
                        fontSize: 16,
                        weight: AppTextWeight.bold,
                      ),
                      SizedBox(height: 8.h),
                      TextApp(
                        text: frequency,
                        color: AppColors.grey,
                        fontSize: 12,
                        weight: AppTextWeight.semiBold,
                      ),
                      SizedBox(height: 8.h),
                      Row(
                        children: [
                          Icon(
                            Icons.timelapse_outlined,
                            size: 16,
                            color: AppColors.grey,
                          ),
                          SizedBox(width: 4.w),
                          TextApp(
                              text: "${context.l10n.next}: $nextTime",
                            color: AppColors.grey,
                            fontSize: 12,
                            weight: AppTextWeight.semiBold,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          SizedBox(height: 16.h),
          Expanded(
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {},
                    icon: Icon(
                      FontAwesomeIcons.check,
                      size: 16,
                      color: AppColors.white,
                    ),
                    label: TextApp(
                      text: context.l10n.taken,
                      color: AppColors.white,
                      fontSize: 16,
                      weight: AppTextWeight.semiBold,
                    ),
                    style: OutlinedButton.styleFrom(
                      backgroundColor: AppColors.primaryColor,
                      side: BorderSide(color: AppColors.primaryColor),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12.r),
                      ),
                    ),
                  ),
                ),
                SizedBox(width: 12.w),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () {},
                    icon: Icon(
                      FontAwesomeIcons.xmark,
                      size: 16,
                      color: Colors.red,
                    ),
                    label: TextApp(
                      text: context.l10n.skip,
                      fontSize: 16,
                      weight: AppTextWeight.semiBold,
                    ),
                    style: OutlinedButton.styleFrom(
                      side: const BorderSide(color: Colors.red),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12.r),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
