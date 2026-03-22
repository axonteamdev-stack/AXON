import 'package:Axon/features/auth/domain/entities/base_entity.dart';
import 'package:Axon/features/auth/domain/entities/user_entity.dart';

class LoginResponseEntity extends BaseResponseEntity<UserEntity> {
  const LoginResponseEntity({
    super.status,
    super.message,
    super.data,
    super.error,
  });
}