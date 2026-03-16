import 'package:Axon/features/doctor/presentation/manager/home/doctor_home_cubit.dart';
import 'package:Axon/features/doctor/presentation/views/widgets/tab_item.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';


class DoctorHomeTabs extends StatelessWidget {
  const DoctorHomeTabs({super.key});

  @override
  Widget build(BuildContext context) {
    final requestsCount =
        context.select<DoctorHomeCubit, int>(
            (cubit) => cubit.requestsCount);

    return BlocBuilder<DoctorHomeCubit, DoctorHomeState>(
      builder: (context, state) {
        return Row(
          children: [
            TabItem(
              title: 'Chats',
              selected:
                  state.currentTab == DoctorHomeTab.chats,
              onTap: () {
                context
                    .read<DoctorHomeCubit>()
                    .changeTab(DoctorHomeTab.chats);
              },
            ),
            SizedBox(width: 12.w),
            TabItem(
              title: 'Requests',
              count: requestsCount,
              selected:
                  state.currentTab == DoctorHomeTab.requests,
              onTap: () {
                context
                    .read<DoctorHomeCubit>()
                    .changeTab(DoctorHomeTab.requests);
              },
            ),
          ],
        );
      },
    );
  }
}
