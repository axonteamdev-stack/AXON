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
    required this.reviews, required this.about,
    

  });
}
