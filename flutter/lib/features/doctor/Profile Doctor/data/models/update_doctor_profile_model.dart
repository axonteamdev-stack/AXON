
import 'package:Axon/features/doctor/Profile%20Doctor/domain/entity/doctor_profile_entity.dart';

class UpdateDoctorProfileModel
    extends UpdateDoctorProfileEntity {

  UpdateDoctorProfileModel({

    required super.success,

    required super.message,
  });

  factory UpdateDoctorProfileModel
      .fromJson(
    Map<String, dynamic> json,
  ) {

    return UpdateDoctorProfileModel(

      success:
          json['success'] ?? false,

      message:
          json['message'] ?? "",
    );
  }
}