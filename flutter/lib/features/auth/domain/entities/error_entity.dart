class ErrorEntity {
  final int? statusCode;
  final String? status;
  final bool? isOperational;

  const ErrorEntity({
    this.statusCode,
    this.status,
    this.isOperational,
  });
}