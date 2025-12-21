import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/home/presentation/manager/home/article_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'article_card.dart';

class ArticlesTipsSection extends StatelessWidget {
  const ArticlesTipsSection({super.key});

  static const List<ArticleModel> articles = [
    ArticleModel(
      id: "1",
      title: "5 Tips to Take Your Medication on Time",
      image: AppImages.onboarding1,
    ),
    ArticleModel(
      id: "2",
      title: "Why Daily Vitamins Matter for Your Health",
      image: AppImages.onboarding2,
    ),
    ArticleModel(
      id: "3",
      title: "Simple Habits for a Healthier Life",
      image: AppImages.onboarding3,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 20.w),
          child: TextApp(
            text: "Articles & Tips",
            weight: AppTextWeight.semiBold,
            fontSize: 15.sp,
            color: AppColors.black,
          ),
        ),
        SizedBox(height: 10.h),
        SizedBox(
          height: 170.h,
          child: ListView.separated(
            padding: EdgeInsets.symmetric(horizontal: 20.w),
            scrollDirection: Axis.horizontal,
            itemCount: articles.length,
            separatorBuilder: (_, __) => SizedBox(width: 12.w),
            itemBuilder: (_, index) {
              return ArticleCard(item: articles[index]);
            },
          ),
        ),
      ],
    );
  }
}
