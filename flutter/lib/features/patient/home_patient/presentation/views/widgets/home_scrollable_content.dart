import 'package:Axon/features/patient/home_patient/domain/entities/article_entity.dart';
import 'package:Axon/features/patient/home_patient/presentation/views/widgets/articles_tips_section.dart';
import 'package:Axon/features/patient/home_patient/presentation/views/widgets/quick_actions_section.dart';
import 'package:Axon/features/patient/home_patient/presentation/views/widgets/today_medication_section.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class HomeScrollableContent extends StatelessWidget {
  final List<ArticleEntity> articles;

  const HomeScrollableContent({
    super.key,
    required this.articles,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 14.h),

            const TodayMedicationSection(
              taken: 2,
              total: 4,
              medicineName: "Vitamin D",
            ),

            SizedBox(height: 16.h),

            const QuickActionsSection(),

            SizedBox(height: 16.h),

            ArticlesTipsSection(
              articles: articles,
            ),

            SizedBox(height: 25.h),
          ],
        ),
      ),
    );
  }
}