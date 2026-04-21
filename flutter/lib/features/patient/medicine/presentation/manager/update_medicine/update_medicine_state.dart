
import 'package:Axon/core/errors/failures.dart';

abstract class UpdateMedicineState {}

class UpdateMedicineInitial
    extends UpdateMedicineState {}

class UpdateMedicineLoading
    extends UpdateMedicineState {}

class UpdateMedicineSuccess
    extends UpdateMedicineState {}

class UpdateMedicineError
    extends UpdateMedicineState {
  final Failure failure;

  UpdateMedicineError({
    required this.failure,
  });
}