class ArticleModel {
  final String id;
  final String title;
  final String image;

  const ArticleModel({
    required this.id,
    required this.title,
    required this.image,
  });

  factory ArticleModel.fromJson(Map<String, dynamic> json) {
    return ArticleModel(
      id: json['id'].toString(),
      title: json['title'] ?? '',
      image: json['image'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'image': image,
    };
  }
}
