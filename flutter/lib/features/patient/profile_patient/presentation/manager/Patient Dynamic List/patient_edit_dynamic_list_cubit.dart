import 'package:flutter_bloc/flutter_bloc.dart';
import 'patient_edit_dynamic_list_state.dart';

class PatientEditDynamicListCubit
    extends Cubit<PatientEditDynamicListState> {
  PatientEditDynamicListCubit()
      : super(
          const PatientEditDynamicListState(
            isEditMode: false,
            items: [],
          ),
        );

  void loadEditMockData(List<String> values) {
    emit(
      state.copyWith(
        items: values.map((e) => EditDynamicItem(value: e)).toList(),
      ),
    );
  }

  void toggleEdit() {
    emit(state.copyWith(isEditMode: !state.isEditMode));
  }

  void addItem() {
    if (!state.isEditMode) return;

    emit(
      state.copyWith(
        items: [...state.items, EditDynamicItem()],
      ),
    );
  }

  void removeItem(int index) {
    if (!state.isEditMode) return;

    final list = [...state.items];
    list.removeAt(index);

    emit(state.copyWith(items: list));
  }

  @override
  Future<void> close() {
    for (final item in state.items) {
      item.controller.dispose();
    }
    return super.close();
  }
}
