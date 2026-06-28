import 'dart:convert';
import 'doctor_review_model.dart';

class DoctorModel {
  final String id;
  final String name;
  final String specialty;
  final String image;
  final double price;
  final int yearsOfExperience;
  final List<DoctorReviewModel> reviews;
  final String about;

  DoctorModel({
    required this.id,
    required this.name,
    required this.specialty,
    required this.image,
    required this.price,
    required this.yearsOfExperience,
    required this.reviews,
    required this.about,
  });

  factory DoctorModel.fromJson(Map<String, dynamic> json) {
    final profile = json['doctorProfile'] as Map<String, dynamic>?;
    return DoctorModel(
      id: json['id']?.toString() ?? '',
      name: json['fullName']?.toString() ?? '',
      specialty: profile?['specialization']?.toString() ?? 'General',
      image: json['personalPhoto']?.toString() ?? '',
      price: (profile?['price'] as num?)?.toDouble() ?? 0.0,
      yearsOfExperience: (profile?['yearsExperience'] as num?)?.toInt() ?? 0,
      reviews: [],
      about: profile?['about']?.toString() ?? '',
    );
  }
}
