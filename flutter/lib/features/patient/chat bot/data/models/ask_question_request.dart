class AskQuestionRequest {
  final String message;
  final String conversationId;

  const AskQuestionRequest({
    required this.message,
    required this.conversationId,
  });

  Map<String, dynamic> toJson() {
    return {
      "message": message,
      "conversationId": conversationId,
    };
  }
}