import 'package:Axon/core/extensions/context_extension.dart';
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
            backgroundColor: AppColors.white,
            body: SafeArea(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 24.w),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    SizedBox(height: 12.h),
                    Align(
                      alignment: Alignment.centerRight,
                      child: const TextApp(
                        text: 'Skip',
                        weight: AppTextWeight.regular,
                        fontSize: 14,
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
                      color: AppColors.black,
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
                        text:
                            cubit.currentIndex == 2 ? 'Get Started' : 'Next',
                        borderRadius: 8.r,
                        fontSize: 18.sp,
                        onPressed: () {
                          if (cubit.currentIndex == 2) {
                            context.pushReplacementNamed(AppRoutes.login);
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
      ),
    );
  }
}
