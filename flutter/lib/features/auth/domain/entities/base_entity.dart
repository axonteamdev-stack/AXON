import 'package:Axon/features/auth/domain/entities/error_entity.dart';

class BaseResponseEntity<T> {
  final String? status;
  final String? message;
  // final T? data;
  final ResponseErrorEntity? error;

  const BaseResponseEntity({
    this.status,
    this.message,
    // this.data,
    this.error,
  });
}