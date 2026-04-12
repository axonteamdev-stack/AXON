import 'package:Axon/features/doctor/Articles%20Doctor/domain/entities/create_article_entity.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/domain/repo/doctor_articles_repo.dart';
import 'package:dartz/dartz.dart';
import 'package:Axon/core/errors/failures.dart';
import 'package:injectable/injectable.dart';

@injectable
class CreateArticleUseCase {

  final DoctorArticlesRepo repo;

  CreateArticleUseCase(this.repo);

  Future<Either<Failure, CreateArticleEntity>> call({
    required String title,
    required String content,
    required String imagePath,
  }) {
    return repo.createArticle(
      title: title,
      content: content,
      imagePath: imagePath,
    );
  }
}