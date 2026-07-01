import '../../domain/entities/setup_intent_entity.dart';

class SetupIntentModel extends SetupIntentEntity {
  SetupIntentModel({
    required super.clientSecret,
    required super.setupIntentId,
  });

  factory SetupIntentModel.fromJson(
    Map<String, dynamic> json,
  ) {
    return SetupIntentModel(
      clientSecret: json['clientSecret'],
      setupIntentId: json['setupIntentId'],
    );
  }
}