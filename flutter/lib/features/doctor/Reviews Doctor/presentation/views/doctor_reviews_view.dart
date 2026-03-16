import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/features/doctor/Reviews%20Doctor/presentation/manager/doctor_reviews_cubit.dart';
import 'package:Axon/features/doctor/Reviews%20Doctor/presentation/manager/doctor_reviews_state.dart';
import 'package:Axon/features/doctor/Reviews%20Doctor/presentation/views/wedgits/patient_review_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';


class DoctorReviewsView extends StatelessWidget {
  const DoctorReviewsView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => DoctorReviewsCubit(),
      child: Scaffold(
        backgroundColor: AppColors.white,
        appBar: AppBar(
          title: Text(
            context.l10n.patient_reviews,
            style: const TextStyle(color: AppColors.black),
          ),
          backgroundColor: AppColors.white,
          elevation: 0,
          scrolledUnderElevation: 0,
          surfaceTintColor: Colors.transparent,
          iconTheme: const IconThemeData(color: AppColors.black),
        ),
        body: BlocBuilder<DoctorReviewsCubit, DoctorReviewsState>(
          builder: (context, state) {
            return ListView.builder(
              padding: EdgeInsets.all(20.w),
              itemCount: state.reviews.length,
              itemBuilder: (context, index) {
                return PatientReviewCard(
                  review: state.reviews[index],
                );
              },
            );
          },
        ),
      ),
    );
  }
}
