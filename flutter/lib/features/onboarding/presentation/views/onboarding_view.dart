<<<<<<< HEAD
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/onboarding/presentation/manager/cubit/onboarding_cubit.dart';
import 'package:Axon/features/onboarding/presentation/manager/cubit/onboarding_state.dart';
import 'package:Axon/features/onboarding/presentation/views/widgets/onboarding_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class OnBoardingView extends StatelessWidget {
  const OnBoardingView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => OnBoardingCubit(),
      child: BlocBuilder<OnBoardingCubit, OnBoardingState>(
        builder: (context, state) {
          final cubit = context.read<OnBoardingCubit>();

          return Scaffold(
            backgroundColor: Colors.white,
            body: SafeArea(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 24.w),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    SizedBox(height: 12.h),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextApp(
                        text: "Skip",
                        weight: AppTextWeight.regular,
                        fontSize: 14.sp,
                        color: AppColors.grey,
                      ),
                    ),

                    SizedBox(height: 12.h),
                    Expanded(
                      flex: 5,
                      child: OnBoardingImage(
                        image: cubit.pages[cubit.currentIndex].image,
                      ),
                    ),

                    SizedBox(height: 27.h),

                    TextApp(
                      text: cubit.pages[cubit.currentIndex].title,
                      weight: AppTextWeight.semiBold,
                      fontSize: 22.sp,
                      textAlign: TextAlign.center,
                      color: Colors.black,
                    ),

                    SizedBox(height: 10.h),

                    TextApp(
                      text: cubit.pages[cubit.currentIndex].subtitle,
                      weight: AppTextWeight.regular,
                      fontSize: 14.sp,
                      textAlign: TextAlign.center,
                      color: AppColors.grey,
                    ),

                    SizedBox(height: 71.h),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        cubit.pages.length,
                        (index) => AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          margin: EdgeInsets.symmetric(horizontal: 4.w),
                          width: cubit.currentIndex == index ? 20.w : 8.w,
                          height: 8.h,
                          decoration: BoxDecoration(
                            color: cubit.currentIndex == index
                                ? AppColors.primaryColor
                                : AppColors.grey,
                            borderRadius: BorderRadius.circular(10.r),
                          ),
                        ),
                      ),
                    ),

                    SizedBox(height: 16.h),

                    SizedBox(
                      width: 327.w,
                      height: 44.h,
                      child: CustomButton(
                        text: cubit.currentIndex == 2 ? "Get Started" : "Next",
                        borderRadius: 8.r,
                        fontSize: 18.sp,

                        onPressed: () {
                          if (cubit.currentIndex == 2) {
                            Navigator.pushReplacementNamed(
                              context,
                              AppRoutes.registration,
                            );
                          } else {
                            cubit.changePage(cubit.currentIndex + 1);
                          }
                        },
                      ),
                    ),

                    SizedBox(height: 25.h),
                  ],
                ),
              ),
            ),
          );
        },
=======
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

class OnBoardingView extends StatefulWidget {
  const OnBoardingView({super.key});

  @override
  State<OnBoardingView> createState() => _OnBoardingViewState();
}

class _OnBoardingViewState extends State<OnBoardingView> {
  int currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final pages = [
      (
        image: AppImages.onboarding3,
        title: context.l10n.onboarding_title_1,
        subtitle: context.l10n.onboarding_desc_1,
      ),
      (
        image: AppImages.onboarding2,
        title: context.l10n.onboarding_title_2,
        subtitle: context.l10n.onboarding_desc_2,
      ),
      (
        image: AppImages.onboarding1,
        title: context.l10n.onboarding_title_3,
        subtitle: context.l10n.onboarding_desc_3,
      ),
    ];

    final page = pages[currentIndex];

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 24.w),
          child: Column(
            children: [
              SizedBox(height: 12.h),

              /// Language / Skip
              Align(
                alignment: AlignmentDirectional.centerEnd,
                child: GestureDetector(
                        onTap: () {
                          context.pushReplacementNamed(AppRoutes.login);
                        },
                        child: TextApp(
                          text: context.l10n.skip,
                          fontSize: 14.sp,
                          weight: AppTextWeight.regular,
                          color: AppColors.grey,
                        ),
                      ),
              ),

              SizedBox(height: 12.h),

              /// Image
              Expanded(
                flex: 5,
                child: OnBoardingImage(image: page.image),
              ),

              SizedBox(height: 27.h),

              /// Title
              TextApp(
                text: page.title,
                weight: AppTextWeight.semiBold,
                fontSize: 22.sp,
                textAlign: TextAlign.center,
                color: AppColors.primaryColor,
              ),

              SizedBox(height: 10.h),

              /// Subtitle
              TextApp(
                text: page.subtitle,
                weight: AppTextWeight.regular,
                fontSize: 14.sp,
                textAlign: TextAlign.center,
                color: AppColors.grey,
              ),

              SizedBox(height: 71.h),

              /// Indicators
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  pages.length,
                  (index) => AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    margin: EdgeInsets.symmetric(horizontal: 4.w),
                    width: currentIndex == index ? 20.w : 8.w,
                    height: 8.h,
                    decoration: BoxDecoration(
                      color: currentIndex == index
                          ? AppColors.primaryColor
                          : AppColors.grey.withOpacity(0.4),
                      borderRadius: BorderRadius.circular(10.r),
                    ),
                  ),
                ),
              ),

              SizedBox(height: 16.h),

              /// Button
              SizedBox(
                height: 44.h,
                width: double.infinity,
                child: CustomButton(
                  text: currentIndex == pages.length - 1
                      ? context.l10n.get_started
                      : context.l10n.next,
                  borderRadius: 8.r,
                  fontSize: 18.sp,
                  onPressed: () {
                    if (currentIndex == pages.length - 1) {
                      context.pushReplacementNamed(AppRoutes.login);
                    } else {
                      setState(() {
                        currentIndex++;
                      });
                    }
                  },
                ),
              ),

              SizedBox(height: 25.h),
            ],
          ),
        ),
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
      ),
    );
  }
}
