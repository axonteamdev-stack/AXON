import 'package:Axon/core/di/di.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/features/notifications/presentation/manager/notification_cubit.dart';
import 'package:Axon/features/notifications/presentation/manager/notification_state.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/basc_info/profile_cubit.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/basc_info/profile_states.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/home/home_cubit.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/home/home_state.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/medicine_take/pending_doses_cubit.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/medicine_take/pending_doses_state.dart';
import 'package:Axon/features/patient/home_patient/presentation/views/widgets/home_header.dart';
import 'package:Axon/features/patient/home_patient/presentation/views/widgets/home_scrollable_content.dart';
import 'package:Axon/features/patient/medicine/presentation/view/add_medicine_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class HomeView extends StatelessWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (_) =>
              getIt<HomeCubit>()..fetchHomeArticles(),
        ),
        BlocProvider(
          create: (_) =>
              getIt<ProfileCubit>()..getProfile(),
        ),
        BlocProvider(
          create: (_) => getIt<PendingDosesCubit>()
            ..getPendingDoses(),
        ),
        BlocProvider(
          create: (_) => getIt<NotificationCubit>()
            ..getUnreadCount(),
        ),
      ],
      child: Scaffold(
        backgroundColor: AppColors.white,
        body: BlocBuilder<HomeCubit, HomeState>(
          builder: (context, homeState) {
            if (homeState is HomeLoading ||
                homeState is HomeInitial) {
              return const Center(
                child: CircularProgressIndicator(),
              );
            }

            if (homeState is HomeError) {
              return Center(
                child:
                    Text(homeState.failure.toString()),
              );
            }

            if (homeState is HomeSuccess) {
              final articles =
                  homeState.articlesEntity?.articles ??
                      [];

              return BlocBuilder<
                ProfileCubit,
                ProfileState
              >(
                builder: (context, profileState) {
                  String userName = "User";
                  String? userImage;

                  if (profileState
                      is ProfileSuccess) {
                    userName =
                        profileState.profile.fullName;
                    userImage = profileState
                        .profile.personalPhoto;
                  }

                  return Column(
                    children: [
                      BlocBuilder<
                        NotificationCubit,
                        NotificationState
                      >(
                        builder:
                            (context,
                                notificationState) {
                          return HomeHeader(
                            name: userName,
                            imageUrl: userImage,
                            notificationCount: context
                                .read<
                                  NotificationCubit
                                >()
                                .unreadCount,
                          );
                        },
                      ),

                      BlocBuilder<
                        PendingDosesCubit,
                        PendingDosesState
                      >(
                        builder:
                            (context,
                                pendingState) {
                          String medicineName =
                              "Panadol";
                          String time = "05:00";
                          String remainingTime =
                              "";

                          dynamic dose;

                          if (pendingState
                                  is PendingDosesSuccess &&
                              pendingState
                                  .response
                                  .data
                                  .doses
                                  .isNotEmpty) {
                            dose = pendingState
                                .response
                                .data
                                .doses
                                .first;

                            medicineName = dose
                                .medication
                                .medicineName;

                            time = dose.time;

                            final parts =
                                dose.time.split(':');

                            final doseDateTime =
                                DateTime(
                                  DateTime.now().year,
                                  DateTime.now().month,
                                  DateTime.now().day,
                                  int.parse(parts[0]),
                                  int.parse(parts[1]),
                                );

                            final diff =
                                doseDateTime
                                    .difference(
                                      DateTime.now(),
                                    );

                            if (diff.isNegative) {
                              remainingTime =
                                  "Dose time has passed";
                            } else {
                              final hours =
                                  diff.inHours;
                              final minutes =
                                  diff.inMinutes %
                                  60;

                              remainingTime =
                                  "$hours h $minutes min";
                            }
                          }

                          return HomeScrollableContent(
                            remainingTime:
                                remainingTime,
                            articles: articles,
                            medicineName:
                                medicineName,
                            time: time,
                            onTakeDose: () async {
                              if (dose == null) {
                                return;
                              }

                              await context
                                  .read<
                                    PendingDosesCubit
                                  >()
                                  .markDoseAsTaken(
                                    medicationId:
                                        dose
                                            .medication
                                            .id,
                                    time: dose.time,
                                  );
                            },
                            onAddMedicine:
                                () async {
                              final result =
                                  await Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder:
                                          (_) =>
                                              const AddMedicineView(),
                                    ),
                                  );

                              if (result == true &&
                                  context.mounted) {
                                context
                                    .read<
                                      PendingDosesCubit
                                    >()
                                    .getPendingDoses();
                              }
                            },
                          );
                        },
                      ),
                    ],
                  );
                },
              );
            }

            return const SizedBox();
          },
        ),
      ),
    );
  }
}