import 'package:Axon/features/auth/domain/entities/base_entity.dart';
import 'package:Axon/features/auth/domain/entities/based_user_info_entity.dart';
import 'package:Axon/features/auth/domain/entities/medical_profile_entity.dart';

class RegisterPatientEntity extends BaseResponseEntity {
  final PatientDataEntity? data;

  RegisterPatientEntity({super.status, this.data, super.error, super.message});
}

class PatientDataEntity extends BasedUserInfoEntity {
  final MedicalProfileEntity? medicalProfile;

  PatientDataEntity({
    super.fullName,
    super.email,
    super.phoneNumber,
    super.gender,
    super.personalPhoto,
    super.role,
    super.isVerified,
    this.medicalProfile,
    super.id,
    super.createdAt,
    super.updatedAt,
  });
}
