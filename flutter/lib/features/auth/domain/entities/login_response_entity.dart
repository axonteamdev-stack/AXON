import 'package:Axon/features/auth/domain/entities/base_entity.dart';
import 'package:Axon/features/auth/domain/entities/user_entity.dart';

class LoginResponseEntity extends BaseResponseEntity<LoginDataEntity> {
  const LoginResponseEntity({
    super.success,
    super.message,
    super.data,
    super.error,
  });
}

class LoginDataEntity {
  final UserEntity? user;
  final TokensEntity? tokens;

  const LoginDataEntity({
    this.user,
    this.tokens,
  });
}

class TokensEntity {
  final String? accessToken;
  final String? refreshToken;

  const TokensEntity({
    this.accessToken,
    this.refreshToken,
  });
}