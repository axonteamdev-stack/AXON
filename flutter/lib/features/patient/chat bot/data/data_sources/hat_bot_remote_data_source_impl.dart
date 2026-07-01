import 'package:injectable/injectable.dart';

import '../../../../../core/network/api_manager.dart';
import '../models/ask_question_request.dart';
import '../models/chat_response_model.dart';
import 'chat_bot_remote_data_source.dart';

@Injectable(
  as: ChatBotRemoteDataSource,
)
class ChatBotRemoteDataSourceImpl
    implements ChatBotRemoteDataSource {
  final ApiManager apiManager;

  ChatBotRemoteDataSourceImpl(
    this.apiManager,
  );

  @override
  Future<ChatResponseModel> askQuestion(
    AskQuestionRequest request,
  ) async {
    final response =
        await apiManager.dio.post(
      '/chatbot/ask',
      data: request.toJson(),
    );

    return ChatResponseModel.fromJson(
      response.data,
    );
  }
}