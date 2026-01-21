import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
class DoctorPatientHeaderDelegate extends SliverPersistentHeaderDelegate {
  final String name;
  final String image;
  

  DoctorPatientHeaderDelegate({
    required this.name,
    required this.image,
    
  });

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    final topPadding = MediaQuery.of(context).padding.top;

    return Container(
      padding: EdgeInsets.only(
        top: topPadding + 8,
        left: 16,
        right: 16,
        bottom: 0,
      ),
      decoration: const BoxDecoration(
        color: AppColors.primaryColor,
        borderRadius: BorderRadius.vertical(
          bottom: Radius.circular(24),
        ),
      ),
      child: Row(
        
        children: [
          Align(
            alignment: Alignment.topLeft,
            child: IconButton(
              icon: const Icon(
                Icons.arrow_back_ios,
                color: Colors.white,
              ),
              onPressed: () => Navigator.pop(context),
            ),
          ),

          SizedBox(width: 30.w),

         Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
             Container(
            padding: EdgeInsets.all(3.w),
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white,
            ),
            child: CircleAvatar(
              radius: 44,
              backgroundImage: AssetImage(image),
            ),
          ),

          SizedBox(height: 12),

          TextApp(
            text: name,
            fontSize: 18,
            weight: AppTextWeight.bold,
            color: AppColors.white,
          ),

          SizedBox(height: 4),

          TextApp(
           text: "Persistent lower back pain ",

            fontSize: 13,
            color: AppColors.white.withOpacity(0.9),
          ),
          ],
         )
        ],
      ),
    );
  }

  @override
  double get maxExtent => 230;

  @override
  double get minExtent => 230;

  @override
  bool shouldRebuild(covariant SliverPersistentHeaderDelegate oldDelegate) {
    return false;
  }
}
