import '../../data/models/ask_question_request.dart';
import '../entities/chat_response_entity.dart';

abstract class ChatBotRepository {
  Future<ChatResponseEntity> askQuestion(
    AskQuestionRequest request,
  );
}