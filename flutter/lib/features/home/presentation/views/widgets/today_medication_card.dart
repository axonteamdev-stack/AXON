import 'package:Axon/core/style/app_text_styles.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
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
    this.time = "10:00 Pm",
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
padding: EdgeInsets.symmetric(horizontal: 20.w),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ================= Header =================
         
      
         Row(
            children: [
              const Text("💊"),
              SizedBox(width: 6.w),
              Text(
                "Next dose in 20 minutes",
                style: AppTextStyles.body.copyWith(
                  fontSize: 12,
                  color: AppColors.primaryColor,
                ),
              ),
            ],
          ),
      
          SizedBox(height: 12.h),
      
         
      
          // ================= Card =================
          Container(
            padding: EdgeInsets.all(16.r),
            decoration: BoxDecoration(
              color: Colors.transparent,
              borderRadius: BorderRadius.circular(16.r),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                
                // ================= Left (Progress) =================
                Column(
                  children: [
                    SizedBox(
                      width: 96.w,
                      height: 96.w,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          SizedBox(
                            width: 96.w,
                            height: 96.w,
                            child: CircularProgressIndicator(
                              value: total == 0 ? 0 : taken / total,
                              strokeWidth: 6.w,
                              backgroundColor:
                                  AppColors.grey.withOpacity(.25),
                              color: AppColors.primaryColor,
                            ),
                          ),
                          Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                "taken today",
                                style: AppTextStyles.body.copyWith(
                                  fontSize: 12,
                                ),
                              ),
                              SizedBox(height: 4.h),
                              Text(
                                "$taken/$total",
                                style: AppTextStyles.semiBold.copyWith(
                                  fontSize: 14, 
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
      
                SizedBox(width: 16.w),
      
                // ================= Right (Details) =================
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            "Next dose",
                            style: AppTextStyles.body.copyWith(
                              fontSize: 12, // ✅
                            ),
                          ),
                          const Spacer(),
                          Text(
                            "Time: $time",
                            style: AppTextStyles.body.copyWith(
                              fontSize: 12, // ✅
                            ),
                          ),
                        ],
                      ),
      
                      SizedBox(height: 6.h),
      
                      Text(
                        medicineName,
                        style: AppTextStyles.semiBold.copyWith(
                          fontSize: 14, // ✅
                          color: AppColors.primaryColor,
                        ),
                      ),
      
                      SizedBox(height: 12.h),
      
                      CustomButton(
                        height: 42.h,
                        text: "Taken",
                        onPressed: () {},
                      ),
      
                      SizedBox(height: 8.h),
      
                      CustomButton(
                        height: 42.h,
                        text: "View All",
                        color: AppColors.white,
                        textColor: AppColors.primaryColor,
                        onPressed: () {},
                      ),
                    ],
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
