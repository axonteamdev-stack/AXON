import 'package:Axon/core/network/api_manager.dart';
import 'package:Axon/core/network/endpoints.dart';
import 'package:Axon/features/patient/home_patient/data/data_sources/profile_remote_data_source.dart';
import 'package:Axon/features/patient/home_patient/data/models/user_basic_info_model.dart';
import 'package:injectable/injectable.dart';

@Injectable(as: ProfileRemoteDataSource)
class ProfileRemoteDataSourceImpl implements ProfileRemoteDataSource {
  final ApiManager apiManager;

  ProfileRemoteDataSourceImpl(this.apiManager);

  @override
  Future<UserBasicInfoModel> getProfile() async {
    final response = await apiManager.get(Endpoints.myProfile);

    return UserBasicInfoModel.fromJson(response);
  }
}
