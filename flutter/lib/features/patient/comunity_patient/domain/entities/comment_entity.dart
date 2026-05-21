class CommentEntity {

  final String id;

  final String content;

  final String authorName;

  final String? authorImage;

  final DateTime createdAt;

  const CommentEntity({

    required this.id,

    required this.content,

    required this.authorName,

    required this.authorImage,

    required this.createdAt,
  });
}