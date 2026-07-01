import 'package:injectable/injectable.dart';

import '../repositories/notification_repository.dart';

@injectable
class GetUnreadCountUseCase {
  final NotificationRepository repository;

  GetUnreadCountUseCase(
    this.repository,
  );

  Future<int> call() {
    return repository.getUnreadCount();
  }
}