class ResponseErrorEntity {
  final int? statusCode;
  final String? status;
  final bool? isOperational;

  ResponseErrorEntity({this.statusCode, this.status, this.isOperational});
}