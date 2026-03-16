
import 'package:google_generative_ai/google_generative_ai.dart';

class ChatRemoteDataSource {
  /// 🔐 API KEY
  static const String _apiKey = 'AIzaSyCZ1Cm3p23UHx1yFXUAe_OyV5xsXMW2_3g';

  /// 🤖 MODEL NAME
  static const String _modelName = 'gemini-2.0-flash';

  late final GenerativeModel _model;

  ChatRemoteDataSource() {
    print('🟢 [DataSource] Initializing Gemini Model');
    print('🔑 API KEY: ${_apiKey.substring(0, 5)}*****');
    print('🤖 Model: $_modelName');

    _model = GenerativeModel(
      model: _modelName,
      apiKey: _apiKey,
    );
  }

  Future<String> sendMessage(String message) async {
    print('📤 [DataSource] sendMessage called');
    print('✉️ User message: $message');

    try {
      print('🚀 [Gemini] Sending request...');

      final response = await _model.generateContent([
        Content.text(
          '''
You are a professional AI medical assistant.
If the user writes in Arabic, reply in Arabic.
If the user writes in English, reply in English.
Give safe, general medical advice only.

User: $message
Assistant:
''',
        ),
      ]);

      print('📥 [Gemini] Response received');
      print('🧾 Raw response: $response');

      final text = response.text;

      if (text == null || text.isEmpty) {
        print('⚠️ [Gemini] Empty response text');
        return 'لم يتم توليد رد من Gemini.';
      }

      print('✅ [Gemini] Final reply: $text');
      return text.trim();
    } catch (e, stack) {
      print('❌ [Gemini] ERROR occurred');
      print('❌ Error: $e');
      print('📌 StackTrace: $stack');

      throw Exception('Gemini API Error');
    }
  }
}
