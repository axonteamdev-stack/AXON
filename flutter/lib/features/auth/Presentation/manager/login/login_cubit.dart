import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/auth/domain/entities/login_response_entity.dart';
import 'package:Axon/features/auth/domain/useCases/login_case.dart';
import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:injectable/injectable.dart';

part 'login_state.dart';
@injectable
class LoginCubit extends Cubit<LoginState> {
  final LoginUseCase loginUseCase;
  LoginCubit({required this.loginUseCase}) : super(LoginInitial());

  final emailController = TextEditingController(text: "shroukkaoud777@gmail.com");
  final passwordController = TextEditingController(text: "P@assword123");

  final formKey = GlobalKey<FormState>();

  Future<void> login(BuildContext context) async {
    if (formKey.currentState!.validate() == true) {
      emit(LoginLoading());
      var either = await loginUseCase.invoke(
        email: emailController.text,
        password: passwordController.text,
      );
      either.fold(
        (error) => emit(LoginError(failure: error)),
        (response) => emit(LoginSuccess(loginResponseEntity: response)),
        
      );
    }
  }
}
