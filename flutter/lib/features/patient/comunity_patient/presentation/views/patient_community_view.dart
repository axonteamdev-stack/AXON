import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/comunity_patient/presentation/manager/community_patient/patient_community_cubit.dart';

import 'widgets/patient_post_item_card.dart';
import 'widgets/create_patient_post_bottom_sheet.dart';

class PatientCommunityView extends StatelessWidget {
  const PatientCommunityView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => PatientCommunityCubit(),
      child: Builder(
        builder: (context) {
          return Scaffold(
            backgroundColor: AppColors.white,
            floatingActionButton: FloatingActionButton(
              backgroundColor: AppColors.primaryColor,
              child: const Icon(
                Icons.add,
                color: AppColors.white,
              ),
              onPressed: () {
                final cubit =
                    context.read<PatientCommunityCubit>();

                showModalBottomSheet(
                  context: context,
                  isScrollControlled: true,
                  backgroundColor: Colors.transparent,
                  builder: (_) => BlocProvider.value(
                    value: cubit,
                    child:
                        const CreatePatientPostBottomSheet(),
                  ),
                );
              },
            ),
            body: SafeArea(
              child: Padding(
                padding: EdgeInsets.all(16.w),
                child: Column(
                  children: [
                    const TextApp(
                      text: 'Community',
                      weight: AppTextWeight.bold,
                      fontSize: 18,
                      color: AppColors.primaryColor,
                      textAlign: TextAlign.center,
                    ),
                    SizedBox(height: 24.h),
                    Expanded(
                      child: BlocBuilder<
                          PatientCommunityCubit,
                          PatientCommunityState>(
                        builder: (context, state) {
                          if (state.posts.isEmpty) {
                            return const _EmptyCommunityState();
                          }

                          return ListView.separated(
                            itemCount: state.posts.length,
                            separatorBuilder: (_, __) =>
                                SizedBox(height: 16.h),
                            itemBuilder: (_, index) =>
                                PatientPostItemCard(
                              post: state.posts[index],
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

class _EmptyCommunityState extends StatelessWidget {
  const _EmptyCommunityState();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.forum_outlined,
            size: 72,
            color: AppColors.grey.withOpacity(0.7),
          ),
          SizedBox(height: 14.h),
          const TextApp(
            text: 'No posts yet',
            weight: AppTextWeight.semiBold,
            color: AppColors.grey,
          ),
          SizedBox(height: 6.h),
          const TextApp(
            text: 'Be the first to share something',
            fontSize: 12,
            color: AppColors.grey,
          ),
        ],
      ),
    );
  }
}
