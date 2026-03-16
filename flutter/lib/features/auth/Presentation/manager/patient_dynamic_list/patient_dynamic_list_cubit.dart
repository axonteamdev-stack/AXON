import 'package:flutter_bloc/flutter_bloc.dart';
import 'patient_dynamic_list_state.dart';

class PatientDynamicListCubit extends Cubit<PatientDynamicListState> {
  PatientDynamicListCubit({List<String>? initial})
      : super(
          PatientDynamicListState(
            items: initial
                    ?.map((e) => PatientDynamicItem(initial: e))
                    .toList() ??
                [PatientDynamicItem()],
          ),
        );

  void addItem() {
    emit(
      state.copyWith(
        items: [...state.items, PatientDynamicItem()],
      ),
    );
  }

  void removeItem(int index) {
    final list = [...state.items];
    list.removeAt(index);
    emit(state.copyWith(items: list));
  }

  List<String> getValues() {
    return state.items
        .map((e) => e.controller.text.trim())
        .where((e) => e.isNotEmpty)
        .toList();
  }
}
