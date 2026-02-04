import 'package:Axon/features/doctor/Reviews Doctor/data/models/patient_review_model.dart';

class DoctorReviewModel {
  final String name;
  final String image;
  final double rating;
  final String comment;

  DoctorReviewModel({
    required this.name,
    required this.image,
    required this.rating,
    required this.comment,
  });
}

extension DoctorReviewMapper on DoctorReviewModel {
  PatientReviewModel toPatientReview() {
    return PatientReviewModel(
      name: name,
      image: image,
      rating: rating,
      comment: comment,
    );
  }
}
