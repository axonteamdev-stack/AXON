
import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/patient/home_patient/domain/entities/article_details_entity.dart';
import 'package:Axon/features/patient/home_patient/domain/entities/get_all_articales__entity.dart';
import 'package:dartz/dartz.dart';


abstract class HomeRepo {
 Future<Either<Failure, GetAllArticlesEntity>> getAllArticles();
 Future<Either<Failure, ArticleDetailsEntity>>
    getArticleById(String id);

}