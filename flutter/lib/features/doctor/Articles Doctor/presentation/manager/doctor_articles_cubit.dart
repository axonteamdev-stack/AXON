import 'package:Axon/features/doctor/Articles%20Doctor/domain/usecases/create_article_usecase.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/domain/usecases/get_doctor_posts_usecase.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'doctor_articles_state.dart';

@injectable
class DoctorArticlesCubit
    extends Cubit<DoctorArticlesState> {

  final CreateArticleUseCase
      createArticleUseCase;

  final GetDoctorPostsUseCase
      getDoctorPostsUseCase;

  DoctorArticlesCubit(

    this.createArticleUseCase,

    this.getDoctorPostsUseCase,

  ) : super(DoctorArticlesInitial());

  Future<void> createArticle({

    required String title,

    required String content,

    required String imagePath,
  }) async {

    emit(DoctorArticlesLoading());

    final either =
        await createArticleUseCase(

      title: title,

      content: content,

      imagePath: imagePath,
    );

    either.fold(

      (failure) {

        emit(
          DoctorArticlesError(
            failure: failure,
          ),
        );
      },

      (_) async {

        await getDoctorPosts();
      },
    );
  }

  Future<void> getDoctorPosts() async {

    emit(DoctorArticlesLoading());

    final either =
        await getDoctorPostsUseCase();

    either.fold(

      (failure) {

        emit(
          DoctorArticlesError(
            failure: failure,
          ),
        );
      },

      (posts) {

        emit(
          DoctorArticlesSuccess(
            postsEntity: posts,
          ),
        );
      },
    );
  }
}