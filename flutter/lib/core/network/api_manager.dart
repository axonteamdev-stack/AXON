import 'package:dio/dio.dart';
import '../errors/exceptions.dart';

class ApiManager {
  final Dio dio;

  ApiManager({
    required String baseUrl,
    Map<String, String>? headers,
  }) : dio = Dio(
          BaseOptions(
            baseUrl: baseUrl,
            headers: headers,
            connectTimeout: const Duration(seconds: 15),
            receiveTimeout: const Duration(seconds: 15),
          ),
        );

  Future<Response> get(
    String endPoint, {
    Map<String, dynamic>? query,
  }) async {
    try {
      return await dio.get(endPoint, queryParameters: query);
    } on DioException catch (e) {
      _handleError(e);
      rethrow;
    }
  }

  Future<Response> post(
    String endPoint, {
    dynamic body,
    Map<String, dynamic>? query,
  }) async {
    try {
      return await dio.post(
        endPoint,
        data: body,
        queryParameters: query,
      );
    } on DioException catch (e) {
      _handleError(e);
      rethrow;
    }
  }

  Future<Response> put(
    String endPoint, {
    dynamic body,
  }) async {
    try {
      return await dio.put(endPoint, data: body);
    } on DioException catch (e) {
      _handleError(e);
      rethrow;
    }
  }

  Future<Response> delete(String endPoint) async {
    try {
      return await dio.delete(endPoint);
    } on DioException catch (e) {
      _handleError(e);
      rethrow;
    }
  }

  void _handleError(DioException e) {
    if (e.type == DioExceptionType.connectionTimeout ||
        e.type == DioExceptionType.receiveTimeout ||
        e.type == DioExceptionType.sendTimeout) {
      throw TimeoutException();
    }

    if (e.type == DioExceptionType.connectionError ||
        e.response == null) {
      throw OfflineException();
    }

    switch (e.response!.statusCode) {
      case 400:
        throw BadRequestException();
      case 401:
        throw UnauthorizedException();
      case 403:
        throw ForbiddenException();
      case 404:
        throw NotFoundException();
      case 409:
        throw ConflictException();
      case 422:
        throw ValidationException(
          errors: e.response?.data is Map<String, dynamic>
              ? e.response?.data['errors']
              : null,
        );
      case 429:
        throw TooManyRequestsException();
      case 500:
      case 502:
        throw BadGatewayException();
      case 503:
        throw ServiceUnavailableException();
      case 504:
        throw GatewayTimeoutException();
      default:
        throw ServerException();
    }
  }
}