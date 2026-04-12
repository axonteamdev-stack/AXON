import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/patient/home_patient/domain/entities/get_all_articales__entity.dart';
import 'package:dartz/dartz.dart';

abstract class HomeRemoteDataSource {
  Future<Either<Failure, GetAllArticlesEntity>> getAllArticles();
 
}