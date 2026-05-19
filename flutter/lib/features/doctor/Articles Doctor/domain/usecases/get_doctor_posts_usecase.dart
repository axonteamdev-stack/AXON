import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/domain/entities/doctor_posts_entity.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/domain/repo/doctor_articles_repo.dart';
import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

@injectable
class GetDoctorPostsUseCase {

  final DoctorArticlesRepo repo;

  GetDoctorPostsUseCase(this.repo);

  Future<Either<Failure, DoctorPostsEntity>>
  call() {

    return repo.getDoctorPosts();
  }
}