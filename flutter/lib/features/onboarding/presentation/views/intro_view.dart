import 'package:Axon/core/extensions/context_extension.dart';
import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/onboarding/presentation/views/widgets/language_switch.dart';
import 'package:Axon/features/onboarding/presentation/views/widgets/onboarding_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';



class IntroView extends StatelessWidget {
  const IntroView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 24.w),
          child: Column(
            children: [
              const Spacer(),
Expanded(
                flex: 7,
             child: OnBoardingImage(
                image: AppImages.onboarding3,
              ),),

              SizedBox(height: 35.h),

             
              TextApp(
                text: context.l10n.intro_title,
                fontSize: 26.sp,
                weight: AppTextWeight.semiBold,
                textAlign: TextAlign.center,
                color: AppColors.primaryColor,
              ),

              SizedBox(height: 15.h),

              TextApp(
                text: context.l10n.intro_description,
                fontSize: 13.sp,
                height: 1.5,
                textAlign: TextAlign.center,
                color: AppColors.grey,
                maxLines: 2,
              ),

              const Spacer(),

              Container(
                width: double.infinity,
                padding: EdgeInsets.symmetric(
                  horizontal: 16.w,
                  vertical: 14.h,
                ),
                decoration: BoxDecoration(
                  color: AppColors.lightGrey.withOpacity(0.35),
                  borderRadius: BorderRadius.circular(14.r),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: TextApp(
                        text: context.l10n.choose_language,
                        fontSize: 14.sp,
                        weight: AppTextWeight.semiBold,
                        color: AppColors.primaryColor,
                      ),
                    ),

                    const LanguageSwitch(),
                  ],
                ),
              ),

              SizedBox(height: 20.h),

              /// 🚀 Get Started Button
              SizedBox(
                width: double.infinity,
                height: 48.h,
                child: CustomButton(
                  text: context.l10n.next,
                  borderRadius: 12.r,
                  onPressed: () {
                    context.pushReplacementNamed(AppRoutes.onBoarding);
                  },
                ),
              ),

              SizedBox(height: 28.h),
            ],
          ),
        ),
      ),
    );
  }
}
