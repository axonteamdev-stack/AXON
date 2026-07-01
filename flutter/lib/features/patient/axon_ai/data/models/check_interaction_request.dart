class CheckInteractionRequest {
  final List<String> drugs;

  const CheckInteractionRequest({
    required this.drugs,
  });

  Map<String, dynamic> toJson() {
    return {
      "drugs": drugs,
    };
  }
}