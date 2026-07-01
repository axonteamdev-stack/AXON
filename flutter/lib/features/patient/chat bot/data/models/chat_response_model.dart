import '../../domain/entities/chat_response_entity.dart';

class ChatResponseModel extends ChatResponseEntity {
  const ChatResponseModel({
    required super.reply,
    required super.conversationId,
  });

  factory ChatResponseModel.fromJson(
      Map<String, dynamic> json) {
    final data = json['data'];

    return ChatResponseModel(
      reply: data['reply'] ?? '',
      conversationId:
          data['conversationId'] ?? '',
    );
  }
}