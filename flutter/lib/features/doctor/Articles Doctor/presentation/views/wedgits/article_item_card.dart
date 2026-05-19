import 'package:Axon/core/network/endpoints.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/presentation/views/article_details_view.dart';
import 'package:Axon/features/patient/home_patient/domain/entities/article_entity.dart';
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

    final String imageUrl =
        "${Endpoints.baseUrlImage}${article.image}";

    return GestureDetector(

      onTap: () {

        Navigator.push(

          context,

          MaterialPageRoute(

            builder: (_) => ArticleDetailsView(

              title: article.title,

              content: article.content,

              imagePath: imageUrl,

              isFileImage: false,
            ),
          ),
        );
      },

      child: Container(

        margin: EdgeInsets.symmetric(
          horizontal: 2.w,
        ),

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

              /// IMAGE
              if (article.image.isNotEmpty)

                ClipRRect(

                  borderRadius:
                      BorderRadius.circular(20.r),

                  child: Image.network(

                    imageUrl,

                    width: double.infinity,

                    height: double.infinity,

                    fit: BoxFit.cover,

                    loadingBuilder: (
                      context,
                      child,
                      loadingProgress,
                    ) {

                      if (loadingProgress == null) {
                        return child;
                      }

                      return Container(

                        color: Colors.grey.shade200,

                        child: const Center(
                          child:
                              CircularProgressIndicator(),
                        ),
                      );
                    },

                    errorBuilder: (
                      context,
                      error,
                      stackTrace,
                    ) {

                      print(
                        "IMAGE ERROR: $imageUrl",
                      );

                      return Container(

                        color: Colors.grey.shade200,

                        child: const Center(

                          child: Icon(
                            Icons.image_not_supported,
                            size: 45,
                            color: Colors.grey,
                          ),
                        ),
                      );
                    },
                  ),
                ),

              /// OVERLAY
              Container(

                decoration: BoxDecoration(

                  borderRadius:
                      BorderRadius.circular(20.r),

                  gradient: LinearGradient(

                    begin: Alignment.bottomCenter,

                    end: Alignment.topCenter,

                    colors: [

                      AppColors.white.withOpacity(0.65),

                      AppColors.white.withOpacity(0.0),
                    ],
                  ),
                ),
              ),

              /// TEXT
              Positioned(

                left: 16.w,

                right: 16.w,

                bottom: 16.h,

                child: Column(

                  crossAxisAlignment:
                      CrossAxisAlignment.start,

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