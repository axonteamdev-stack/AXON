import 'package:Axon/features/patient/book_doctor/domain/entities/doctor_entity.dart';
import 'package:Axon/features/patient/book_doctor/domain/useCases/get_all_doctors_usecase.dart';
import 'package:Axon/features/patient/book_doctor/domain/useCases/search_doctors_usecase.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'doctors_state.dart';

@injectable
class DoctorsCubit extends Cubit<DoctorsState> {
  final GetAllDoctorsUseCase getAllDoctorsUseCase;
  final SearchDoctorsUseCase searchDoctorsUseCase;

  DoctorsCubit({
    required this.getAllDoctorsUseCase,
    required this.searchDoctorsUseCase,
  }) : super(DoctorsInitial());

  List<DoctorEntity> _allDoctors = [];
  String _currentCategory = "All";

  Future<void> getAllDoctors() async {
    emit(DoctorsLoading());

    final result = await getAllDoctorsUseCase.invoke();

    result.fold(
      (failure) {
        print("get all doctors cubit error: $failure");

        emit(
          DoctorsError(
            failure: failure,
          ),
        );
      },
      (doctors) {
        print(
          "get all doctors cubit success: ${doctors.length}",
        );

        _allDoctors = doctors;

        emit(
          DoctorsSuccess(
            allDoctors: doctors,
            filteredDoctors: doctors,
          ),
        );
      },
    );
  }

  void filterBySpecialty(String specialty) {
    _currentCategory = specialty;

    List<DoctorEntity> result = _allDoctors;

    if (specialty != "All") {
      result = _allDoctors.where((doctor) {
        return (doctor.specialization ?? "")
            .toLowerCase()
            .contains(
              specialty.toLowerCase(),
            );
      }).toList();
    }

    emit(
      DoctorsSuccess(
        allDoctors: _allDoctors,
        filteredDoctors: result,
      ),
    );
  }

  Future<void> searchDoctors({
    required String keyword,
  }) async {
    emit(DoctorsLoading());

    final result = await searchDoctorsUseCase.invoke(
      keyword: keyword,
    );

    result.fold(
      (failure) {
        print(
          "search doctors cubit error: $failure",
        );

        emit(
          DoctorsError(
            failure: failure,
          ),
        );
      },
      (doctors) {
        print(
          "search doctors cubit success: ${doctors.length}",
        );

        emit(
          DoctorsSuccess(
            allDoctors: _allDoctors,
            filteredDoctors: doctors,
          ),
        );
      },
    );
  }
}