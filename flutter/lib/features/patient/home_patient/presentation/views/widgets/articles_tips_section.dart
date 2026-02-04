import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/home_patient/data/models/article_details_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'article_card.dart';

class ArticlesTipsSection extends StatelessWidget {
  const ArticlesTipsSection({super.key});

  static List<ArticleDetailsModel> articles = [
    ArticleDetailsModel(
      id: "1",
      title: "5 Tips to Take Your Medication on Time",
      image: AppImages.onboarding1,
      content: _dummyContent,
    ),
    ArticleDetailsModel(
      id: "2",
      title: "Why Daily Vitamins Matter for Your Health",
      image: AppImages.onboarding2,
      content: _dummyContent,
    ),
    ArticleDetailsModel(
      id: "3",
      title: "Simple Habits for a Healthier Life",
      image: AppImages.onboarding3,
      content: _dummyContent,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 20.w),
          child: TextApp(
            text: "Articles & Tips",
            weight: AppTextWeight.semiBold,
            fontSize: 15.sp,
            color: AppColors.black,
          ),
        ),
        SizedBox(height: 10.h),
        SizedBox(
          height: 170.h,
          child: ListView.separated(
            padding: EdgeInsets.symmetric(horizontal: 20.w),
            scrollDirection: Axis.horizontal,
            itemCount: articles.length,
            separatorBuilder: (_, __) => SizedBox(width: 12.w),
            itemBuilder: (_, index) {
              return ArticleCard(item: articles[index]);
            },
          ),
        ),
      ],
    );
  }
}

/// Dummy long content (temporary – API later)
const String _dummyContent = '''
Taking care of your health is not just about visiting the doctor when you feel sick, 
but also about maintaining healthy daily habits that support your body and mind.

One of the most important habits is taking your medication on time. Missing doses or 
taking them incorrectly can reduce the effectiveness of treatment and may cause 
unexpected side effects.

Here are a few simple tips to help you stay on track:
• Set daily reminders on your phone.
• Use a pill organizer to manage your doses.
• Try to associate your medication with a daily routine, such as meals or bedtime.
• Always follow your doctor’s instructions carefully.

In addition, maintaining a balanced diet, staying hydrated, and getting enough sleep 
play a crucial role in improving your overall health. Small changes in your lifestyle 
can make a big difference over time.

Remember, consistency is key. By sticking to healthy habits every day, you give your 
body the best chance to heal and stay strong.
''';
