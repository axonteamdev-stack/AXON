import 'package:Axon/features/notifications/data/models/notification_model.dart';

abstract class NotificationRemoteDataSource {
  Future<List<NotificationModel>> getNotifications();

  Future<int> getUnreadCount();

  Future<void> markAllAsRead();
}