import 'package:Axon/core/service/shared_pref/pref_keys.dart';
import 'package:Axon/core/service/shared_pref/shared_pref.dart';
import 'package:Axon/features/patient/profile_patient/domain/usecases/update_profile_patient_use_case.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'patient_edit_dynamic_list_state.dart';

@injectable
class PatientEditDynamicListCubit
    extends Cubit<PatientEditDynamicListState> {
  final UpdateProfilePatientUseCase updateProfilePatientUseCase;

  PatientEditDynamicListCubit({
    required this.updateProfilePatientUseCase,
    required this.prefKey,
    required this.isAllergies,
  }) : super(
          const PatientEditDynamicListState(
            isEditMode: false,
            isLoading: false,
            items: [],
          ),
        ) {
    loadData();
  }

  final String prefKey;
  final bool isAllergies;

  final SharedPref sharedPref = SharedPref();

  /// =========================
  /// Load Existing Data
  /// =========================

  void loadData() {
    final savedData =
        sharedPref.getString(prefKey) ?? "";

    final values = savedData
        .split(",")
        .where((e) => e.trim().isNotEmpty)
        .toList();

    emit(
      state.copyWith(
        items: values
            .map(
              (e) => EditDynamicItem(value: e),
            )
            .toList(),
      ),
    );
  }

  /// =========================
  /// Toggle Edit
  /// =========================

  void toggleEdit() {
    emit(
      state.copyWith(
        isEditMode: !state.isEditMode,
      ),
    );
  }

  /// =========================
  /// Add Item
  /// =========================

  void addItem() {
    if (!state.isEditMode) return;

    emit(
      state.copyWith(
        items: [
          ...state.items,
          EditDynamicItem(),
        ],
      ),
    );
  }

  /// =========================
  /// Remove Item
  /// =========================

  void removeItem(int index) {
    if (!state.isEditMode) return;

    final updated = [...state.items];
    updated[index].controller.dispose();
    updated.removeAt(index);

    emit(
      state.copyWith(
        items: updated,
      ),
    );
  }

  /// =========================
  /// Save + API Update
  /// =========================

  Future<void> saveData() async {
    emit(
      state.copyWith(
        isLoading: true,
      ),
    );

    final currentValues = state.items
        .map((e) => e.controller.text.trim())
        .where((e) => e.isNotEmpty)
        .toList();

    /// باقي البيانات من SharedPref
    final fullName =
        sharedPref.getString(PrefKeys.fullName) ?? "";

    final email =
        sharedPref.getString(PrefKeys.email) ?? "";

    final phone =
        sharedPref.getString(PrefKeys.phoneNumber) ?? "";

    final gender =
        sharedPref.getString(PrefKeys.gender) ?? "Male";

    final bloodType =
        sharedPref.getString(PrefKeys.bloodType) ?? "O+";

    final height = double.tryParse(
          sharedPref.getString(PrefKeys.height) ?? "0",
        ) ??
        0;

    final weight = double.tryParse(
          sharedPref.getString(PrefKeys.weight) ?? "0",
        ) ??
        0;

    final conditions = isAllergies
        ? (sharedPref.getString(PrefKeys.conditions) ?? "")
            .split(",")
            .where((e) => e.isNotEmpty)
            .toList()
        : currentValues;

    final allergies = isAllergies
        ? currentValues
        : (sharedPref.getString(PrefKeys.allergies) ?? "")
            .split(",")
            .where((e) => e.isNotEmpty)
            .toList();

    final result = await updateProfilePatientUseCase.call(
      fullName: fullName,
      email: email,
      phoneNumber: phone,
      gender: gender,
      bloodType: bloodType,
      height: height,
      weight: weight,
      conditions: conditions,
      allergies: allergies,
      personalPhoto: null,
      radiologyImages: [],
      radiologyDescriptions: [],
      labImages: [],
      labDescriptions: [],
    );

    result.fold(
      (failure) {
        emit(
          state.copyWith(
            isLoading: false,
          ),
        );
      },
      (success) async {
        await sharedPref.setString(
          prefKey,
          currentValues.join(","),
        );

        emit(
          state.copyWith(
            isLoading: false,
            isEditMode: false,
          ),
        );
      },
    );
  }

  @override
  Future<void> close() {
    for (final item in state.items) {
      item.controller.dispose();
    }
    return super.close();
  }
}