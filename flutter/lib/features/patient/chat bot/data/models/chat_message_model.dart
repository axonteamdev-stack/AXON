enum MessageType { user, bot }

class ChatMessageModel {
  final String message;
  final MessageType type;

  ChatMessageModel({
    required this.message,
    required this.type,
  });

  Map<String, dynamic> toJson() => {
        'message': message,
        'type': type.name,
      };

  factory ChatMessageModel.fromJson(Map<String, dynamic> json) {
    return ChatMessageModel(
      message: json['message'],
      type: json['type'] == 'user'
          ? MessageType.user
          : MessageType.bot,
    );
  }
}
