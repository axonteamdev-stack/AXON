import 'package:flutter_bloc/flutter_bloc.dart';
import 'medicine_filter_state.dart';

class MedicineFilterCubit extends Cubit<MedicineFilterState> {
  MedicineFilterCubit() : super(const MedicineFilterState());

  void updateSearch(String value) {
    emit(state.copyWith(search: value.toLowerCase()));
  }

  void clearSearch() {
    emit(state.copyWith(search: ''));
  }

  void updateDate(DateTime date) {
    emit(state.copyWith(date: date));
  }
}
