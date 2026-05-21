import 'package:Axon/features/patient/home_patient/data/models/article_model.dart';
import 'package:Axon/features/patient/home_patient/domain/entities/get_all_articales__entity.dart';

class GetAllArticlesModel
    extends GetAllArticlesEntity {

  GetAllArticlesModel({

    required super.status,

    required super.message,

    required super.articles,
  });

  factory GetAllArticlesModel.fromJson(
    Map<String, dynamic> json,
  ) {

    return GetAllArticlesModel(

      status:
          json["success"]
                  .toString(),

      message:
          json["message"]
                  ?.toString() ??
              '',

      articles:

          json["data"] != null &&
                  json["data"]["posts"] !=
                      null

              ? List<ArticleModel>.from(

                  (json["data"]["posts"]
                          as List)

                      .map(

                        (e) =>
                            ArticleModel
                                .fromJson(e),
                      ),
                )

              : [],
    );
  }
}