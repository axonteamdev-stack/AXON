
enum PatientProfileStatus {
  idle,
  loading,
  loggedOut,
  accountDeleted,
  error,
}

class PatientProfileState {
  final String name;
  final String email;
  final String image;
  final double weight;
  final int age;
  final double height;
  final PatientProfileStatus status;
  final String? errorMessage;

  PatientProfileState({
    required this.name,
    required this.email,
    required this.image,
    required this.weight,
    required this.age,
    required this.height,
    this.status = PatientProfileStatus.idle,
    this.errorMessage,
  });

  PatientProfileState copyWith({
    String? name,
    String? email,
    String? image,
    double? weight,
    int? age,
    double? height,
    PatientProfileStatus? status,
    String? errorMessage,
  }) {
    return PatientProfileState(
      name: name ?? this.name,
      email: email ?? this.email,
      image: image ?? this.image,
      weight: weight ?? this.weight,
      age: age ?? this.age,
      height: height ?? this.height,
      status: status ?? this.status,
      errorMessage: errorMessage,
    );
  }
}

