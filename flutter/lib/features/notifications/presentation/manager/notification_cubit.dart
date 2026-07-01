import 'package:Axon/features/notifications/domain/entities/notification_entity.dart';
import 'package:Axon/features/notifications/domain/usecases/get_notifications_usecase.dart';
import 'package:Axon/features/notifications/domain/usecases/get_unread_count_usecase.dart';
import 'package:Axon/features/notifications/domain/usecases/mark_all_read_usecase.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';

import 'notification_state.dart';

@injectable
class NotificationCubit extends Cubit<NotificationState> {
  NotificationCubit(
    this.getNotificationsUseCase,
    this.getUnreadCountUseCase,
    this.markAllReadUseCase,
  ) : super(NotificationInitial());

  final GetNotificationsUseCase getNotificationsUseCase;
  final GetUnreadCountUseCase getUnreadCountUseCase;
  final MarkAllReadUseCase markAllReadUseCase;

  int unreadCount = 0;

  List<NotificationEntity> notifications = [];

  Future<void> getUnreadCount() async {
    print('GET UNREAD COUNT');

    try {
      unreadCount = await getUnreadCountUseCase();

      print('CUBIT COUNT => $unreadCount');

      emit(NotificationUnreadLoaded(unreadCount));
    } catch (e) {
      emit(NotificationError(e.toString()));
    }
  }

  Future<void> getNotifications() async {
    try {
      emit(NotificationLoading());

      notifications = await getNotificationsUseCase();

      emit(NotificationLoaded(notifications));
    } catch (e) {
      emit(NotificationError(e.toString()));
    }
  }

  Future<void> markAllRead() async {
    print('MARK ALL READ');

    try {
      await markAllReadUseCase();

      unreadCount = 0;

      emit(NotificationUnreadLoaded(unreadCount));
    } catch (e) {
      print(e);

      emit(NotificationError(e.toString()));
    }
  }
}
