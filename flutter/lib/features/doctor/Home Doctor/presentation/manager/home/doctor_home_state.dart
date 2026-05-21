part of 'doctor_home_cubit.dart';

enum DoctorHomeTab {

  chats,

  requests,
}

abstract class DoctorHomeState {}

class DoctorHomeInitial
    extends DoctorHomeState {}

class DoctorHomeLoading
    extends DoctorHomeState {}

class DoctorHomeSuccess
    extends DoctorHomeState {

  final DoctorHomeTab currentTab;

  final List<ChatPatient>
      chatPatients;

  final List<
      PendingRequestEntity>
  requestPatients;

  DoctorHomeSuccess({

    required this.currentTab,

    required this.chatPatients,

    required this.requestPatients,
  });

  DoctorHomeSuccess copyWith({

    DoctorHomeTab? currentTab,

    List<ChatPatient>?
        chatPatients,

    List<
            PendingRequestEntity>?
        requestPatients,
  }) {

    return DoctorHomeSuccess(

      currentTab:
          currentTab ??
              this.currentTab,

      chatPatients:
          chatPatients ??
              this.chatPatients,

      requestPatients:
          requestPatients ??
              this.requestPatients,
    );
  }
}

class DoctorHomeError
    extends DoctorHomeState {

  final Failure failure;

  DoctorHomeError({
    required this.failure,
  });
}