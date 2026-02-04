import 'dart:convert';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:Axon/core/service/shared_pref/shared_pref.dart';
import 'package:Axon/features/patient/chat bot/data/models/chat_message_model.dart';
import 'package:Axon/features/patient/chat bot/data/repo/chat_bot_repo.dart';
import 'chat_bot_state.dart';

class ChatBotCubit extends Cubit<ChatBotState> {
  final ChatBotRepository repository;
  final List<ChatMessageModel> _messages = [];

  static const String _storageKey = 'chat_bot_messages';

  ChatBotCubit(this.repository) : super(ChatBotInitial()) {
    print('🟢 ChatBotCubit CREATED');
    _loadMessages();
  }

  List<ChatMessageModel> get messages =>
      List.unmodifiable(_messages);

  Future<void> _loadMessages() async {
    print('📂 Loading messages from SharedPreferences');

    try {
      final data =
          SharedPref.preferences.getString(_storageKey);

      print('📦 Raw stored data: $data');

      if (data != null && data.isNotEmpty) {
        final List decoded = jsonDecode(data);
        _messages.addAll(
          decoded
              .map((e) => ChatMessageModel.fromJson(e))
              .toList(),
        );
        print('✅ Loaded ${_messages.length} messages');
      }
    } catch (e) {
      print('❌ Error loading messages: $e');
    }

    if (_messages.isEmpty) {
      print('ℹ️ No messages found, adding welcome message');
      _messages.add(
        ChatMessageModel(
          message:
              '👋 Hi, I’m your AI medical assistant.\nAsk me anything about your health.',
          type: MessageType.bot,
        ),
      );
    }

    emit(ChatBotSuccess(List.from(_messages)));
  }

  /// ================= Save =================
  Future<void> _saveMessages() async {
    final encoded =
        jsonEncode(_messages.map((e) => e.toJson()).toList());

    print('💾 Saving messages: $encoded');

    await SharedPref.preferences.setString(
      _storageKey,
      encoded,
    );
  }

  /// ================= Send =================
  Future<void> sendMessage(String text) async {
    print('✉️ User sending message: $text');

    if (text.trim().isEmpty) {
      print('⚠️ Message is empty, ignored');
      return;
    }

    _messages.add(
      ChatMessageModel(
        message: text,
        type: MessageType.user,
      ),
    );

    await _saveMessages();

    emit(ChatBotLoading(List.from(_messages)));

    try {
      print('🤖 Calling repository.sendMessage');
      final reply = await repository.sendMessage(text);

      print('🤖 AI reply received: $reply');

      _messages.add(
        ChatMessageModel(
          message: reply,
          type: MessageType.bot,
        ),
      );
    } catch (e, s) {
      print('❌ ERROR while sending message');
      print('❌ Error: $e');
      print('📌 StackTrace: $s');

      _messages.add(
        ChatMessageModel(
          message:
              '⏳ The assistant is temporarily unavailable. Please try again in a moment.',
          type: MessageType.bot,
        ),
      );
    }

    await _saveMessages();
    emit(ChatBotSuccess(List.from(_messages)));
  }
}
