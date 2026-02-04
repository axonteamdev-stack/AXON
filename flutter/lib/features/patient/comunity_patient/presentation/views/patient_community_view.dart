import 'package:Axon/features/patient/comunity_patient/presentation/manager/community_patient/patient_community_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';

import 'widgets/create_patient_post_card.dart';
import 'widgets/patient_post_item_card.dart';

class PatientCommunityView extends StatelessWidget {
  const PatientCommunityView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => PatientCommunityCubit(),
      child: Scaffold(
        backgroundColor: AppColors.white,
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
                ),
                SizedBox(height: 16.h),
                const CreatePatientPostCard(),
                SizedBox(height: 20.h),
                Expanded(
                  child: BlocBuilder<PatientCommunityCubit,
                      PatientCommunityState>(
                    builder: (context, state) {
                      if (state.posts.isEmpty) {
                        return const Center(
                          child: TextApp(
                            text: 'No posts yet',
                            color: AppColors.grey,
                          ),
                        );
                      }

                      return ListView.separated(
                        itemCount: state.posts.length,
                        separatorBuilder: (_, __) =>
                            SizedBox(height: 14.h),
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
      ),
    );
  }
}
