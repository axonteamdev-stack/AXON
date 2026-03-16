import 'package:Axon/features/patient/book_doctor/data/repo/doctor_repository.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../data/models/doctor_model.dart';
import 'doctors_state.dart';

class DoctorsCubit extends Cubit<DoctorsState> {
  final DoctorRepository repository;

  DoctorsCubit(this.repository) : super(DoctorsInitial()) {
    loadDoctors();
  }

  late final List<DoctorModel> _allDoctors;
  String _currentCategory = 'All';
  String _searchQuery = '';

  void loadDoctors() {
    _allDoctors = repository.getDoctors();
    _emitFiltered();
  }

  void filterBySpecialty(String specialty) {
    _currentCategory = specialty;
    _emitFiltered();
  }

  void searchDoctors(String query) {
    _searchQuery = query.toLowerCase();
    _emitFiltered();
  }

  void _emitFiltered() {
    List<DoctorModel> result = _allDoctors;

    if (_currentCategory != 'All') {
      result =
          result.where((d) => d.specialty == _currentCategory).toList();
    }

    if (_searchQuery.isNotEmpty) {
      result = result.where((d) {
        return d.name.toLowerCase().contains(_searchQuery) ||
            d.specialty.toLowerCase().contains(_searchQuery);
      }).toList();
    }

    emit(
      DoctorsLoaded(
        allDoctors: _allDoctors,
        filteredDoctors: result,
      ),
    );
  }
}
