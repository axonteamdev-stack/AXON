
import 'package:Axon/core/errors/failures.dart';

abstract class DeleteMedicineState {}

class DeleteMedicineInitial
    extends DeleteMedicineState {}

class DeleteMedicineLoading
    extends DeleteMedicineState {}

class DeleteMedicineSuccess
    extends DeleteMedicineState {}

class DeleteMedicineError
    extends DeleteMedicineState {
  final Failure failure;

  DeleteMedicineError({
    required this.failure,
  });
}