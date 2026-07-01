import 'package:injectable/injectable.dart';
import '../../../../../core/network/api_manager.dart';
import '../../../../../core/network/endpoints.dart';
import '../models/notification_model.dart';
import 'notification_remote_data_source.dart';

@Injectable(as: NotificationRemoteDataSource)
class NotificationRemoteDataSourceImpl implements NotificationRemoteDataSource {
  final ApiManager apiManager;

  NotificationRemoteDataSourceImpl(this.apiManager);

  @override
  Future<List<NotificationModel>> getNotifications() async {
    final response = await apiManager.dio.get(
      Endpoints.notifications,
      queryParameters: {'page': 1, 'limit': 20},
    );
    print('Notifications Response:');
    print(response.data);
    final List data = response.data['data']['data'];

    return data.map((e) => NotificationModel.fromJson(e)).toList();
  }

  @override
  Future<int> getUnreadCount() async {
    final response = await apiManager.dio.get(
      Endpoints.unreadNotificationsCount,
    );

    return response.data['data']['count'];
  }

  @override
  Future<void> markAllAsRead() async {
    print('PATCH READ ALL CALLED');

    final response = await apiManager.dio.patch(
      Endpoints.markAllNotificationsRead,
    );

    print(response.data);
  }
}
