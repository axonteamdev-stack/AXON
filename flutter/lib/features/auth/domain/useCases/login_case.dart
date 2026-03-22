import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/auth/domain/entities/login_response_entity.dart';
import 'package:Axon/features/auth/domain/repo/auth_repo.dart';
import 'package:dartz/dartz.dart';

class LoginUseCase {
  final AuthRepo authRepo;

  LoginUseCase(this.authRepo);

  Future<Either<Failure, LoginResponseEntity>>  invoke({
    required String email,
    required String password,
  }) {
    return authRepo.login(
      email: email,
      password: password,
    );
  }
}