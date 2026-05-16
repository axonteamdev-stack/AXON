import 'package:Axon/features/auth/domain/entities/doctor_profile_entity.dart';

class DoctorProfileDM extends DoctorProfileEntity {
  DoctorProfileDM({
    super.specialization,
    super.yearsExperience,
    super.medicalLicenseNumber,
    super.licenseImage,
    super.about,
    super.price,
  });

  factory DoctorProfileDM.fromJson(Map<String, dynamic> json) {
    return DoctorProfileDM(
      specialization: json['specialization'],
      yearsExperience: (json['yearsExperience'] as num?)?.toInt(),
      medicalLicenseNumber: json['medicalLicenseNumber'],
      licenseImage: json['licenseImage'],
      about: json['about'],
      price: (json['price'] as num?)?.toInt(),
    );
  }
}