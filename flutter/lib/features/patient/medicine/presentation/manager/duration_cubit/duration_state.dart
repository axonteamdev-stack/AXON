class DurationState {
  final DateTime startDate;
  final DateTime? endDate;
  final String? error;

  const DurationState({
    required this.startDate,
    this.endDate,
    this.error,
  });

  DurationState copyWith({
    DateTime? startDate,
    DateTime? endDate,
    String? error,
  }) {
    return DurationState(
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      error: error,
    );
  }
}
