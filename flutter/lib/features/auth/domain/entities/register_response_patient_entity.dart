import 'package:Axon/features/auth/domain/entities/base_entity.dart';
import 'package:Axon/features/auth/domain/entities/login_response_entity.dart';
import 'package:Axon/features/auth/domain/entities/user_entity.dart';

class RegisterPatientEntity
    extends BaseResponseEntity<RegisterPatientDataEntity> {

  const RegisterPatientEntity({
    super.success,
    super.message,
    super.data,
    super.error,
  });
}

class RegisterPatientDataEntity {

  final UserEntity? user;

  final TokensEntity? tokens;

  const RegisterPatientDataEntity({
    this.user,
    this.tokens,
  });
}