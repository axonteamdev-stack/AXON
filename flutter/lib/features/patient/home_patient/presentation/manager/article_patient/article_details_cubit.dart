import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/patient/home_patient/domain/entities/article_details_entity.dart';
import 'package:Axon/features/patient/home_patient/domain/useCases/get_article_details_usecase.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

part 'article_details_state.dart';

@injectable
class ArticleDetailsCubit
    extends Cubit<ArticleDetailsState> {

  final GetArticleDetailsUseCase
      getArticleDetailsUseCase;

  ArticleDetailsCubit(
    this.getArticleDetailsUseCase,
  ) : super(
          ArticleDetailsInitial(),
        );

  Future<void> getArticleById(
    String id,
  ) async {

    emit(
      ArticleDetailsLoading(),
    );

    final either =
        await getArticleDetailsUseCase(
      id,
    );

    either.fold(

      (failure) {

        emit(
          ArticleDetailsError(
            failure: failure,
          ),
        );
      },

      (article) {

        emit(
          ArticleDetailsSuccess(
            article: article,
          ),
        );
      },
    );
  }
}