import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/home/article_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';



class ArticleCard extends StatelessWidget {
  final ArticleModel item;

  const ArticleCard({super.key, required this.item});

  @override
  Widget build(BuildContext context) {
    return Container(
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
          ClipRRect(
            borderRadius: BorderRadius.vertical(
              top: Radius.circular(14.r),
            ),
            child: Image.asset(
              item.image,
              height: 120.h,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          ),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 6.h),
            child: TextApp(
              text: item.title,
              weight: AppTextWeight.semiBold,
              fontSize: 11.sp,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              color: AppColors.black,
            ),
          ),
        ],
      ),
    );
  }
}
