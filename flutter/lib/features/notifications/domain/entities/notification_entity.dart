class NotificationEntity {
  final String id;
  final String title;
  final String message;
  final bool read;
  final String type;
  final String priority;
  final DateTime createdAt;

  NotificationEntity({
    required this.id,
    required this.title,
    required this.message,
    required this.read,
    required this.type,
    required this.priority,
    required this.createdAt,
  });
}