import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_app_bar.dart';
import 'package:Axon/features/notifications/presentation/manager/notification_cubit.dart';
import 'package:Axon/features/notifications/presentation/manager/notification_state.dart';
import 'package:Axon/features/notifications/presentation/view/widgets/notification_item.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class NotificationScreen extends StatefulWidget {
  const NotificationScreen({super.key});

  @override
  State<NotificationScreen> createState() =>
      _NotificationScreenState();
}

class _NotificationScreenState
    extends State<NotificationScreen> {
  @override
  @override
void initState() {
  super.initState();

  print('NOTIFICATION SCREEN OPENED');

  context.read<NotificationCubit>().markAllRead();
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: Column(
        children: [
          CustomAppBar(
            height: 120.h,
            title: "notifications",
          ),

          SizedBox(height: 10.h),

          Expanded(
            child: BlocBuilder<
                NotificationCubit,
                NotificationState>(
              builder: (context, state) {
                if (state is NotificationLoading) {
                  return const Center(
                    child:
                        CircularProgressIndicator(),
                  );
                }

                if (state is NotificationError) {
                  return Center(
                    child: Text(state.message),
                  );
                }

                final cubit =
                    context.read<NotificationCubit>();

                final notifications =
                    state is NotificationLoaded
                        ? state.notifications
                        : cubit.notifications;

                if (notifications.isEmpty) {
                  return const Center(
                    child: Text(
                      'No notifications yet',
                    ),
                  );
                }

                return ListView.separated(
                  padding:
                      const EdgeInsets.all(16),
                  itemCount:
                      notifications.length,
                  separatorBuilder:
                      (_, __) =>
                          const SizedBox(
                            height: 12,
                          ),
                  itemBuilder:
                      (context, index) {
                    return NotificationItem(
                      notification:
                          notifications[index],
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}