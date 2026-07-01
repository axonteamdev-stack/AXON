enum MessageType {
  user,
  bot,
}

class ChatMessageModel {
  final String message;
  final MessageType type;

  ChatMessageModel({
    required this.message,
    required this.type,
  });
}