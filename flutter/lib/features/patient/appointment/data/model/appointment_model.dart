import '../../domain/entities/appointment_entity.dart';

class AppointmentModel extends AppointmentEntity {
  AppointmentModel({
    required super.appointmentId,
    required super.price,
  });

  factory AppointmentModel.fromJson(
    Map<String, dynamic> json,
  ) {
    return AppointmentModel(
      appointmentId: json['_id'],
      price: json['price'] ?? 0,
    );
  }
}