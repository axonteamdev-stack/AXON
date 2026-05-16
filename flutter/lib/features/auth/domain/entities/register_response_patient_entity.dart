import 'package:Axon/features/auth/domain/entities/base_entity.dart';
import 'package:Axon/features/auth/domain/entities/user_entity.dart';

class RegisterPatientEntity
    extends BaseResponseEntity<PatientDataEntity> {
  const RegisterPatientEntity({
    super.success,
    super.message,
    super.data,
    super.error, 
  });
}

class PatientDataEntity extends UserEntity {
  const PatientDataEntity({
    super.fullName,
    super.email,
    super.phoneNumber,
    super.gender,
    super.personalPhoto,
    super.role,
    super.isVerified,
    super.medicalProfile,
    super.id,
    super.createdAt,
    super.updatedAt,
  });
}