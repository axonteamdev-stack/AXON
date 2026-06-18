import 'package:Axon/features/patient/home_patient/domain/useCases/pending_use_case.dart';
import 'package:Axon/features/patient/home_patient/domain/useCases/mark_dose_as_taken_use_case.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/medicine_take/pending_doses_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

@injectable
class PendingDosesCubit extends Cubit<PendingDosesState> {
  final GetPendingDosesUseCase getPendingDosesUseCase;
  final MarkDoseAsTakenUseCase markDoseAsTakenUseCase;

  PendingDosesCubit(
    this.getPendingDosesUseCase,
    this.markDoseAsTakenUseCase,
  ) : super(PendingDosesInitial());

  Future<void> getPendingDoses() async {
    emit(PendingDosesLoading());

    try {
      final result = await getPendingDosesUseCase();
      emit(PendingDosesSuccess(result));
    } catch (e) {
      emit(PendingDosesError(e.toString()));
    }
  }

  Future<void> markDoseAsTaken({
    required String medicationId,
    required String time,
  }) async {
    try {
      await markDoseAsTakenUseCase(
        medicationId: medicationId,
        time: time,
      );

      // بعد النجاح أعد تحميل الجرعات
      await getPendingDoses();
    } catch (e) {
      emit(PendingDosesError(e.toString()));
    }
  }
}