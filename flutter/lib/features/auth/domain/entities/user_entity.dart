import 'package:Axon/features/auth/domain/entities/doctor_profile_entity.dart';
import 'package:Axon/features/auth/domain/entities/medical_profile_entity.dart';

class UserEntity {
  final String? id;
  final String? fullName;
  final String? email;
  final String? phoneNumber;
  final String? gender;
  final String? personalPhoto;
  final String? role;
  final bool? isVerified;
  final String? createdAt;
  final String? updatedAt;

  final DoctorProfileEntity? doctorProfile;
  final MedicalProfileEntity? medicalProfile;

  const UserEntity({
    this.id,
    this.fullName,
    this.email,
    this.phoneNumber,
    this.gender,
    this.personalPhoto,
    this.role,
    this.isVerified,
    this.createdAt,
    this.updatedAt,
    this.doctorProfile,
    this.medicalProfile,
  });
}