part of 'doctor_home_cubit.dart';

enum DoctorHomeTab { chats, requests }

enum DoctorHomeStatus {
  initial,
  loading,
  success,
  error,
}

class DoctorHomeState {
  final DoctorHomeTab currentTab;
  final DoctorHomeStatus status;
  final List<dynamic> chatPatients;
  final List<dynamic> requestPatients;
  final String? errorMessage;

  const DoctorHomeState({
    required this.currentTab,
    required this.status,
    required this.chatPatients,
    required this.requestPatients,
    this.errorMessage,
  });

  factory DoctorHomeState.initial() {
    return const DoctorHomeState(
      currentTab: DoctorHomeTab.chats,
      status: DoctorHomeStatus.initial,
      chatPatients: [],
      requestPatients: [],
    );
  }

  DoctorHomeState copyWith({
    DoctorHomeTab? currentTab,
    DoctorHomeStatus? status,
    List<dynamic>? chatPatients,
    List<dynamic>? requestPatients,
    String? errorMessage,
  }) {
    return DoctorHomeState(
      currentTab: currentTab ?? this.currentTab,
      status: status ?? this.status,
      chatPatients: chatPatients ?? this.chatPatients,
      requestPatients: requestPatients ?? this.requestPatients,
      errorMessage: errorMessage,
    );
  }
}
