import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/features/patient/home_patient/data/models/article_details_model.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

part 'article_details_state.dart';

class ArticleDetailsCubit extends Cubit<ArticleDetailsState> {
  ArticleDetailsCubit() : super(ArticleDetailsLoading());

  Future<void> getArticleById(String id) async {
    emit(ArticleDetailsLoading());

    await Future.delayed(const Duration(milliseconds: 600));

    final article = _dummyArticles[id];

    if (article == null) {
      emit(ArticleDetailsError());
      return;
    }

    emit(ArticleDetailsSuccess(article: article));
  }
}

/// Dummy data (simulate API)
final Map<String, ArticleDetailsModel> _dummyArticles = {
  "1": ArticleDetailsModel(
    id: "1",
    title: "5 Tips to Take Your Medication on Time",
    image: AppImages.onboarding2,
    content: _dummyContent,
  ),
  "2": ArticleDetailsModel(
    id: "2",
    title: "Why Daily Vitamins Matter for Your Health",
    image: AppImages.onboarding2,
    content: _dummyContent,
  ),
  "3": ArticleDetailsModel(
    id: "3",
    title: "Simple Habits for a Healthier Life",
    image: AppImages.onboarding3,
    content: _dummyContent,
  ),
};

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
