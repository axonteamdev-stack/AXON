class RegisterResponseDoctorModel {
  final String? status;
  final String? message;
  final DataDoctorModel? data;
  final ErrorDoctorModel? error;
  final String? stack;

  RegisterResponseDoctorModel({
    this.status,
    this.message,
    this.data,
    this.error,
    this.stack,
  });

  factory RegisterResponseDoctorModel.fromJson(Map<String, dynamic> json) {
    return RegisterResponseDoctorModel(
      status: json['status'],
      message: json['message'],
      stack: json['stack'],
      data: json['data'] != null
          ? DataDoctorModel.fromJson(json['data'])
          : null,
      error: json['error'] != null
          ? ErrorDoctorModel.fromJson(json['error'])
          : null,
    );
  }
}

class DataDoctorModel {
  final String? id;
  final String? email;
  final String? role;

  DataDoctorModel({this.id, this.email, this.role});

  factory DataDoctorModel.fromJson(Map<String, dynamic> json) {
    return DataDoctorModel(
      id: json['id'],
      email: json['email'],
      role: json['role'],
    );
  }
}

class ErrorDoctorModel {
  final int? statusCode;
  final String? status;
  final bool? isOperational;

  ErrorDoctorModel({this.statusCode, this.status, this.isOperational});

  factory ErrorDoctorModel.fromJson(Map<String, dynamic> json) {
    return ErrorDoctorModel(
      statusCode: json['statusCode'],
      status: json['status'],
      isOperational: json['isOperational'],
    );
  }
}