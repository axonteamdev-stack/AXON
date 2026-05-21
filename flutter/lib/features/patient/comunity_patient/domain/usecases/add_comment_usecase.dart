import 'package:Axon/features/patient/comunity_patient/data/repo/patient_community_repo_impl.dart';
import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import 'package:Axon/core/errors/failures.dart';


@injectable
class AddCommentUseCase {

  final PatientCommunityRepo
      repo;

  AddCommentUseCase(
    this.repo,
  );

  Future<
      Either<
          Failure,
          void>>
  call({

    required String postId,

    required String content,
  }) async {

    return await repo.addComment(

      postId: postId,

      content: content,
    );
  }
}