import 'package:Axon/features/patient/home_patient/data/models/home_model.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/home/home_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class HomeCubit extends Cubit<HomeState> {
  HomeCubit() : super(HomeInitial());

  void loadHome() async {
    emit(HomeLoading());

    final model = HomeModel(
      userName: "Mohamed",
      taken: 2,
      total: 4,
      nextMedicine: "Vitamin D",
    );

    emit(HomeSuccess(model));
  }
}
