import 'package:Axon/features/auth/domain/entities/error_entity.dart';

class BaseResponseEntity<T> {
  final bool? success;
  final String? message;
  final T? data;
  final ErrorEntity? error;

  const BaseResponseEntity({
    this.success,
    this.message,
    this.data,
    this.error,
  });
}