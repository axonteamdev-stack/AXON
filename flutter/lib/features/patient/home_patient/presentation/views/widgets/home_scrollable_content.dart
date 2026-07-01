import 'package:Axon/features/patient/home_patient/domain/entities/article_entity.dart';
import 'package:Axon/features/patient/home_patient/presentation/views/widgets/articles_tips_section.dart';
import 'package:Axon/features/patient/home_patient/presentation/views/widgets/axon_ai.dart';
import 'package:Axon/features/patient/home_patient/presentation/views/widgets/quick_actions_section.dart';
import 'package:Axon/features/patient/home_patient/presentation/views/widgets/today_medication_section.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class HomeScrollableContent extends StatelessWidget {
  final List<ArticleEntity> articles;
  final String medicineName;
  final String time;
  final String remainingTime;
  final VoidCallback onTakeDose;
  final Future<void> Function() onAddMedicine;

  const HomeScrollableContent({
    super.key,
    required this.articles,
    required this.medicineName,
    required this.time,
    required this.remainingTime,
    required this.onTakeDose,
    required this.onAddMedicine,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 14.h),

            TodayMedicationSection(
              taken: 1,
              total: 4,
              remainingTime: remainingTime,
              medicineName: medicineName,
              time: time,
              onTakeDose: onTakeDose,
            ),

            SizedBox(height: 16.h),

            QuickActionsSection(onAddMedicine: onAddMedicine),

            SizedBox(height: 16.h),
            AxonAi(),
            SizedBox(height: 16.h),

            ArticlesTipsSection(articles: articles),

            SizedBox(height: 25.h),
          ],
        ),
      ),
    );
  }
}
