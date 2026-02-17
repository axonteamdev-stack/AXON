import 'package:Axon/features/doctor/Home%20Doctor/presentation/manager/home/doctor_home_cubit.dart';
import 'package:Axon/features/doctor/Home%20Doctor/presentation/views/widgets/tab_item.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/extensions/localization_ext.dart';



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
              title: context.l10n.chats,
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
              title: context.l10n.requests,
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
