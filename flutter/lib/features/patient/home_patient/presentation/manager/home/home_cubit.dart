import 'package:Axon/features/patient/home_patient/domain/useCases/get_all_articales_usecase.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/home/home_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

@injectable
class HomeCubit extends Cubit<HomeState> {
  final GetAllArticlesUseCase fetchArticlesUseCase;

  HomeCubit({required this.fetchArticlesUseCase})
      : super(HomeInitial());

  Future<void> fetchHomeArticles() async {
    emit(HomeLoading());

    final either = await fetchArticlesUseCase();

    either.fold(
      (failure) {
        print("Fetch Articles Error: ${failure}");
        emit(HomeError(failure: failure));
      },
      (articlesEntity) {
        print("Fetch Articles Success: ${articlesEntity.message}");
        emit(HomeSuccess(articlesEntity: articlesEntity));
      },
    );
  }
}