import 'package:flutter_bloc/flutter_bloc.dart';

part 'select_role_state.dart';

class SelectRoleCubit extends Cubit<SelectRoleState> {
  SelectRoleCubit() : super(SelectRoleInitial());

  int selectedIndex = -1;

  void select(int index) {
    selectedIndex = index;
    emit(SelectRoleUpdated());
  }
}
