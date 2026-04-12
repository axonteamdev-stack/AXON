import 'package:Axon/features/patient/home_patient/data/models/doctor_response_model.dart';

class ArticleEntity {
  final String id;
  final DoctorResponseModel? doctor;
  final String title;
  final String content;
  final String image;
  final DateTime createdAt;
  final DateTime updatedAt;

  const ArticleEntity({
    required this.id,
    this.doctor,
    required this.title,
    required this.content,
    required this.image,
    required this.createdAt,
    required this.updatedAt,
  });
}