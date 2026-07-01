import 'package:injectable/injectable.dart';

import '../entities/notification_entity.dart';
import '../repositories/notification_repository.dart';

@injectable
class GetNotificationsUseCase {
  final NotificationRepository repository;

  GetNotificationsUseCase(
    this.repository,
  );

  Future<List<NotificationEntity>>
      call() {
    return repository.getNotifications();
  }
}