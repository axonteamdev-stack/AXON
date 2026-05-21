import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/features/doctor/Home%20Doctor/data/models/chat_patient.dart';
import 'package:Axon/features/doctor/Home%20Doctor/domain/entities/pending_request_entity.dart';
import 'package:Axon/features/doctor/Home%20Doctor/domain/usecases/get_pending_requests_use_case.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

part 'doctor_home_state.dart';

@injectable
class DoctorHomeCubit
    extends Cubit<DoctorHomeState> {

  final GetPendingRequestsUseCase
      getPendingRequestsUseCase;

  DoctorHomeCubit(
    this.getPendingRequestsUseCase,
  ) : super(
          DoctorHomeInitial(),
        );

  DoctorHomeTab currentTab =
      DoctorHomeTab.chats;

  List<ChatPatient>
      chatPatients = [

    ChatPatient(
      name:
          'Abdallah Hassan',

      description:
          'Back pain and spinal discomfort',

      image:
          AppImages.onboarding3,
    ),

    ChatPatient(
      name:
          'SS Mohamed',

      description:
          'Chronic neck pain',

      image:
          AppImages.onboarding2,
    ),

    ChatPatient(
      name:
          'Seif Ragab',

      description:
          'Lower back stiffness',

      image:
          AppImages.onboarding1,
    ),
  ];

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

  Future<void> loadDoctorHome()
      async {

    emit(
      DoctorHomeLoading(),
    );

    final either =
        await getPendingRequestsUseCase();

    either.fold(

      (failure) {

        emit(
          DoctorHomeError(
            failure: failure,
          ),
        );
      },

      (requests) {

        emit(
          DoctorHomeSuccess(

            currentTab:
                currentTab,

            chatPatients:
                chatPatients,

            requestPatients:
                requests,
          ),
        );
      },
    );
  }

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