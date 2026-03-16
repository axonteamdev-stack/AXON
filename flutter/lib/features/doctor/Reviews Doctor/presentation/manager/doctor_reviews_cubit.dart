import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/features/doctor/Reviews%20Doctor/data/models/patient_review_model.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'doctor_reviews_state.dart';

class DoctorReviewsCubit extends Cubit<DoctorReviewsState> {
  DoctorReviewsCubit()
      : super(
          DoctorReviewsState(
            reviews: [
              PatientReviewModel(
                name: 'Ahmed Hassan',
                image: AppImages.onboarding1,
                rating: 4.5,
                comment: 'Doctor was very professional and helpful.',
              ),
              PatientReviewModel(
                name: 'ss Mohamed',
                image: AppImages.onboarding2,
                rating: 5,
                comment: 'Excellent experience, highly recommended.',
              ),
              PatientReviewModel(
                name: 'Omar Ali',
                image: AppImages.onboarding3,
                rating: 3.5,
                comment: 'Good doctor but waiting time was long.',
              ),
            ],
          ),
        );

  void loadReviewsFromApi() {}
}
