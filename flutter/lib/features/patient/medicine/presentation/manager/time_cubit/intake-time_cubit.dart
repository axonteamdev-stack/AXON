import 'package:flutter_bloc/flutter_bloc.dart';
import 'intake_time_state.dart';

class IntakeTimeCubit extends Cubit<IntakeTimeState> {
  IntakeTimeCubit()
      : super(const IntakeTimeState(hour: 8, minute: 30, isAm: true));

  // HOUR
  void increaseHour() {
    emit(state.copyWith(hour: state.hour == 12 ? 1 : state.hour + 1));
  }

  void decreaseHour() {
    emit(state.copyWith(hour: state.hour == 1 ? 12 : state.hour - 1));
  }

  // MINUTE (step = 5)
  void increaseMinute() {
    emit(state.copyWith(minute: (state.minute + 5) % 60));
  }

  void decreaseMinute() {
    emit(state.copyWith(minute: state.minute == 0 ? 55 : state.minute - 5));
  }

  // AM / PM
  void setAm() => emit(state.copyWith(isAm: true));
  void setPm() => emit(state.copyWith(isAm: false));
}
