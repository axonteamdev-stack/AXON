import 'package:flutter_bloc/flutter_bloc.dart';
import 'intake_time_state.dart';

class IntakeTimeCubit extends Cubit<IntakeTimeState> {
  IntakeTimeCubit()
      : super(const IntakeTimeState(hour: 8, minute: 30, isAm: true));

  void setPickedTime({
    required int hour,
    required int minute,
    required bool isAm,
  }) {
    emit(
      state.copyWith(
        hour: hour,
        minute: minute,
        isAm: isAm,
      ),
    );
  }

  void setAm() => emit(state.copyWith(isAm: true));
  void setPm() => emit(state.copyWith(isAm: false));
}
