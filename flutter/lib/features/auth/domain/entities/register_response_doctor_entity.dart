import 'package:Axon/features/auth/domain/entities/base_entity.dart';
import 'package:Axon/features/auth/domain/entities/login_response_entity.dart';
import 'package:Axon/features/auth/domain/entities/user_entity.dart';

class RegisterResponseDoctorEntity
    extends BaseResponseEntity<RegisterDoctorDataEntity> {

  const RegisterResponseDoctorEntity({
    super.success,
    super.message,
    super.data,
    super.error,
  });
}

class RegisterDoctorDataEntity {

  final UserEntity? user;

  final TokensEntity? tokens;

  const RegisterDoctorDataEntity({
    this.user,
    this.tokens,
  });
}