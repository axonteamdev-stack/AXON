
import 'package:Axon/features/patient/comunity_patient/domain/entities/comments_entity.dart';

import 'comment_model.dart';

class CommentsModel
    extends CommentsEntity {

  CommentsModel({
    required super.comments,
  });

  factory CommentsModel.fromJson(
    Map<String, dynamic> json,
  ) {

    return CommentsModel(

      comments:
          List<CommentModel>.from(

        (json["data"]["comments"]
                as List)
            .map(

          (e) =>
              CommentModel
                  .fromJson(e),
        ),
      ),
    );
  }
}