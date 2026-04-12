import 'package:Axon/core/errors/error_handler.dart';
import 'package:Axon/core/errors/exceptions.dart';
import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/core/errors/mappers/exception_to_failure_mapper.dart';
import 'package:Axon/core/network/api_manager.dart';
import 'package:Axon/core/network/endpoints.dart';
import 'package:Axon/features/patient/home_patient/data/data_sources/home_remote_datasource.dart';
import 'package:Axon/features/patient/home_patient/data/models/get_all_articles_model.dart';
import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';

@Injectable(as: HomeRemoteDataSource)
class HomeRemoteDataSourceImpl implements HomeRemoteDataSource {
  final ApiManager apiManager;

  HomeRemoteDataSourceImpl({required this.apiManager});

  @override
  Future<Either<Failure, GetAllArticlesModel>> getAllArticles() async {
    try {
      final response = await apiManager.get(
        Endpoints.getAllArticales,
      );

      print("articles response: $response");

      final articles = GetAllArticlesModel.fromJson(response);

      return Right(articles);
    } on DioException catch (e) {
      print("articles error: ${e.response?.data}");
      return Left(mapExceptionToFailure(ErrorHandler.handle(e)));
    } on AppException catch (e) {
      return Left(mapExceptionToFailure(e));
    } catch (e) {
      print("unknown error: $e");
      return Left(ServerFailure());
    }
  }





}