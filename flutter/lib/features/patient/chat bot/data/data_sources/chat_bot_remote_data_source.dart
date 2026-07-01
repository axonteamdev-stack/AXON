import '../models/ask_question_request.dart';
import '../models/chat_response_model.dart';

abstract class ChatBotRemoteDataSource {
  Future<ChatResponseModel> askQuestion(
    AskQuestionRequest request,
  );
}