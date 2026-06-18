import 'package:Axon/features/patient/medicine/domain/usecases/get_medicine_usecase.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/get_medicine.dart/medicine_list_state.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

@injectable
class MedicineListCubit extends Cubit<MedicineListState> {
  final GetMedicinesUseCase getMedicinesUseCase;

  MedicineListCubit({required this.getMedicinesUseCase})
    : super(MedicineListInitial());

  Future<void> getMedicines() async {
    print("========== GET MEDICINES START ==========");

    emit(MedicineListLoading());

    final result = await getMedicinesUseCase.call();

    result.fold(
      (failure) {
        print("GET MEDICINES FAILED ❌");
        print("Failure => $failure");

        emit(MedicineListError(failure: failure));
      },
      (response) {
        print("GET MEDICINES SUCCESS ✅");
        print("Medicines Count => ${response.data.medications.length}");

        emit(MedicineListSuccess(medicines: response.data.medications));
      },
    );

    print("========== GET MEDICINES END ==========");
  }
}
