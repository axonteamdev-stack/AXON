import 'package:Axon/core/service/shared_pref/shared_pref.dart';
import 'package:Axon/core/service/shared_pref/pref_keys.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'endpoints.dart';

class ApiManager {
  late Dio dio;

  ApiManager() {
    dio = Dio(
      BaseOptions(
        baseUrl: Endpoints.baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
      ),
    );

    _addInterceptors();
  }

  void _addInterceptors() {
    dio.interceptors.add(CookieManager(CookieJar()));

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = SharedPref().getString(PrefKeys.accessToken);

          // ✅ add token
          if (token != null && token.isNotEmpty) {
            options.headers["Authorization"] = "Bearer $token";
          }

          print("📤 ${options.method} ${options.uri}");
          print("📤 Headers: ${options.headers}");
          print("📤 Body: ${options.data}");

          handler.next(options);
        },

        onResponse: (response, handler) async {
          print("📥 Response: ${response.data}");

          await _saveTokens(response);

          handler.next(response);
        },

        onError: (error, handler) {
          print("❌ Error: ${error.message}");
          handler.next(error);
        },
      ),
    );
  }

  // ================== REQUESTS ==================

  Future<dynamic> get(String endpoint) async {
    final res = await dio.get(endpoint);
    return res.data;
  }

  Future<dynamic> post(String endpoint, dynamic data) async {
    final res = await dio.post(
      endpoint,
      data: data,
      options: Options(
        contentType: data is FormData
            ? "multipart/form-data"
            : "application/json",
      ),
    );
    return res.data;
  }

  Future<dynamic> patch(String endpoint, dynamic data) async {
    final res = await dio.patch(endpoint, data: data);
    return res.data;
  }

  Future<dynamic> delete(String endpoint) async {
    final res = await dio.delete(endpoint);
    return res.data;
  }

  // ================== TOKEN ==================

  Future<void> _saveTokens(Response response) async {
    final cookies = response.headers.map['set-cookie'];

    if (cookies == null) return;

    for (var cookie in cookies) {
      // 🔥 access token
      if (cookie.contains("jwt=")) {
        final token = cookie.split(";").first.split("=").last;

        await SharedPref().setString(PrefKeys.accessToken, token);

        print("✅ Access Token saved");
      }

      // 🔥 refresh token
      if (cookie.contains("refreshToken=")) {
        final token = cookie.split(";").first.split("=").last;

        await SharedPref().setString(PrefKeys.refreshToken, token);

        print("✅ Refresh Token saved");
      }
    }
  }
}
