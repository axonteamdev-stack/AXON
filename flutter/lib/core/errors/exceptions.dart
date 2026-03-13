abstract class AppException implements Exception {
  final String message;
  AppException(this.message);

  @override
  String toString() => message;
}

/// Network
class OfflineException extends AppException {
  OfflineException() : super('No internet connection');
}

class TimeoutException extends AppException {
  TimeoutException() : super('Request timeout');
}

/// 4xx Client Errors
class BadRequestException extends AppException {
  BadRequestException() : super('Bad request');
}

class UnauthorizedException extends AppException {
  UnauthorizedException() : super('Unauthorized');
}

class ForbiddenException extends AppException {
  ForbiddenException() : super('Forbidden');
}

class NotFoundException extends AppException {
  NotFoundException() : super('Resource not found');
}

class ConflictException extends AppException {
  ConflictException() : super('Conflict occurred');
}

class ValidationException extends AppException {
  final Map<String, dynamic>? errors;
  ValidationException({this.errors}) : super('Validation error');
}

class TooManyRequestsException extends AppException {
  TooManyRequestsException() : super('Too many requests');
}

/// 5xx Server Errors
class ServerException extends AppException {
  ServerException() : super('Internal server error');
}

class BadGatewayException extends AppException {
  BadGatewayException() : super('Bad gateway');
}

class ServiceUnavailableException extends AppException {
  ServiceUnavailableException() : super('Service unavailable');
}

class GatewayTimeoutException extends AppException {
  GatewayTimeoutException() : super('Gateway timeout');
}

/// Unknown
class UnknownException extends AppException {
  UnknownException() : super('Unknown error');
}