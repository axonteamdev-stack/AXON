class RegisterResponseDoctorEntity {
  final String? status;
  final String? message;
  final DataDoctorEntity? data;
  final ErrorDoctorEntity? error;

  RegisterResponseDoctorEntity({
    this.status,
    this.message,
    this.data,
    this.error,
  });
}

class DataDoctorEntity {
  final String? id;
  final String? email;
  final String? role;

  DataDoctorEntity({this.id, this.email, this.role});
}

class ErrorDoctorEntity {
 final int? statusCode;
  final String? status;
 final  bool? isOperational;

  ErrorDoctorEntity({this.statusCode, this.status, this.isOperational});
}
