import 'package:equatable/equatable.dart';

class MedicineFilterState extends Equatable {
  final String search;
  final DateTime? date;

  const MedicineFilterState({
    this.search = '',
    this.date,
  });

  MedicineFilterState copyWith({
    String? search,
    DateTime? date,
  }) {
    return MedicineFilterState(
      search: search ?? this.search,
      date: date ?? this.date,
    );
  }

  @override
  List<Object?> get props => [search, date];
}
