import 'package:dio/dio.dart';
import '../models/doctor_model.dart';
import '../models/doctor_review_model.dart';

class DoctorRepository {
  final Dio _dio;

  DoctorRepository({Dio? dio})
      : _dio = dio ??
            Dio(BaseOptions(
              baseUrl: 'http://localhost:3000',
              connectTimeout: const Duration(seconds: 15),
              receiveTimeout: const Duration(seconds: 15),
            ));

  Future<List<DoctorModel>> getDoctors() async {
    final response = await _dio.get('/users/doctors', queryParameters: {
      'page': 1,
      'limit': 50,
    });
    final data = response.data;
    final List<dynamic> doctorsJson = data?['data']?['doctors'] ?? [];
    return doctorsJson
        .map((json) => DoctorModel.fromJson(json as Map<String, dynamic>))
        .toList();
  }
}
}
