import 'package:Axon/features/doctor/Articles%20Doctor/domain/entities/doctor_posts_entity.dart';
import 'package:Axon/features/patient/home_patient/data/models/article_model.dart';

class DoctorPostsModel extends DoctorPostsEntity {

  const DoctorPostsModel({
    required super.posts,
  });

  factory DoctorPostsModel.fromJson(
    Map<String, dynamic> json,
  ) {

    return DoctorPostsModel(

      posts: List<ArticleModel>.from(

        (json["data"]["posts"] as List).map(

          (e) => ArticleModel.fromJson(e),
        ),
      ),
    );
  }
}