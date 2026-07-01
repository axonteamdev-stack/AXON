import 'package:injectable/injectable.dart';

import '../../data/models/ask_question_request.dart';
import '../entities/chat_response_entity.dart';
import '../repository/chat_bot_repository.dart';

@injectable
class AskQuestionUseCase {
  final ChatBotRepository repository;

  AskQuestionUseCase(
    this.repository,
  );

  Future<ChatResponseEntity> call(
    AskQuestionRequest request,
  ) {
    return repository.askQuestion(
      request,
    );
  }
}