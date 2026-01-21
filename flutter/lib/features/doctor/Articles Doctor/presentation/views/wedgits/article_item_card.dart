import 'dart:io';

import 'package:Axon/features/doctor/Articles%20Doctor/presentation/manager/doctor_articles_cubit.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/presentation/views/article_details_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';

class ArticleItemCard extends StatelessWidget {
  final ArticleEntity article;

  const ArticleItemCard({
    super.key,
    required this.article,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => ArticleDetailsView(article: article),
          ),
        );
      },
      child: Container(
        margin: EdgeInsets.symmetric(horizontal: 2.w),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20.r),
          boxShadow: [
            BoxShadow(
              color: AppColors.black.withOpacity(0.08),
              blurRadius: 14,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Container(
          height: 190.h,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20.r),
            color: AppColors.white,
          ),
          child: Stack(
            children: [
              if (article.imagePath != null)
                ClipRRect(
                  borderRadius: BorderRadius.circular(20.r),
                  child: Image.file(
                    File(article.imagePath!),
                    width: double.infinity,
                    height: double.infinity,
                    fit: BoxFit.cover,
                  ),
                ),
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20.r),
                  gradient: LinearGradient(
                    begin: Alignment.bottomCenter,
                    end: Alignment.topCenter,
                    colors: [
                      AppColors.white.withOpacity(0.92),
                      AppColors.white.withOpacity(0.0),
                    ],
                  ),
                ),
              ),
              Positioned(
                left: 16.w,
                right: 16.w,
                bottom: 16.h,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    TextApp(
                      text: article.title,
                      color: AppColors.primaryColor,
                      weight: AppTextWeight.bold,
                    ),
                    SizedBox(height: 6.h),
                    TextApp(
                      text: article.content,
                      color: AppColors.black,
                      fontSize: 12,
                      maxLines: 2,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
