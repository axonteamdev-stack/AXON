import 'package:Axon/features/patient/qr_patient/domain/usecases/get_qr_patient_use_case.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import 'qr_patient_state.dart';

@injectable
class QrPatientCubit extends Cubit<QrPatientState> {
  final GetQrPatientUseCase getQrPatientUseCase;

  QrPatientCubit(this.getQrPatientUseCase)
      : super(QrPatientInitial());

  Future<void> getPatient(String patientId) async {
    emit(QrPatientLoading());

    try {
      final patient = await getQrPatientUseCase(patientId);

      emit(QrPatientSuccess(patient));
    } catch (e) {
      emit(QrPatientError(e.toString()));
    }
  }
}