import 'package:Axon/features/notifications/data/datasource/notification_remote_data_source.dart';
import 'package:injectable/injectable.dart';

import '../../domain/entities/notification_entity.dart';
import '../../domain/repositories/notification_repository.dart';
@Injectable(as: NotificationRepository)
class NotificationRepositoryImpl
    implements NotificationRepository {
  final NotificationRemoteDataSource
      remoteDataSource;

  NotificationRepositoryImpl(
    this.remoteDataSource,
  );

  @override
  Future<List<NotificationEntity>>
      getNotifications() {
    return remoteDataSource
        .getNotifications();
  }

  @override
  Future<int> getUnreadCount() {
    return remoteDataSource
        .getUnreadCount();
  }

  @override
  Future<void> markAllAsRead() {
    return remoteDataSource.markAllAsRead();
  }
}