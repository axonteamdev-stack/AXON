class DrugInteractionEntity {
  final String riskLevel;
  final String recommendation;
  final double confidence;
  final bool hasInteraction;

  const DrugInteractionEntity({
    required this.riskLevel,
    required this.recommendation,
    required this.confidence,
    required this.hasInteraction,
  });
}