import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/home_patient/presentation/views/widgets/notification_icon.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class HomeHeader extends StatelessWidget {
  final String name;
  final int notificationCount;
  final String? imageUrl;

  const HomeHeader({
    super.key,
    required this.name,
    this.notificationCount = 0,
    this.imageUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 180.h,
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(16.r),
          bottomRight: Radius.circular(16.r),
        ),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppColors.primaryColor, AppColors.blue],
        ),
      ),

      child: Stack(
        children: [
          /// Background circles
          Positioned(
            right: -40,
            top: -30,
            child: Container(
              width: 170.w,
              height: 170.w,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.white.withOpacity(.08),
              ),
            ),
          ),

          Positioned(
            right: 80.w,
            top: 20.h,
            child: Container(
              width: 90.w,
              height: 90.w,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.white.withOpacity(.08),
              ),
            ),
          ),

          Positioned(
            left: -30.w,
            bottom: -40.h,
            child: Container(
              width: 120.w,
              height: 120.w,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.white.withOpacity(.08),
              ),
            ),
          ),

          SafeArea(
            bottom: false,
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 20.w, vertical: 16.h),
              child: Row(
                children: [
                  Container(
                    padding: EdgeInsets.all(2.w),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: AppColors.white.withOpacity(.3),
                      ),
                    ),
                    child: CircleAvatar(
                      radius: 32.r,
                      backgroundColor: Colors.white,
                      child: ClipOval(
                        child: imageUrl != null && imageUrl!.isNotEmpty
                            ? Image.network(
                                "https://tender-morna-axon-fp-b76b6646.koyeb.app$imageUrl",
                                fit: BoxFit.cover,
                                width: 62.r,
                                height: 62.r,
                                errorBuilder: (_, __, ___) {
                                  return Image.asset(
                                    AppImages.body,
                                    fit: BoxFit.cover,
                                    width: 62.r,
                                    height: 62.r,
                                  );
                                },
                              )
                            : Image.asset(
                                AppImages.body,
                                fit: BoxFit.cover,
                                width: 62.r,
                                height: 62.r,
                              ),
                      ),
                    ),
                  ),

                  SizedBox(width: 14.w),

                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        TextApp(
                          text: context.l10n.greeting(name),
                          height: 1.1,
                          color: Colors.white,
                          weight: AppTextWeight.bold,
                          fontSize: 20.sp,
                        ),

                        SizedBox(height: 8.h),

                        TextApp(
                          text: context.l10n.health_matters,
                          color: Colors.white70,
                          fontSize: 14.sp,
                        ),
                      ],
                    ),
                  ),

                  Container(
                    width: 45.w,
                    height: 45.w,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(.15),
                      borderRadius: BorderRadius.circular(18.r),
                      border: Border.all(color: Colors.white.withOpacity(.2)),
                    ),
                    child: NotificationIcon(
                      count: notificationCount,
                      onTap: () {},
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
