import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class TodayMedicationCard extends StatelessWidget {
  final int taken;
  final int total;
  final String medicineName;
  final String time;

  const TodayMedicationCard({
    super.key,
    required this.taken,
    required this.total,
    required this.medicineName,
    this.time = "10:00 PM",
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w),
      child: Container(
        padding: EdgeInsets.all(14.r),
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(16.r),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.2),
              blurRadius: 18,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Text("💊"),
                SizedBox(width: 6.w),
                TextApp(
                  text: "Next dose in 20 minutes",
                  weight: AppTextWeight.bold,
                  fontSize: 12.sp,
                  color: AppColors.primaryColor,
                ),
              ],
            ),
            SizedBox(height: 12.h),
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Expanded(
                  child: AspectRatio(
                    aspectRatio: 1,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        Positioned.fill(
                          child: CircularProgressIndicator(
                            value: total == 0 ? 0 : taken / total,
                            strokeWidth: 5.w,
                            backgroundColor:
                                AppColors.grey.withOpacity(.25),
                            color: AppColors.primaryColor,
                          ),
                        ),
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            TextApp(
                              text: "taken today",
                              fontSize: 10.sp,
                              color: AppColors.grey,
                            ),
                            SizedBox(height: 4.h),
                            TextApp(
                              text: "$taken/$total",
                              weight: AppTextWeight.semiBold,
                              fontSize: 18.sp,
                              color: AppColors.black,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                SizedBox(width: 14.w),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      TextApp(
                        text: "Next dose",
                        fontSize: 10.sp,
                        color: AppColors.grey,
                      ),
                      SizedBox(height: 2.h),
                      TextApp(
                        text: medicineName,
                        weight: AppTextWeight.semiBold,
                        fontSize: 13.sp,
                        color: AppColors.primaryColor,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      SizedBox(height: 6.h),
                      TextApp(
                        text: "Time",
                        fontSize: 10.sp,
                        color: AppColors.grey,
                      ),
                      SizedBox(height: 2.h),
                      TextApp(
                        text: time,
                        weight: AppTextWeight.semiBold,
                        fontSize: 13.sp,
                        color: AppColors.primaryColor,
                      ),
                      SizedBox(height: 10.h),
                      CustomButton(
                        height: 32.h,
                        width: double.infinity,
                        borderRadius: 10.r,
                        text: "Taken",
                        fontSize: 11.sp,
                        fontWeight: ButtonTextWeight.bold,
                        color: AppColors.primaryColor,
                        onPressed: () {},
                      ),
                      SizedBox(height: 6.h),
                      CustomButton(
                        height: 32.h,
                        width: double.infinity,
                        borderRadius: 10.r,
                        text: "View All",
                        fontSize: 11.sp,
                        color: AppColors.white,
                        textColor: AppColors.primaryColor,
                        border: BorderSide(
                          color:
                              AppColors.primaryColor.withOpacity(.8),
                          width: 1,
                        ),
                        onPressed: () {},
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
