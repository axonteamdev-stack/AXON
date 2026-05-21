import '../../domain/entities/pending_request_entity.dart';

class PendingRequestModel
    extends PendingRequestEntity {

  PendingRequestModel({
    required super.id,
    required super.patientName,
    required super.patientImage,
    required super.notes,
    required super.status,
  });

  factory PendingRequestModel.fromJson(
    Map<String, dynamic> json,
  ) {

    return PendingRequestModel(
      id: json['_id'],

      patientName:
          json['patient']['fullName'] ??
              '',

      patientImage:
          json['patient']['personalPhoto'],

      notes:
          json['notes'] ?? '',

      status:
          json['status'] ?? '',
    );
  }
}