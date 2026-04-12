import 'package:Axon/core/errors/error_handler.dart';
import 'package:Axon/core/errors/exceptions.dart';
import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/core/errors/mappers/exception_to_failure_mapper.dart';
import 'package:Axon/core/network/api_manager.dart';
import 'package:Axon/core/network/endpoints.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/data/datasources/doctor_articles_remote_datasource.dart';
import 'package:dartz/dartz.dart';
import 'package:dio/dio.dart';
import 'package:injectable/injectable.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/data/models/create_article_model.dart';


@Injectable(as: DoctorArticlesRemoteDataSource)
class DoctorArticlesRemoteDataSourceImpl
    implements DoctorArticlesRemoteDataSource {

  final ApiManager apiManager;

  DoctorArticlesRemoteDataSourceImpl({required this.apiManager});

  @override
  Future<Either<Failure, CreateArticleModel>> createArticle({
    required String title,
    required String content,
    required String imagePath,
  }) async {

    try {

      print("=========== CREATE ARTICLE REQUEST ===========");

      print("Title: $title");
      print("Content: $content");
      print("Image Path: $imagePath");

      FormData formData = FormData.fromMap({
        "title": title,
        "content": content,
        "postImage": await MultipartFile.fromFile(imagePath),
      });

      /// print form data fields
      print("Fields:");
      for (var field in formData.fields) {
        print("${field.key}: ${field.value}");
      }

      /// print files
      print("Files:");
      for (var file in formData.files) {
        print("${file.key}: ${file.value.filename}");
      }

      print("=============================================");

      final response = await apiManager.post(
        Endpoints.createArticle,
        formData,
      );

      print("=========== CREATE ARTICLE RESPONSE ===========");
      print(response);
      print("===============================================");

      final article = CreateArticleModel.fromJson(response);

      print("=========== ARTICLE PARSED SUCCESSFULLY ==========");
      print("Status: ${article.status}");
      print("Message: ${article.message}");
      print("Article ID: ${article.article.id}");
      print("==================================================");

      return Right(article);

    } on DioException catch (e) {

      print("=========== CREATE ARTICLE ERROR (DIO) ==========");
      print("Message: ${e.message}");
      print("Response: ${e.response?.data}");
      print("=================================================");

      return Left(mapExceptionToFailure(ErrorHandler.handle(e)));

    } on AppException catch (e) {

      print("=========== CREATE ARTICLE ERROR (APP) ==========");
      print(e);
      print("=================================================");

      return Left(mapExceptionToFailure(e));

    } catch (e) {

      print("=========== CREATE ARTICLE UNKNOWN ERROR =========");
      print(e);
      print("=================================================");

      return Left(ServerFailure());
    }
  }
}