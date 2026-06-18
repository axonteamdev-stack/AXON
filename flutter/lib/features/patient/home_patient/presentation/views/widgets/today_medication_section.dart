import 'package:Axon/core/extensions/localization_ext.dart';
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
  final String remainingTime ;
  final VoidCallback onTakeDose;

  const TodayMedicationSection({
    super.key,
    required this.taken,
    required this.total,
    required this.medicineName,
    required this.time, required this.remainingTime, required this.onTakeDose ,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 20.w),
          child: TextApp(
            text: context.l10n.todays_medications,
            weight: AppTextWeight.semiBold,
            fontSize: 15.sp,
            color: AppColors.black,
          ),
        ),
        SizedBox(height: 12.h),
        TodayMedicationCard(
          onTakeDose: onTakeDose,
          remainingTime:remainingTime ,
          taken: taken,
          total: total,
          medicineName: medicineName,
          time: time,
        ),
      ],
    );
  }
}
