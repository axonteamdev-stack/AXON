class IntakeTimeState {
  final int hour;
  final int minute;
  final bool isAm;

  const IntakeTimeState({
    required this.hour,
    required this.minute,
    required this.isAm,
  });

  IntakeTimeState copyWith({
    int? hour,
    int? minute,
    bool? isAm,
  }) {
    return IntakeTimeState(
      hour: hour ?? this.hour,
      minute: minute ?? this.minute,
      isAm: isAm ?? this.isAm,
    );
  }
}
