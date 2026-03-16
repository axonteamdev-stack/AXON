import 'package:flutter_bloc/flutter_bloc.dart';
import 'duration_state.dart';

class DurationCubit extends Cubit<DurationState> {
  DurationCubit()
      : super(
          DurationState(
            startDate: DateTime.now(),
            endDate: null,
            error: null,
          ),
        );

  void setStartDate(DateTime date) {
    // ❌ Prevent invalid start date
    if (state.endDate != null && date.isAfter(state.endDate!)) {
      emit(
        state.copyWith(
          error: "Start date cannot be after end date",
        ),
      );
      return;
    }

    emit(
      state.copyWith(
        startDate: date,
        error: null,
      ),
    );
  }

  void setEndDate(DateTime date) {
    // ❌ Prevent invalid end date
    if (date.isBefore(state.startDate)) {
      emit(
        state.copyWith(
          error: "End date cannot be before start date",
        ),
      );
      return;
    }

    emit(
      state.copyWith(
        endDate: date,
        error: null,
      ),
    );
  }
}
