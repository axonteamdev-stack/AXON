class PendingRequestEntity {

  final String id;

  final String patientName;

  final String? patientImage;

  final String notes;

  final String status;

  PendingRequestEntity({
    required this.id,
    required this.patientName,
    required this.patientImage,
    required this.notes,
    required this.status,
  });
}