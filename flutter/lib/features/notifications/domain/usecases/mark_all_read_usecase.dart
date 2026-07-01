import 'package:injectable/injectable.dart';

import '../repositories/notification_repository.dart';

@injectable
class MarkAllReadUseCase {
  final NotificationRepository repository;

  MarkAllReadUseCase(
    this.repository,
  );

  Future<void> call() {
    return repository.markAllAsRead();
  }
}