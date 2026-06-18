import 'package:Axon/features/patient/home_patient/data/models/user_basic_info_model.dart';


abstract class ProfileRemoteDataSource {
  Future<UserBasicInfoModel> getProfile();
}

