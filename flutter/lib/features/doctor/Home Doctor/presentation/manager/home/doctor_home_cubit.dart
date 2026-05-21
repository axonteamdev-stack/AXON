import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/features/doctor/Home%20Doctor/data/models/chat_patient.dart';
import 'package:Axon/features/doctor/Home%20Doctor/domain/entities/pending_request_entity.dart';
import 'package:Axon/features/doctor/Home%20Doctor/domain/usecases/get_doctor_history_use_case.dart';
import 'package:Axon/features/doctor/Home%20Doctor/domain/usecases/get_pending_requests_use_case.dart';
import 'package:Axon/features/doctor/Home%20Doctor/domain/usecases/update_appointment_status_use_case.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

part 'doctor_home_state.dart';

@injectable
class DoctorHomeCubit
    extends Cubit<DoctorHomeState> {

  final GetPendingRequestsUseCase
      getPendingRequestsUseCase;

  final UpdateAppointmentStatusUseCase
      updateAppointmentStatusUseCase;

  final GetDoctorHistoryUseCase
      getDoctorHistoryUseCase;

  DoctorHomeCubit(

    this.getPendingRequestsUseCase,

    this.updateAppointmentStatusUseCase,

    this.getDoctorHistoryUseCase,

  ) : super(
          DoctorHomeInitial(),
        );

  DoctorHomeTab currentTab =
      DoctorHomeTab.chats;

  // ================= CHANGE TAB =================

  void changeTab(
    DoctorHomeTab tab,
  ) {

    currentTab = tab;

    if (state
        is DoctorHomeSuccess) {

      emit(

        (state
                as DoctorHomeSuccess)
            .copyWith(

          currentTab: tab,
        ),
      );
    }
  }

  // ================= LOAD HOME =================

  Future<void> loadDoctorHome()
      async {

    emit(
      DoctorHomeLoading(),
    );

    print(
      "=========== LOAD DOCTOR HOME ==========",
    );

    final pendingEither =
        await getPendingRequestsUseCase();

    final historyEither =
        await getDoctorHistoryUseCase();

    pendingEither.fold(

      (failure) {

        print(
          "=========== PENDING ERROR ==========",
        );

        print(failure);

        emit(
          DoctorHomeError(
            failure: failure,
          ),
        );
      },

      (requests) {

        historyEither.fold(

          (failure) {

            print(
              "=========== HISTORY ERROR ==========",
            );

            print(failure);

            emit(
              DoctorHomeError(
                failure: failure,
              ),
            );
          },

          (history) {

            print(
              "=========== HISTORY SUCCESS ==========",
            );

            print(
              "History Count => ${history.length}",
            );

            final chats =
                history.map(

              (e) {

                return ChatPatient(

                  name:
                      e.patientName,

                  description:
                      e.notes,

                  image:
                      e.patientImage ??
                          '',
                );
              },
            ).toList();

            emit(
              DoctorHomeSuccess(

                currentTab:
                    currentTab,

                requestPatients:
                    requests,

                chatPatients:
                    chats,
              ),
            );
          },
        );
      },
    );
  }

  // ================= ACCEPT REQUEST =================

  Future<void> acceptRequest({

    required String
        appointmentId,
  }) async {

    if (state
        is! DoctorHomeSuccess) {
      return;
    }

    print(
      "=========== ACCEPT REQUEST ==========",
    );

    print(
      "Appointment ID => $appointmentId",
    );

    final either =
        await updateAppointmentStatusUseCase(

      appointmentId:
          appointmentId,

      status:
          "accepted",
    );

    either.fold(

      (failure) {

        print(
          "=========== ACCEPT ERROR ==========",
        );

        print(failure);

        emit(
          DoctorHomeError(
            failure: failure,
          ),
        );
      },

      (_) async {

        print(
          "=========== ACCEPT SUCCESS ==========",
        );

        await loadDoctorHome();

        if (state
            is DoctorHomeSuccess) {

          emit(

            (state
                    as DoctorHomeSuccess)
                .copyWith(

              currentTab:
                  DoctorHomeTab
                      .chats,
            ),
          );
        }
      },
    );
  }

  // ================= REJECT REQUEST =================

  Future<void> rejectRequest({

    required String
        appointmentId,
  }) async {

    if (state
        is! DoctorHomeSuccess) {
      return;
    }

    print(
      "=========== REJECT REQUEST ==========",
    );

    print(
      "Appointment ID => $appointmentId",
    );

    final either =
        await updateAppointmentStatusUseCase(

      appointmentId:
          appointmentId,

      status:
          "rejected",
    );

    either.fold(

      (failure) {

        print(
          "=========== REJECT ERROR ==========",
        );

        print(failure);

        emit(
          DoctorHomeError(
            failure: failure,
          ),
        );
      },

      (_) async {

        print(
          "=========== REJECT SUCCESS ==========",
        );

        await loadDoctorHome();
      },
    );
  }

  // ================= REQUESTS COUNT =================

  int get requestsCount {

    if (state
        is DoctorHomeSuccess) {

      return (state
              as DoctorHomeSuccess)
          .requestPatients
          .length;
    }

    return 0;
  }
}