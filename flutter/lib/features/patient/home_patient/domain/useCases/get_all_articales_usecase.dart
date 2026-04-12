
import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/patient/home_patient/domain/entities/get_all_articales__entity.dart';
import 'package:Axon/features/patient/home_patient/domain/repo/home_repo.dart';
import 'package:dartz/dartz.dart';
import 'package:injectable/injectable.dart';
@injectable
class GetAllArticlesUseCase {
  final HomeRepo repo;

  GetAllArticlesUseCase(this.repo);

 Future<Either<Failure, GetAllArticlesEntity>> call() {
    return repo.getAllArticles();
  }
} 