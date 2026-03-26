import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

@lazySingleton
class GenderCubit extends Cubit<int> {
  GenderCubit() : super(0); 

  void changeGender(int index) {
    emit(index);
  }

  String get genderValue {
    return state == 0 ? "Male" : "Female";
  }
}