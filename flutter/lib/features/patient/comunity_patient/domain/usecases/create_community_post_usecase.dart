import 'package:Axon/features/patient/comunity_patient/data/repo/patient_community_repo_impl.dart';
import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';

import 'package:Axon/core/errors/failures.dart';



@injectable
class CreateCommunityPostUseCase {

  final PatientCommunityRepo
      repo;

  CreateCommunityPostUseCase(
    this.repo,
  );

  Future<
      Either<
          Failure,
          void>>
  call({

    required String title,

    required String content,

    String? imagePath,
  }) async {

    return await repo.createPost(

      title: title,

      content: content,

      imagePath: imagePath,
    );
  }
}