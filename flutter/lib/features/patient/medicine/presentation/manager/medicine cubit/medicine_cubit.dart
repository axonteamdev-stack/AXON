import 'package:flutter_bloc/flutter_bloc.dart';

class MedicineCubit extends Cubit<List<Map<String, dynamic>>> {
  MedicineCubit() : super([]);

  void addMedicine(Map<String, dynamic> medicine) {
    emit([...state, medicine]);
  }

  void clear() {
    emit([]);
  }
}
