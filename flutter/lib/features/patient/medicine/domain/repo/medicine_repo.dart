import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/patient/medicine/domain/entities/delete_medicine_entity.dart';
import 'package:Axon/features/patient/medicine/domain/entities/get_medicine_entity.dart';
import 'package:Axon/features/patient/medicine/domain/entities/medicine_entity.dart';
import 'package:Axon/features/patient/medicine/domain/entities/update_medicine_entity.dart';
import 'package:dartz/dartz.dart';

abstract class MedicineRepo {
  Future<Either<Failure, MedicineEntity>> addMedicine({
    required String medicineName,
    required double dosage,
    required String frequency,
    required String intakeTime,
    required String startDate,
    required String endDate,
    required String notes,
  });

Future<Either<Failure, GetMedicineEntity>> getMedicines();



  Future<Either<Failure, UpdateMedicineEntity>>
      updateMedicine({
    required String medicineId,
    required String medicineName,
    required String frequency,
    required String intakeTime,
    required String startDate,
    required String endDate,
  });

  Future<Either<Failure, DeleteMedicineEntity>>
      deleteMedicine({
    required String medicineId,
  });
  
}