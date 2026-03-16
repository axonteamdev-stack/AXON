
import 'package:Axon/features/patient/chat%20bot/data/models/chat_message_model.dart';

abstract class ChatBotState {}

class ChatBotInitial extends ChatBotState {}

class ChatBotLoading extends ChatBotState {
  final List<ChatMessageModel> messages;
  ChatBotLoading(this.messages);
}

class ChatBotSuccess extends ChatBotState {
  final List<ChatMessageModel> messages;
  ChatBotSuccess(this.messages);
}

class ChatBotError extends ChatBotState {
  final String error;
  ChatBotError(this.error);
}
