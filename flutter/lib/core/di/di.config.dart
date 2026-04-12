// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format width=80

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;
import 'package:internet_connection_checker_plus/internet_connection_checker_plus.dart'
    as _i161;

import '../../features/auth/data/data_sourses/remote_data/auth_remote_data_source.dart'
    as _i223;
import '../../features/auth/data/data_sourses/remote_data/impl/auth_remote_data_source_impl.dart'
    as _i810;
import '../../features/auth/data/repo_impl/auth_repo_impl.dart' as _i279;
import '../../features/auth/domain/repo/auth_repo.dart' as _i170;
import '../../features/auth/domain/useCases/login_case.dart' as _i861;
import '../../features/auth/domain/useCases/register_doctor_use_case.dart'
    as _i646;
import '../../features/auth/domain/useCases/register_patient_use_case.dart'
    as _i797;
import '../../features/auth/Presentation/manager/doctor%20registration/doctor_registration_cubit.dart'
    as _i533;
import '../../features/auth/Presentation/manager/general%20register%20data/general_register_cubit.dart'
    as _i613;
import '../../features/auth/Presentation/manager/login/login_cubit.dart'
    as _i65;
import '../../features/auth/Presentation/manager/patient_registration/patient_registration_cubit.dart'
    as _i10;
import '../../features/auth/Presentation/manager/selected%20gender/gender_cubit.dart'
    as _i631;
import '../../features/doctor/Articles%20Doctor/data/datasources/doctor_articles_remote_datasource.dart'
    as _i940;
import '../../features/doctor/Articles%20Doctor/data/datasources/impl/doctor_articles_remote_datasource_impl.dart'
    as _i649;
import '../../features/doctor/Articles%20Doctor/data/doctor_articles_repo_impl.dart'
    as _i182;
import '../../features/doctor/Articles%20Doctor/domain/repo/doctor_articles_repo.dart'
    as _i536;
import '../../features/doctor/Articles%20Doctor/domain/usecases/create_article_usecase.dart'
    as _i194;
import '../../features/doctor/Articles%20Doctor/presentation/manager/doctor_articles_cubit.dart'
    as _i197;
import '../../features/patient/home_patient/data/data_sources/home_remote_datasource.dart'
    as _i379;
import '../../features/patient/home_patient/data/data_sources/impl/home_remote_datasource_impl.dart'
    as _i961;
import '../../features/patient/home_patient/data/repoes/home_repo_impl.dart'
    as _i848;
import '../../features/patient/home_patient/domain/repo/home_repo.dart'
    as _i629;
import '../../features/patient/home_patient/domain/useCases/get_all_articales_usecase.dart'
    as _i634;
import '../../features/patient/home_patient/presentation/manager/home/home_cubit.dart'
    as _i719;
import '../network/api_manager.dart' as _i119;
import '../network/network_info.dart' as _i932;
import '../network/network_module.dart' as _i200;

extension GetItInjectableX on _i174.GetIt {
  // initializes the registration of main-scope dependencies inside of GetIt
  _i174.GetIt init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i526.GetItHelper(this, environment, environmentFilter);
    final networkModule = _$NetworkModule();
    gh.factory<_i613.GeneralRegisterCubit>(() => _i613.GeneralRegisterCubit());
    gh.singleton<_i119.ApiManager>(() => _i119.ApiManager());
    gh.lazySingleton<_i161.InternetConnection>(
      () => networkModule.internetConnection,
    );
    gh.lazySingleton<_i631.GenderCubit>(() => _i631.GenderCubit());
    gh.lazySingleton<_i932.NetworkInfo>(
      () => _i932.NetworkInfoImpl(gh<_i161.InternetConnection>()),
    );
    gh.factory<_i940.DoctorArticlesRemoteDataSource>(
      () => _i649.DoctorArticlesRemoteDataSourceImpl(
        apiManager: gh<_i119.ApiManager>(),
      ),
    );
    gh.factory<_i379.HomeRemoteDataSource>(
      () => _i961.HomeRemoteDataSourceImpl(apiManager: gh<_i119.ApiManager>()),
    );
    gh.factory<_i536.DoctorArticlesRepo>(
      () => _i182.DoctorArticlesRepoImpl(
        gh<_i940.DoctorArticlesRemoteDataSource>(),
      ),
    );
    gh.factory<_i223.AuthRemoteDataSource>(
      () => _i810.AuthRemoteDataSourceImpl(
        networkInfo: gh<_i932.NetworkInfo>(),
        apiManager: gh<_i119.ApiManager>(),
      ),
    );
    gh.factory<_i629.HomeRepo>(
      () => _i848.HomeRepoImpl(gh<_i379.HomeRemoteDataSource>()),
    );
    gh.factory<_i634.GetAllArticlesUseCase>(
      () => _i634.GetAllArticlesUseCase(gh<_i629.HomeRepo>()),
    );
    gh.factory<_i194.CreateArticleUseCase>(
      () => _i194.CreateArticleUseCase(gh<_i536.DoctorArticlesRepo>()),
    );
    gh.factory<_i170.AuthRepo>(
      () => _i279.AuthRepoImpl(
        authRemoteDataSource: gh<_i223.AuthRemoteDataSource>(),
      ),
    );
    gh.factory<_i197.DoctorArticlesCubit>(
      () => _i197.DoctorArticlesCubit(gh<_i194.CreateArticleUseCase>()),
    );
    gh.factory<_i646.RegisterDoctorUseCase>(
      () => _i646.RegisterDoctorUseCase(authRepo: gh<_i170.AuthRepo>()),
    );
    gh.factory<_i861.LoginUseCase>(
      () => _i861.LoginUseCase(gh<_i170.AuthRepo>()),
    );
    gh.factory<_i797.RegisterPatientUseCase>(
      () => _i797.RegisterPatientUseCase(gh<_i170.AuthRepo>()),
    );
    gh.factory<_i719.HomeCubit>(
      () => _i719.HomeCubit(
        fetchArticlesUseCase: gh<_i634.GetAllArticlesUseCase>(),
      ),
    );
    gh.factory<_i65.LoginCubit>(
      () => _i65.LoginCubit(loginUseCase: gh<_i861.LoginUseCase>()),
    );
    gh.factory<_i10.PatientRegistrationCubit>(
      () => _i10.PatientRegistrationCubit(gh<_i797.RegisterPatientUseCase>()),
    );
    gh.factory<_i533.DoctorRegistrationCubit>(
      () => _i533.DoctorRegistrationCubit(
        registerDoctorUseCase: gh<_i646.RegisterDoctorUseCase>(),
      ),
    );
    return this;
  }
}

class _$NetworkModule extends _i200.NetworkModule {}
