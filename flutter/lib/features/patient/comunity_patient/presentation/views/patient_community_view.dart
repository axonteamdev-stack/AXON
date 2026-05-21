import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/comunity_patient/presentation/manager/community_patient/patient_community_cubit.dart';
import 'package:Axon/features/patient/comunity_patient/presentation/views/widgets/create_patient_post_bottom_sheet.dart';
import 'package:Axon/features/patient/comunity_patient/presentation/views/widgets/patient_post_item_card.dart';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class PatientCommunityView
    extends StatefulWidget {

  const PatientCommunityView({
    super.key,
  });

  @override
  State<PatientCommunityView>
      createState() =>
          _PatientCommunityScreenState();
}

class _PatientCommunityScreenState
    extends State<
        PatientCommunityView> {

  @override
  void initState() {

    super.initState();

    context
        .read<
            PatientCommunityCubit>()
        .getPosts();
  }

  Future<void> _onRefresh() async {

    await context
        .read<
            PatientCommunityCubit>()
        .getPosts();
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      backgroundColor:
          const Color(0xffF5F7FB),

      floatingActionButton:
          FloatingActionButton(

        backgroundColor:
            AppColors.primaryColor,

        child: const Icon(
          Icons.add,
          color: Colors.white,
        ),

        onPressed: () {

          showModalBottomSheet(

            context: context,

            isScrollControlled:
                true,

            backgroundColor:
                Colors.transparent,

            builder:
                (_) =>
                    BlocProvider.value(

              value: context.read<
                  PatientCommunityCubit>(),

              child:
                  const CreatePatientPostBottomSheet(),
            ),
          );
        },
      ),

      body: SafeArea(

        child: RefreshIndicator(

          color:
              AppColors.primaryColor,

          onRefresh:
              _onRefresh,

          child: BlocBuilder<
              PatientCommunityCubit,
              PatientCommunityState>(

            builder:
                (context, state) {

              // LOADING

              if (state
                  is PatientCommunityLoading) {

                return const Center(
                  child:
                      CircularProgressIndicator(),
                );
              }

              // ERROR

              if (state
                  is PatientCommunityError) {

                return ListView(
                  children: [
                    SizedBox(
                      height:
                          MediaQuery.of(context)
                              .size
                              .height *
                          0.7,
                      child: Center(
                        child: TextApp(
                          text:
                              state.failure.toString(),
                        ),
                      ),
                    ),
                  ],
                );
              }

              // SUCCESS

              if (state
                  is PatientCommunitySuccess) {

                final posts =
                    state
                        .posts
                        .posts;

                if (posts.isEmpty) {

                  return ListView(
                    children: const [
                      SizedBox(
                        height: 500,
                        child: Center(
                          child: TextApp(
                            text:
                                "No Posts Yet",
                          ),
                        ),
                      ),
                    ],
                  );
                }

                return ListView.separated(

                  physics:
                      const AlwaysScrollableScrollPhysics(),

                  padding:
                      EdgeInsets.all(
                    16.w,
                  ),

                  itemCount:
                      posts.length,

                  separatorBuilder:
                      (_, __) =>
                          SizedBox(
                    height: 16.h,
                  ),

                  itemBuilder:
                      (_, index) {

                    return PatientPostItemCard(
                      post:
                          posts[index],
                    );
                  },
                );
              }

              return ListView(
                children: const [
                  SizedBox(
                    height: 500,
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }
}