import 'package:Axon/features/patient/home_patient/domain/entities/article_entity.dart';

class DoctorPostsEntity {

  final List<ArticleEntity> posts;

  const DoctorPostsEntity({
    required this.posts,
  });
}