import 'package:flutter_bloc/flutter_bloc.dart';

part 'doctor_articles_state.dart';

class DoctorArticlesCubit extends Cubit<DoctorArticlesState> {
  DoctorArticlesCubit() : super(DoctorArticlesState.initial());

  void addArticle({
    required String title,
    required String content,
    String? imagePath,
  }) {
    final article = ArticleEntity(
      title: title,
      content: content,
      imagePath: imagePath,
    );

    final updated = List<ArticleEntity>.from(state.articles)
      ..insert(0, article);

    emit(
      state.copyWith(
        status: DoctorArticlesStatus.success,
        articles: updated,
      ),
    );
  }
}
