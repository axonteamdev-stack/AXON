import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class PatientEditBasicInfoCubit extends Cubit<bool> {
  PatientEditBasicInfoCubit() : super(false);

  final nameCtrl = TextEditingController(text: 'Abdallah Hassan');
  final emailCtrl = TextEditingController(text: 'Abdallah@gmail.com');
  final phoneCtrl = TextEditingController(text: '01012345678');

  final heightCtrl = TextEditingController(text: '175');
  final weightCtrl = TextEditingController(text: '72');

  void toggleEdit() => emit(!state);

  void save() {
    
    toggleEdit();
  }
}
