class CommunityPostEntity {

  final String id;

  final String title;

  final String content;

  final String? image;

  final String type;

  final String authorName;

  final String? authorImage;

  final int commentsCount;

  final DateTime createdAt;

  final DateTime updatedAt;

  const CommunityPostEntity({

    required this.id,

    required this.title,

    required this.content,

    this.image,

    required this.type,

    required this.authorName,

    this.authorImage,

    required this.commentsCount,

    required this.createdAt,

    required this.updatedAt,
  });
}