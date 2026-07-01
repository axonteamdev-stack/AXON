import 'package:Axon/features/notifications/domain/entities/notification_entity.dart';

abstract class NotificationRepository {
  Future<List<NotificationEntity>> getNotifications();

  Future<int> getUnreadCount();

  Future<void> markAllAsRead();
}