import 'package:Axon/features/patient/medicine/domain/usecases/delete_medicine_use_case.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/delete_medicine/delete_medicine_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';



@injectable
class DeleteMedicineCubit
    extends Cubit<DeleteMedicineState> {
  final DeleteMedicineUseCase
      deleteMedicineUseCase;

  DeleteMedicineCubit({
    required this.deleteMedicineUseCase,
  }) : super(DeleteMedicineInitial());

  Future<void> deleteMedicine(
    String medicineId,
  ) async {
    emit(DeleteMedicineLoading());

    final result =
        await deleteMedicineUseCase.call(
      medicineId: medicineId,
    );

    result.fold(
      (failure) {
        emit(
          DeleteMedicineError(
            failure: failure,
          ),
        );
      },
      (response) {
        emit(DeleteMedicineSuccess());
      },
    );
  }
}