import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/extensions/context_extension.dart';
import 'package:Axon/core/network/endpoints.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/home_patient/domain/entities/article_entity.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ArticleCard extends StatelessWidget {
  final ArticleEntity item;

  const ArticleCard({super.key, required this.item});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        context.pushName(
          AppRoutes.patientArticleDetails,
          arguments: item.id,
        );
      },
      child: Container(
        width: 170.w,
        decoration: BoxDecoration(
          color: AppColors.white,
          borderRadius: BorderRadius.circular(14.r),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(.05),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            /// image
            ClipRRect(
              borderRadius: BorderRadius.vertical(
                top: Radius.circular(14.r),
              ),
              
              child: Image.network(
                // "${Endpoints.baseUrlImage}${item.image}"
                Endpoints.baseUrlImage + item.image,
                height: 120.h,
                width: double.infinity,
                fit: BoxFit.contain,
                errorBuilder: (context, error, stackTrace) {
                  print("Image Error: $error");
      print("Image URL: ${Endpoints.baseUrlImage}${item.image}");
                  return Container(
                    width: double.infinity,
                    height: 120.h,
                    color: Colors.grey[200],
                    child: const Icon(Icons.image_not_supported),
                  );
                },
              ),
            ),
            SizedBox(height: 10.h,),

            /// title
            Padding(
              padding: EdgeInsets.symmetric(
                horizontal: 8.w,
                vertical: 6.h,
              ),
              child: Center(
                child: TextApp(
                  text: item.title,
                  weight: AppTextWeight.semiBold,
                  fontSize: 11.sp,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  color: AppColors.black,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}