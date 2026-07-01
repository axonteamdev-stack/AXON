// doctor_dm.dart

import 'package:Axon/features/patient/book_doctor/domain/entities/doctor_entity.dart';

class DoctorDM extends DoctorEntity {
  DoctorDM({
    required super.id,
    required super.fullName,
    super.email,
    super.phoneNumber,
    super.personalPhoto,
    super.gender,
    super.specialization,
    super.yearsExperience,
    super.about,
    super.price,
  });

  factory DoctorDM.fromJson(Map<String, dynamic> json) {
    print("DOCTOR JSON => $json");

    final doctorProfile = json["doctorProfile"] ?? {};

    return DoctorDM(
      id: json["id"] ?? json["_id"] ?? "",
      fullName: json["fullName"] ?? "",
      email: json["email"],
      phoneNumber: json["phoneNumber"],
      personalPhoto: json["personalPhoto"],
      gender: json["gender"],
      specialization:
          json["specialization"] ?? doctorProfile["specialization"] ?? "",
      yearsExperience:
          json["yearsExperience"] ?? doctorProfile["yearsExperience"] ?? 0,
      about: json["about"] ?? doctorProfile["about"] ?? "",
      price: json["price"] ?? doctorProfile["price"] ?? 0,
    );
  }
}
