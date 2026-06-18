import 'package:Axon/core/service/shared_pref/shared_pref.dart';
import 'package:Axon/core/service/shared_pref/pref_keys.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:injectable/injectable.dart';
import 'endpoints.dart';

@singleton
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

          // 🔥 إضافة اللغة من SharedPref
          final lang = SharedPref().getString(PrefKeys.language) ?? "en";

          // 🔥 PRINT TOKEN قبل ما يتبعت
          print("🔑 [REQUEST] Current Token: $token");

          if (token != null && token.isNotEmpty) {
            options.headers["Authorization"] = "Bearer $token";
            print("✅ [REQUEST] Token added to header");
          } else {
            print("❌ [REQUEST] No token found");
          }

          // 🔥 إضافة اللغة في الهيدر
          options.headers["Accept-Language"] = lang;
          print("🌍 [REQUEST] Language added: $lang");

          print("📤 ${options.method} ${options.uri}");
          print("📤 Headers: ${options.headers}");
          print("📤 Body: ${options.data}");

          handler.next(options);
        },

        onResponse: (response, handler) async {
          print("📥 [RESPONSE] Data: ${response.data}");

          await _saveTokens(response);

          handler.next(response);
        },

        onError: (error, handler) async {
          print("❌ [ERROR] ${error.message}");

          // لو الـ Access Token انتهت صلاحيته
          if (error.response?.statusCode == 401) {
            print("🔄 Access token expired");

            final refreshToken = SharedPref().getString(PrefKeys.refreshToken);

            print("🔄 Refresh Token => $refreshToken");

            if (refreshToken != null && refreshToken.isNotEmpty) {
              try {
                // استدعاء API الخاص بتجديد التوكن
                final refreshResponse = await dio.post(
                  Endpoints.refreshToken,
                  options: Options(
                    headers: {"cookie": "refreshToken=$refreshToken"},
                  ),
                );

                print("✅ Token refreshed successfully");
                print("📥 Refresh Response: ${refreshResponse.data}");

                // ✅ القراءة الصحيحة من الـ Response
                final newAccessToken =
                    refreshResponse.data["data"]["accessToken"] as String;

                final newRefreshToken =
                    refreshResponse.data["data"]["refreshToken"] as String;

                // حفظ التوكنات الجديدة
                await SharedPref().setString(
                  PrefKeys.accessToken,
                  newAccessToken,
                );

                await SharedPref().setString(
                  PrefKeys.refreshToken,
                  newRefreshToken,
                );

                print("🆕 New Access Token => $newAccessToken");
                print("🆕 New Refresh Token => $newRefreshToken");

                // إعادة إرسال الطلب الأصلي
                final requestOptions = error.requestOptions;

                requestOptions.headers["Authorization"] =
                    "Bearer $newAccessToken";

                final clonedResponse = await dio.fetch(requestOptions);

                print("✅ Original request retried successfully");

                return handler.resolve(clonedResponse);
              } catch (e) {
                print("❌ Refresh token failed");
                print(e);

                // حذف التوكنات في حالة الفشل
                await SharedPref().removePreference(PrefKeys.accessToken);

                await SharedPref().removePreference(PrefKeys.refreshToken);
              }
            }
          }

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
    try {
      final data = response.data;

      if (data is Map<String, dynamic>) {
        final tokens = data["data"]?["tokens"];

        if (tokens != null) {
          final accessToken = tokens["accessToken"];
          final refreshToken = tokens["refreshToken"];

          if (accessToken != null) {
            await SharedPref().setString(PrefKeys.accessToken, accessToken);
          }

          if (refreshToken != null) {
            await SharedPref().setString(PrefKeys.refreshToken, refreshToken);
          }

          print("💾 Access Token Saved: $accessToken");
          print("💾 Refresh Token Saved: $refreshToken");
        }
      }
    } catch (e) {
      print("❌ Error saving tokens: $e");
    }
  }
}
