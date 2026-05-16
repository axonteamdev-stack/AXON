import 'package:Axon/features/auth/data/models/error_Dm.dart';
import 'package:Axon/features/auth/domain/entities/register_response_doctor_entity.dart';

class RegisterResponseDoctorDm extends RegisterResponseDoctorEntity {
  final String? stack;

  RegisterResponseDoctorDm({
    super.success,
    super.message,
    super.data,
    super.error,
    this.stack,
  });

  factory RegisterResponseDoctorDm.fromJson(Map<String, dynamic> json) {
    return RegisterResponseDoctorDm(
      success: json['status'],
      message: json['message'],
      stack: json['stack'],
      data: json['data'] != null
          ? DataDoctorDM.fromJson(json['data'])
          : null,
      error: json['error'] != null
          ? ErrorDM.fromJson(json['error'])
          : null,
    );
  }
}

class DataDoctorDM extends RegisterDataDoctorEntity {
  DataDoctorDM({
    super.id,
    super.email,
    super.role,
  });

  factory DataDoctorDM.fromJson(Map<String, dynamic> json) {
    return DataDoctorDM(
      id: json['_id'],
      email: json['email'],
      role: json['role'],
    );
  }
}