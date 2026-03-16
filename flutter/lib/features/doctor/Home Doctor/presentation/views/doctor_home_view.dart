import 'package:Axon/features/doctor/Home%20Doctor/presentation/manager/home/doctor_home_cubit.dart';
import 'package:Axon/features/doctor/Home%20Doctor/presentation/views/widgets/doctor_chat_card.dart';
import 'package:Axon/features/doctor/Home%20Doctor/presentation/views/widgets/doctor_home_header.dart';
import 'package:Axon/features/doctor/Home%20Doctor/presentation/views/widgets/doctor_home_tabs.dart';
import 'package:Axon/features/doctor/Home%20Doctor/presentation/views/widgets/doctor_request_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DoctorHomeView extends StatelessWidget {
  const DoctorHomeView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => DoctorHomeCubit()..loadDoctorHome(),
      child: SafeArea(
        child: Padding(
          padding: EdgeInsets.all(16.w),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const DoctorHomeHeader(),
              SizedBox(height: 24.h),
              const DoctorHomeTabs(),
              SizedBox(height: 20.h),
              Expanded(
                child: BlocBuilder<DoctorHomeCubit, DoctorHomeState>(
                  builder: (context, state) {
                    if (state.currentTab ==
                        DoctorHomeTab.requests) {
                      return ListView.separated(
                        itemCount: state.requestPatients.length,
                        separatorBuilder: (_, __) =>
                            SizedBox(height: 12.h),
                        itemBuilder: (_, index) {
                          return const DoctorRequestCard();
                        },
                      );
                    }

                   return ListView.separated(
  itemCount: state.chatPatients.length,
  separatorBuilder: (_, __) => SizedBox(height: 12.h),
  itemBuilder: (_, index) {
    final patient = state.chatPatients[index];

    return DoctorChatCard(
      name: patient.name,
      description: patient.description,
      image: patient.image,
    );
  },
);

                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
