import 'package:Axon/features/patient/comunity_patient/data/repo/patient_community_repo_impl.dart';
import 'package:Axon/features/patient/comunity_patient/domain/entities/community_posts_entity.dart';
import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import 'package:Axon/core/errors/failures.dart';


@injectable
class GetCommunityPostsUseCase {

  final PatientCommunityRepo
      repo;

  GetCommunityPostsUseCase(
    this.repo,
  );

  Future<
      Either<
          Failure,
          CommunityPostsEntity>>
  call() async {

    return await repo.getPosts();
  }
}