abstract class ChatBotState {}

class ChatBotInitial
    extends ChatBotState {}

class ChatBotLoading
    extends ChatBotState {}

class ChatBotSuccess
    extends ChatBotState {}

class ChatBotError
    extends ChatBotState {
  final String message;

  ChatBotError(this.message);
}