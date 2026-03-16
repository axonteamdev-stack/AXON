class PatientPostModel {
  final String id;
  final String title;
  final String content;
  final String? imagePath;

  bool isLiked;
  int likes;
  int shares;
  List<PostComment> comments;

  PatientPostModel({
    required this.id,
    required this.title,
    required this.content,
    this.imagePath,
    this.isLiked = false,
    this.likes = 0,
    this.shares = 0,
    List<PostComment>? comments,
  }) : comments = comments ?? [];

  int get commentsCount => comments.length;
}

class PostComment {
  final String id;
  final String text;
  bool isLiked;
  int likes;
  List<PostReply> replies;

  PostComment({
    required this.id,
    required this.text,
    this.isLiked = false,
    this.likes = 0,
    List<PostReply>? replies,
  }) : replies = replies ?? [];
}

class PostReply {
  final String id;
  final String text;
  bool isLiked;
  int likes;

  PostReply({
    required this.id,
    required this.text,
    this.isLiked = false,
    this.likes = 0,
  });
}
