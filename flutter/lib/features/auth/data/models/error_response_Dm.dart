import 'package:Axon/features/auth/domain/entities/error_entity.dart';

class ErrorResponseDM extends ResponseErrorEntity {
  ErrorResponseDM({super.statusCode, super.status, super.isOperational});

  factory ErrorResponseDM.fromJson(Map<String, dynamic> json) {
    return ErrorResponseDM(
      statusCode: json['statusCode'],
      status: json['status'],
      isOperational: json['isOperational'],
    );
  }
}