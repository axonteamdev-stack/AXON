import 'package:Axon/features/notifications/domain/entities/notification_entity.dart';

class NotificationModel extends NotificationEntity {
  NotificationModel({
    required super.id,
    required super.title,
    required super.message,
    required super.read,
    required super.type,
    required super.priority,
    required super.createdAt,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['_id'],
      title: json['title'],
      message: json['message'],
      read: json['read'],
      type: json['type'],
      priority: json['priority'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}