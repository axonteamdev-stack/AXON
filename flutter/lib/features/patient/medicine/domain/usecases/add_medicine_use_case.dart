import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/patient/medicine/domain/entities/medicine_entity.dart';
import 'package:Axon/features/patient/medicine/domain/repo/medicine_repo.dart';

import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

@injectable
class AddMedicineUseCase {
  final MedicineRepo medicineRepo;

  AddMedicineUseCase(this.medicineRepo);

  Future<Either<Failure, MedicineEntity>> call({
    required String medicineName,
    required double dosage,
    required String frequency,
    required String intakeTime,
    required String startDate,
    required String endDate,
    required String notes,
  }) {
    return medicineRepo.addMedicine(
      medicineName: medicineName,
      frequency: frequency,
      intakeTime: intakeTime,
      startDate: startDate,
      endDate: endDate, dosage: dosage, notes: notes,
    );
  }
}