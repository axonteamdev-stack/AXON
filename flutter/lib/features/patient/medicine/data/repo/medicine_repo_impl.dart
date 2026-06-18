import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/patient/medicine/data/data_sources/medicine_remote_data_source.dart';
import 'package:Axon/features/patient/medicine/domain/entities/delete_medicine_entity.dart';
import 'package:Axon/features/patient/medicine/domain/entities/get_medicine_entity.dart';
import 'package:Axon/features/patient/medicine/domain/entities/medicine_entity.dart';
import 'package:Axon/features/patient/medicine/domain/entities/update_medicine_entity.dart';
import 'package:Axon/features/patient/medicine/domain/repo/medicine_repo.dart';

import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

@Injectable(as: MedicineRepo)
class MedicineRepoImpl implements MedicineRepo {
  final MedicineRemoteDataSource remoteDataSource;

  MedicineRepoImpl({required this.remoteDataSource});

  @override
  Future<Either<Failure, MedicineEntity>> addMedicine({
    required String medicineName,
    required double dosage,
    required String frequency,
    required String intakeTime,
    required String startDate,
    required String endDate,
    required String notes,
  }) {
    return remoteDataSource.addMedicine(
      medicineName: medicineName,
      frequency: frequency,
      intakeTime: intakeTime,
      startDate: startDate,
      endDate: endDate, dosage: dosage, notes: notes,
      
    );
  }

  @override
  Future<Either<Failure, GetMedicineEntity>> getMedicines() {
    return remoteDataSource.getMedicines();
  }

  @override
  Future<Either<Failure, UpdateMedicineEntity>> updateMedicine({
    required String medicineId,
    required String medicineName,
    required String frequency,
    required String intakeTime,
    required String startDate,
    required String endDate,
  }) {
    return remoteDataSource.updateMedicine(
      medicineId: medicineId,
      medicineName: medicineName,
      frequency: frequency,
      intakeTime: intakeTime,
      startDate: startDate,
      endDate: endDate,
    );
  }

  @override
  Future<Either<Failure, DeleteMedicineEntity>> deleteMedicine({
    required String medicineId,
  }) {
    return remoteDataSource.deleteMedicine(medicineId: medicineId);
  }
}
