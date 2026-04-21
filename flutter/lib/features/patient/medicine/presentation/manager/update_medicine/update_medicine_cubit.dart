import 'package:Axon/features/patient/medicine/domain/usecases/update_medicine_use_case.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/update_medicine/update_medicine_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';



@injectable
class UpdateMedicineCubit
    extends Cubit<UpdateMedicineState> {
  final UpdateMedicineUseCase
      updateMedicineUseCase;

  UpdateMedicineCubit({
    required this.updateMedicineUseCase,
  }) : super(UpdateMedicineInitial());

  Future<void> updateMedicine({
    required String medicineId,
    required String medicineName,
    required String frequency,
    required List<String> intakeTime,
    required String startDate,
    required String endDate,
  }) async {
    emit(UpdateMedicineLoading());

    final result =
        await updateMedicineUseCase.call(
      medicineId: medicineId,
      medicineName: medicineName,
      frequency: frequency,
      intakeTime: intakeTime,
      startDate: startDate,
      endDate: endDate,
    );

    result.fold(
      (failure) {
        emit(
          UpdateMedicineError(
            failure: failure,
          ),
        );
      },
      (response) {
        emit(UpdateMedicineSuccess());
      },
    );
  }
}