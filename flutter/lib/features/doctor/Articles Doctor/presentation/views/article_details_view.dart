import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import '../manager/doctor_articles_cubit.dart';

class ArticleDetailsView extends StatelessWidget {
  final ArticleEntity article;

  const ArticleDetailsView({
    super.key,
    required this.article,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: Stack(
        children: [
          CustomScrollView(
            slivers: [
              SliverAppBar(
                backgroundColor: AppColors.white,
                expandedHeight: 300.h,
                pinned: true,
                elevation: 0,
                leading: const SizedBox(),
                flexibleSpace: FlexibleSpaceBar(
                  background: ClipRRect(
                    borderRadius: BorderRadius.vertical(
                      bottom: Radius.circular(28.r),
                    ),
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        if (article.imagePath != null)
                          Image.file(
                            File(article.imagePath!),
                            fit: BoxFit.cover,
                          ),
                        Container(
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              begin: Alignment.bottomCenter,
                              end: Alignment.topCenter,
                              colors: [
                                AppColors.white.withOpacity(0.85),
                                // Colors.transparent,
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              SliverToBoxAdapter(
                child: Padding(
                  padding: EdgeInsets.fromLTRB(
                    20.w,
                    20.h,
                    20.w,
                    32.h,
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      TextApp(
                        text: article.title,
                        weight: AppTextWeight.bold,
                        fontSize: 22,
                        color: AppColors.primaryColor,
                      ),
                      SizedBox(height: 16.h),
                      TextApp(
                        text: article.content,
                        color: AppColors.black,
                        fontSize: 14,
                        height: 1.6,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          Positioned(
            top: 40.h,
            right: 18.w,
            child: GestureDetector(
              onTap: () {
                Navigator.pop(context);
              },
              child: Container(
                width: 30.w,
                height: 30.w,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.black.withOpacity(0.35),
                ),
                child: const Icon(
                  Icons.close,
                  size: 16,
                  color: AppColors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
