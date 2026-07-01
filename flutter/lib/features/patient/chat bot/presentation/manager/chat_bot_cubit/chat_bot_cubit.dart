import 'package:Axon/features/patient/chat%20bot/data/models/ask_question_request.dart';
import 'package:Axon/features/patient/chat%20bot/data/models/chat_message_model.dart';
import 'package:Axon/features/patient/chat%20bot/domain/use_cases/ask_question_use_case.dart';
import 'package:Axon/features/patient/chat%20bot/presentation/manager/chat_bot_cubit/chat_bot_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

@injectable
class ChatBotCubit
    extends Cubit<ChatBotState> {
  final AskQuestionUseCase useCase;

  ChatBotCubit(
    this.useCase,
  ) : super(ChatBotInitial());

  List<ChatMessageModel> messages = [
    ChatMessageModel(
      message:
          'Hello! I am Axon AI. How can I help you today?',
      type: MessageType.bot,
    ),
  ];

  String conversationId = '';

  Future<void> sendMessage(
    String text,
  ) async {
    messages.add(
      ChatMessageModel(
        message: text,
        type: MessageType.user,
      ),
    );

    emit(ChatBotLoading());

    try {
      final response =
          await useCase(
        AskQuestionRequest(
          message: text,
          conversationId:
              conversationId,
        ),
      );

      conversationId =
          response.conversationId;

      messages.add(
        ChatMessageModel(
          message: response.reply,
          type: MessageType.bot,
        ),
      );

      emit(ChatBotSuccess());
    } catch (e) {
      emit(
        ChatBotError(
          e.toString(),
        ),
      );
    }
  }
}