import 'package:Axon/features/patient/qr_patient/domain/entities/patient_qr_entity.dart';


class QrPatientModel extends QrPatientEntity {
  const QrPatientModel({
    required super.id,
    required super.fullName,
    required super.email,
    required super.phoneNumber,
    required super.gender,
    required super.personalPhoto,
    required super.bloodType,
    required super.height,
    required super.weight,
    required super.conditions,
    required super.allergies,
    required super.emergencyName,
    required super.emergencyPhone,
  });

  factory QrPatientModel.fromJson(Map<String, dynamic> json) {
    final patient = json["data"]["patient"];
    final profile = patient["profile"];

    return QrPatientModel(
      id: patient["id"] ?? "",
      fullName: patient["fullName"] ?? "",
      email: patient["email"] ?? "",
      phoneNumber: patient["phoneNumber"] ?? "",
      gender: patient["gender"] ?? "",
      personalPhoto: patient["personalPhoto"],
      bloodType: profile["bloodType"] ?? "",
      height: (profile["height"] as num?)?.toDouble() ?? 0,
      weight: (profile["weight"] as num?)?.toDouble() ?? 0,
      conditions: List<String>.from(profile["conditions"] ?? []),
      allergies: List<String>.from(profile["allergies"] ?? []),
      emergencyName: profile["emergencyContact"]?["name"] ?? "",
      emergencyPhone: profile["emergencyContact"]?["phone"] ?? "",
    );
  }
}