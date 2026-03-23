import 'package:dio/dio.dart';
import 'exceptions.dart';

class ErrorHandler {
  static AppException handle(DioException e) {
    // ⛔ timeout
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout) {
      return TimeoutException();
    }

    final statusCode = e.response?.statusCode;

    switch (statusCode) {
      case 400:
        return BadRequestException();

      case 401:
        return UnauthorizedException();

      case 403:
        return ForbiddenException();

      case 404:
        return NotFoundException();

      case 409:
        return ConflictException();

      case 422:
        return ValidationException(
          errors: e.response?.data["errors"],
        );

      case 429:
        return TooManyRequestsException();

      case 500:
        return ServerException();

      case 502:
        return BadGatewayException();

      case 503:
        return ServiceUnavailableException();

      case 504:
        return GatewayTimeoutException();

      default:
        return UnknownException();
    }
  }
}