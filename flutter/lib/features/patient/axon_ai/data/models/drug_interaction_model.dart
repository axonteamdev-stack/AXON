import '../../domain/entities/drug_interaction_entity.dart';

class DrugInteractionModel extends DrugInteractionEntity {
  const DrugInteractionModel({
    required super.riskLevel,
    required super.recommendation,
    required super.confidence,
    required super.hasInteraction,
  });

  factory DrugInteractionModel.fromJson(
    Map<String, dynamic> json,
  ) {
    final result = json['data']['result'];

    final riskLevel =
        result['riskLevel']?.toString() ?? '';

    return DrugInteractionModel(
      riskLevel: riskLevel,
      recommendation:
          result['recommendation'] ?? '',
      confidence:
          (result['confidence'] ?? 0)
              .toDouble(),
      hasInteraction:
          riskLevel.toLowerCase() != 'none',
    );
  }
}