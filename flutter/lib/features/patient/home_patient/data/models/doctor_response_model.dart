

import 'package:Axon/features/patient/home_patient/domain/entities/doctor_rsponse_entity.dart';

class DoctorResponseModel extends DoctorRsponseEntity {
  DoctorResponseModel({
    required super.id,
    required super.fullName,
    super.personalPhoto,
  });

  factory DoctorResponseModel.fromJson(Map<String, dynamic> json) {
    return DoctorResponseModel(
      id: json["_id"],
      fullName: json["fullName"],
      personalPhoto: json["personalPhoto"],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "_id": id,
      "fullName": fullName,
      "personalPhoto": personalPhoto,
    };
  }
}