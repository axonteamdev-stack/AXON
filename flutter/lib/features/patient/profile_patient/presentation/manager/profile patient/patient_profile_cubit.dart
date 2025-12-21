import 'package:flutter_bloc/flutter_bloc.dart';

class PatientProfileState {
  final String name;
  final String email;
  final String image;
  final double weight;
  final int age;
  final double height;

  PatientProfileState({
    required this.name,
    required this.email,
    required this.image,
    required this.weight,
    required this.age,
    required this.height,
  });

  PatientProfileState copyWith({
    String? name,
    String? email,
    String? image,
    double? weight,
    int? age,
    double? height,
  }) {
    return PatientProfileState(
      name: name ?? this.name,
      email: email ?? this.email,
      image: image ?? this.image,
      weight: weight ?? this.weight,
      age: age ?? this.age,
      height: height ?? this.height,
    );
  }
}

class PatientProfileCubit extends Cubit<PatientProfileState> {
  PatientProfileCubit()
      : super(
          PatientProfileState(
            name: 'Abdalulah Hassan',
            email: 'body@example.com',
            image: '',
            weight: 75,
            age: 28,
            height: 165,
          ),
        );

  void updateProfile(PatientProfileState state) {
    emit(state);
  }
}
