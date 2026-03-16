import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';

class ArticleDetailsView extends StatelessWidget {
  final String title;
  final String? content;
  final String imagePath;
  final bool isFileImage;

  const ArticleDetailsView({
    super.key,
    required this.title,
    required this.imagePath,
    this.content,
    this.isFileImage = false,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: Stack(
        children: [
          Column(
            children: [
              SizedBox(
                height: 300.h,
                width: double.infinity,
                child: ClipRRect(
                  borderRadius: BorderRadius.vertical(
                    bottom: Radius.circular(28.r),
                  ),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      isFileImage
                          ? Image.file(
                              File(imagePath),
                              fit: BoxFit.cover,
                            )
                          : Image.asset(
                              imagePath,
                              fit: BoxFit.cover,
                            ),
                      Container(
                        // decoration: BoxDecoration(
                        //   gradient: LinearGradient(
                        //     begin: Alignment.bottomCenter,
                        //     end: Alignment.topCenter,
                        //     colors: [
                        //       AppColors.white.withOpacity(0.2),
                        //      AppColors.white.withOpacity(0.0),
                        //     ],
                        //   ),
                        // ),
                      ),
                    ],
                  ),
                ),
              ),
              Expanded(
                child: SingleChildScrollView(
                  padding: EdgeInsets.fromLTRB(20.w, 20.h, 20.w, 32.h),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      TextApp(
                        text: title,
                        weight: AppTextWeight.bold,
                        fontSize: 22,
                        color: AppColors.primaryColor,
                      ),
                      if (content != null) ...[
                        SizedBox(height: 16.h),
                        TextApp(
                          text: content!,
                          fontSize: 14,
                          height: 1.7,
                          color: AppColors.black,
                        ),
                      ],
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
              onTap: () => Navigator.pop(context),
              child: Container(
                width: 34.w,
                height: 34.w,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.black.withOpacity(0.35),
                ),
                child: const Icon(
                  Icons.close,
                  size: 18,
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
