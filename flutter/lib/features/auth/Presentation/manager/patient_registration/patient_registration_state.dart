class PatientRegistrationState {
  final String? bloodType;
  final double? height;
  final double? weight;

  final List<String> selectedConditions;
  final List<String> selectedAllergies;

  PatientRegistrationState({
    this.bloodType,
    this.height,
    this.weight,
    this.selectedConditions = const [],
    this.selectedAllergies = const [],
  });

  PatientRegistrationState copyWith({
    String? bloodType,
    double? height,
    double? weight,
    List<String>? selectedConditions,
    List<String>? selectedAllergies,
  }) {
    return PatientRegistrationState(
      bloodType: bloodType ?? this.bloodType,
      height: height ?? this.height,
      weight: weight ?? this.weight,
      selectedConditions: selectedConditions ?? this.selectedConditions,
      selectedAllergies: selectedAllergies ?? this.selectedAllergies,
    );
  }
}
