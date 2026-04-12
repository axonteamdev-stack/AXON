import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/data/datasources/doctor_articles_remote_datasource.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/domain/entities/create_article_entity.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/domain/repo/doctor_articles_repo.dart';
import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

@Injectable(as: DoctorArticlesRepo)
class DoctorArticlesRepoImpl implements DoctorArticlesRepo {

  final DoctorArticlesRemoteDataSource remoteDataSource;

  DoctorArticlesRepoImpl(this.remoteDataSource);

  @override
  Future<Either<Failure, CreateArticleEntity>> createArticle({
    required String title,
    required String content,
    required String imagePath,
  }) {
    return remoteDataSource.createArticle(
      title: title,
      content: content,
      imagePath: imagePath,
    );
  }
}