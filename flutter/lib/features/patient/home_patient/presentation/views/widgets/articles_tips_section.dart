import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/home_patient/data/models/article_details_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'article_card.dart';

class ArticlesTipsSection extends StatelessWidget {
  const ArticlesTipsSection({super.key});

  

  @override
  Widget build(BuildContext context) {
     List<ArticleDetailsModel> articles = [
    ArticleDetailsModel(
      id: "1",
      title: context.l10n.article_medication_tips,
      image: AppImages.onboarding1,
      content: context.l10n.article_dummy_content,
    ),
    ArticleDetailsModel(
      id: "2",
      title: context.l10n.article_vitamins_importance,
      image: AppImages.onboarding2,
      content: context.l10n.article_dummy_content,
    ),
    ArticleDetailsModel(
      id: "3",
      title: context.l10n.article_healthy_habits,
      image: AppImages.onboarding3,
      content: context.l10n.article_dummy_content,
    ),
  ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 20.w),
          child: TextApp(
            text: context.l10n.articles_tips,
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
