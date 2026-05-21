import 'package:Axon/core/di/di.dart';
import 'package:Axon/core/errors/mappers/failure_to_message_mapper.dart';
import 'package:Axon/core/helpers/snackbar.dart';
import 'package:Axon/features/doctor/Home%20Doctor/presentation/manager/home/doctor_home_cubit.dart';
import 'package:Axon/features/doctor/Home%20Doctor/presentation/views/widgets/doctor_chat_card.dart';
import 'package:Axon/features/doctor/Home%20Doctor/presentation/views/widgets/doctor_home_header.dart';
import 'package:Axon/features/doctor/Home%20Doctor/presentation/views/widgets/doctor_home_tabs.dart';
import 'package:Axon/features/doctor/Home%20Doctor/presentation/views/widgets/doctor_request_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DoctorHomeView
    extends StatelessWidget {

  const DoctorHomeView({
    super.key,
  });

  @override
  Widget build(BuildContext context) {

    return BlocProvider(

      create:
          (_) =>
              getIt<
                  DoctorHomeCubit>()
                ..loadDoctorHome(),

      child:
          BlocConsumer<
              DoctorHomeCubit,
              DoctorHomeState>(

        listener:
            (
          context,
          state,
        ) {

          if (state
              is DoctorHomeError) {

            Snackbar.showError(

              context,

              message:
                  mapFailureToMessage(

                context,

                state.failure,
              ),
            );
          }
        },

        builder:
            (
          context,
          state,
        ) {

          if (state
              is DoctorHomeLoading) {

            return const Center(
              child:
                  CircularProgressIndicator(),
            );
          }

          if (state
              is DoctorHomeSuccess) {

            return SafeArea(

              child: Padding(

                padding:
                    EdgeInsets.all(
                  16.w,
                ),

                child: Column(

                  crossAxisAlignment:
                      CrossAxisAlignment
                          .start,

                  children: [

                    const DoctorHomeHeader(),

                    SizedBox(
                      height: 24.h,
                    ),

                    const DoctorHomeTabs(),

                    SizedBox(
                      height: 20.h,
                    ),

                    Expanded(

                      child:
                          RefreshIndicator(

                        onRefresh:
                            () async {

                          await context
                              .read<
                                  DoctorHomeCubit>()
                              .loadDoctorHome();
                        },

                        child:

                            state.currentTab ==
                                    DoctorHomeTab
                                        .requests

                                ? state
                                        .requestPatients
                                        .isEmpty

                                    ? ListView(
                                        children: [

                                          SizedBox(
                                            height:
                                                250.h,
                                          ),

                                          Center(
                                            child:
                                                Text(

                                              "No Requests Yet",

                                              style:
                                                  TextStyle(

                                                fontSize:
                                                    16.sp,

                                                fontWeight:
                                                    FontWeight
                                                        .w600,

                                                color:
                                                    Colors
                                                        .grey,
                                              ),
                                            ),
                                          ),
                                        ],
                                      )

                                    : ListView
                                        .separated(

                                        itemCount:
                                            state
                                                .requestPatients
                                                .length,

                                        separatorBuilder:
                                            (
                                          _,
                                          __,
                                        ) =>
                                                SizedBox(
                                          height:
                                              12.h,
                                        ),

                                        itemBuilder:
                                            (
                                          context,
                                          index,
                                        ) {

                                          final patient =
                                              state.requestPatients[
                                                  index];

                                          return DoctorRequestCard(

                                            appointmentId:
                                                patient.id,

                                            name:
                                                patient
                                                    .patientName,

                                            notes:
                                                patient
                                                    .notes,

                                            image:
                                                patient
                                                    .patientImage,

                                            onAccept:
                                                () {

                                              context
                                                  .read<
                                                      DoctorHomeCubit>()
                                                  .acceptRequest(

                                                    appointmentId:
                                                        patient.id,
                                                  );
                                            },

                                            onReject:
                                                () {

                                              context
                                                  .read<
                                                      DoctorHomeCubit>()
                                                  .rejectRequest(

                                                    appointmentId:
                                                        patient.id,
                                                  );
                                            },
                                          );
                                        },
                                      )

                                : state
                                        .chatPatients
                                        .isEmpty

                                    ? ListView(
                                        children: [

                                          SizedBox(
                                            height:
                                                250.h,
                                          ),

                                          Center(
                                            child:
                                                Text(

                                              "No Chats Yet",

                                              style:
                                                  TextStyle(

                                                fontSize:
                                                    16.sp,

                                                fontWeight:
                                                    FontWeight
                                                        .w600,

                                                color:
                                                    Colors
                                                        .grey,
                                              ),
                                            ),
                                          ),
                                        ],
                                      )

                                    : ListView
                                        .separated(

                                        itemCount:
                                            state
                                                .chatPatients
                                                .length,

                                        separatorBuilder:
                                            (
                                          _,
                                          __,
                                        ) =>
                                                SizedBox(
                                          height:
                                              12.h,
                                        ),

                                        itemBuilder:
                                            (
                                          _,
                                          index,
                                        ) {

                                          final patient =
                                              state.chatPatients[
                                                  index];

                                          return DoctorChatCard(

                                            name:
                                                patient
                                                    .name,

                                            description:
                                                patient
                                                    .description,

                                            image:
                                                patient
                                                    .image,
                                          );
                                        },
                                      ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }

          return const Center(
            child: Text(
              "Something went wrong",
            ),
          );
        },
      ),
    );
  }
}