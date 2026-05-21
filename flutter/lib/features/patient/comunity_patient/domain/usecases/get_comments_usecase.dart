import 'package:Axon/features/patient/comunity_patient/data/repo/patient_community_repo_impl.dart';
import 'package:Axon/features/patient/comunity_patient/domain/entities/comments_entity.dart';
import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import 'package:Axon/core/errors/failures.dart';



@injectable
class GetCommentsUseCase {

  final PatientCommunityRepo
      repo;

  GetCommentsUseCase(
    this.repo,
  );

  Future<
      Either<
          Failure,
          CommentsEntity>>
  call({

    required String postId,
  }) async {

    return await repo.getComments(
      postId: postId,
    );
  }
}