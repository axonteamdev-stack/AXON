import 'package:Axon/features/auth/domain/entities/error_entity.dart';

class ErrorDM extends ErrorEntity {
  ErrorDM({
    super.statusCode,
    super.status,
    super.isOperational,
  });

  factory ErrorDM.fromJson(Map<String, dynamic> json) {
    return ErrorDM(
      statusCode: json['statusCode'],
      status: json['status'],
      isOperational: json['isOperational'],
    );
  }
}