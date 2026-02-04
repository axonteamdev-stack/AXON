import 'package:Axon/features/patient/chat%20bot/data/data_sources/chat_bot_remote_data_source.dart';
import 'package:Axon/features/patient/chat%20bot/data/repo/chat_bot_repo.dart';

class ChatBotRepositoryImpl implements ChatBotRepository {
  final ChatRemoteDataSource remoteDataSource;

  ChatBotRepositoryImpl(this.remoteDataSource);

  @override
  Future<String> sendMessage(String message) async {
    return await remoteDataSource.sendMessage(message);
  }
}
