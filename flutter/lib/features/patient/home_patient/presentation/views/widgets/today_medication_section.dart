import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'today_medication_card.dart';

class TodayMedicationSection extends StatelessWidget {
  final int taken;
  final int total;
  final String medicineName;
  final String time;

  const TodayMedicationSection({
    super.key,
    required this.taken,
    required this.total,
    required this.medicineName,
    this.time = "10:00 PM",
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 20.w),
          child: TextApp(
            text: "Today’s Medications",
            weight: AppTextWeight.semiBold,
            fontSize: 15.sp,
            color: AppColors.black,
          ),
        ),
        SizedBox(height: 12.h),
        TodayMedicationCard(
          taken: taken,
          total: total,
          medicineName: medicineName,
          time: time,
        ),
      ],
    );
  }
}
