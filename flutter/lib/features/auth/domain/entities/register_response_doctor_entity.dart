import 'package:Axon/features/auth/domain/entities/base_entity.dart';

class RegisterResponseDoctorEntity extends BaseResponseEntity {
  final RegisterDataDoctorEntity? data;

  RegisterResponseDoctorEntity({
    super.status,
    super.message,
    this.data,
    super.error,
  });
}

class RegisterDataDoctorEntity {
  final String? id;
  final String? email;
  final String? role;

  RegisterDataDoctorEntity({this.id, this.email, this.role});
}
