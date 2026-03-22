
import 'package:Axon/features/auth/domain/entities/base_entity.dart';
import 'package:Axon/features/auth/domain/entities/error_entity.dart';

class LoginResponseEntity extends BaseResponseEntity{

  // final UserEntity? user;
  const LoginResponseEntity({
    super.status,
    super.message,
    // this.user,
    super.error,
  });
}
