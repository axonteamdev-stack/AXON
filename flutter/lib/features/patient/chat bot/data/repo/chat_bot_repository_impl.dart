import 'package:injectable/injectable.dart';

import '../../domain/entities/chat_response_entity.dart';
import '../../domain/repository/chat_bot_repository.dart';
import '../data_sources/chat_bot_remote_data_source.dart';
import '../models/ask_question_request.dart';

@Injectable(
  as: ChatBotRepository,
)
class ChatBotRepositoryImpl
    implements ChatBotRepository {
  final ChatBotRemoteDataSource remote;

  ChatBotRepositoryImpl(
    this.remote,
  );

  @override
  Future<ChatResponseEntity> askQuestion(
    AskQuestionRequest request,
  ) {
    return remote.askQuestion(
      request,
    );
  }
}