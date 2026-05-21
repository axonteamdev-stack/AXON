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
import '../../features/auth/domain/useCases/forgot_password_usecase.dart'
    as _i2;
import '../../features/auth/domain/useCases/login_case.dart' as _i861;
import '../../features/auth/domain/useCases/register_doctor_use_case.dart'
    as _i646;
import '../../features/auth/domain/useCases/register_patient_use_case.dart'
    as _i797;
import '../../features/auth/domain/useCases/reset_password_usecase.dart'
    as _i1011;
import '../../features/auth/Presentation/manager/doctor%20registration/doctor_registration_cubit.dart'
    as _i533;
import '../../features/auth/Presentation/manager/forgot%20password/forgot_password_cubit.dart'
    as _i1061;
import '../../features/auth/Presentation/manager/general%20register%20data/general_register_cubit.dart'
    as _i613;
import '../../features/auth/Presentation/manager/login/login_cubit.dart'
    as _i65;
import '../../features/auth/Presentation/manager/patient_registration/patient_registration_cubit.dart'
    as _i10;
import '../../features/auth/Presentation/manager/reset_password.dart/reset_password_cubit.dart'
    as _i316;
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
import '../../features/doctor/Articles%20Doctor/domain/usecases/get_doctor_posts_usecase.dart'
    as _i409;
import '../../features/doctor/Articles%20Doctor/presentation/manager/doctor_articles_cubit.dart'
    as _i197;
import '../../features/doctor/Home%20Doctor/data/datasources/doctor_home_remote_datasource.dart'
    as _i1069;
import '../../features/doctor/Home%20Doctor/data/datasources/impl/doctor_home_remote_datasource_impl.dart'
    as _i460;
import '../../features/doctor/Home%20Doctor/data/repo/doctor_home_repo_impl.dart'
    as _i1022;
import '../../features/doctor/Home%20Doctor/domain/repo/doctor_home_repo.dart'
    as _i183;
import '../../features/doctor/Home%20Doctor/domain/usecases/get_doctor_history_use_case.dart'
    as _i364;
import '../../features/doctor/Home%20Doctor/domain/usecases/get_pending_requests_use_case.dart'
    as _i656;
import '../../features/doctor/Home%20Doctor/domain/usecases/update_appointment_status_use_case.dart'
    as _i605;
import '../../features/doctor/Home%20Doctor/presentation/manager/home/doctor_home_cubit.dart'
    as _i609;
import '../../features/doctor/Profile%20Doctor/data/datasources/doctor_profile_remote_datasource.dart'
    as _i773;
import '../../features/doctor/Profile%20Doctor/data/datasources/impl/doctor_profile_remote_datasource_impl.dart'
    as _i185;
import '../../features/doctor/Profile%20Doctor/data/repo/doctor_profile_repo_impl.dart'
    as _i824;
import '../../features/doctor/Profile%20Doctor/domain/repo/doctor_profile_repo.dart'
    as _i968;
import '../../features/doctor/Profile%20Doctor/domain/usecases/update_doctor_profile_use_case.dart'
    as _i811;
import '../../features/patient/book_doctor/data/data_sourses/remote_data/doctors_remote_data_source.dart'
    as _i846;
import '../../features/patient/book_doctor/data/data_sourses/remote_data/impl/doctors_remote_data_source_impl.dart'
    as _i983;
import '../../features/patient/book_doctor/data/repo_impl/doctors_repo_impl.dart'
    as _i514;
import '../../features/patient/book_doctor/domain/repo/doctors_repo.dart'
    as _i396;
import '../../features/patient/book_doctor/domain/useCases/get_all_doctors_usecase.dart'
    as _i826;
import '../../features/patient/book_doctor/domain/useCases/get_doctor_by_id_usecase.dart'
    as _i94;
import '../../features/patient/book_doctor/domain/useCases/search_doctors_usecase.dart'
    as _i182;
import '../../features/patient/book_doctor/prsentation/manager/doctors_cubit.dart'
    as _i649;
import '../../features/patient/comunity_patient/data/datasources/community_remote_datasource.dart'
    as _i543;
import '../../features/patient/comunity_patient/data/datasources/impl/community_remote_datasource_impl.dart'
    as _i771;
import '../../features/patient/comunity_patient/data/repo/patient_community_repo_impl.dart'
    as _i443;
import '../../features/patient/comunity_patient/domain/repo/patient_community_repo.dart'
    as _i981;
import '../../features/patient/comunity_patient/domain/usecases/add_comment_usecase.dart'
    as _i1023;
import '../../features/patient/comunity_patient/domain/usecases/create_community_post_usecase.dart'
    as _i157;
import '../../features/patient/comunity_patient/domain/usecases/get_comments_usecase.dart'
    as _i341;
import '../../features/patient/comunity_patient/domain/usecases/get_community_posts_usecase.dart'
    as _i353;
import '../../features/patient/comunity_patient/presentation/manager/community_patient/patient_community_cubit.dart'
    as _i713;
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
import '../../features/patient/home_patient/domain/useCases/get_article_details_usecase.dart'
    as _i1011;
import '../../features/patient/home_patient/presentation/manager/article_patient/article_details_cubit.dart'
    as _i829;
import '../../features/patient/home_patient/presentation/manager/home/home_cubit.dart'
    as _i719;
import '../../features/patient/medicine/data/data_sources/medicine_remote_data_source.dart'
    as _i909;
import '../../features/patient/medicine/data/data_sources/repo%20impl/medicine_remote_data_source_impl.dart'
    as _i387;
import '../../features/patient/medicine/data/repo/medicine_repo_impl.dart'
    as _i674;
import '../../features/patient/medicine/domain/repo/medicine_repo.dart'
    as _i855;
import '../../features/patient/medicine/domain/usecases/add_medicine_use_case.dart'
    as _i330;
import '../../features/patient/medicine/domain/usecases/delete_medicine_use_case.dart'
    as _i51;
import '../../features/patient/medicine/domain/usecases/get_medicine_usecase.dart'
    as _i24;
import '../../features/patient/medicine/domain/usecases/update_medicine_use_case.dart'
    as _i403;
import '../../features/patient/medicine/presentation/manager/delete_medicine/delete_medicine_cubit.dart'
    as _i227;
import '../../features/patient/medicine/presentation/manager/get_medicine.dart/medicine_list_cubit.dart'
    as _i437;
import '../../features/patient/medicine/presentation/manager/medicine%20cubit/medicine_cubit.dart'
    as _i621;
import '../../features/patient/medicine/presentation/manager/update_medicine/update_medicine_cubit.dart'
    as _i913;
import '../../features/patient/profile_patient/data/data/data_sourses/remote_data/impl/profile_patient_remote_data_source_impl.dart'
    as _i209;
import '../../features/patient/profile_patient/data/data/data_sourses/remote_data/profile_patient_remote_data_source.dart'
    as _i627;
import '../../features/patient/profile_patient/data/data/profile_ptient_impl/profile_patient_repo_impl.dart'
    as _i72;
import '../../features/patient/profile_patient/domain/repo/profile_patient_repo.dart'
    as _i556;
import '../../features/patient/profile_patient/domain/usecases/update_profile_patient_use_case.dart'
    as _i786;
import '../../features/patient/profile_patient/presentation/manager/Patient%20Dynamic%20List/patient_edit_dynamic_list_cubit.dart'
    as _i427;
import '../../features/patient/profile_patient/presentation/manager/patient_edit_basic_info/patient_edit_basic_info_cubit.dart'
    as _i1052;
import '../../features/patient/profile_patient/presentation/manager/patient_edit_documents/patient_edit_documents_cubit.dart'
    as _i961;
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
    gh.factory<_i773.DoctorProfileRemoteDataSource>(
      () => _i185.DoctorProfileRemoteDataSourceImpl(
        apiManager: gh<_i119.ApiManager>(),
      ),
    );
    gh.factory<_i968.DoctorProfileRepo>(
      () => _i824.DoctorProfileRepoImpl(
        gh<_i773.DoctorProfileRemoteDataSource>(),
      ),
    );
    gh.factory<_i940.DoctorArticlesRemoteDataSource>(
      () => _i649.DoctorArticlesRemoteDataSourceImpl(
        apiManager: gh<_i119.ApiManager>(),
      ),
    );
    gh.factory<_i543.CommunityRemoteDataSource>(
      () => _i771.CommunityRemoteDataSourceImpl(
        apiManager: gh<_i119.ApiManager>(),
      ),
    );
    gh.factory<_i443.PatientCommunityRepo>(
      () =>
          _i981.PatientCommunityRepoImpl(gh<_i543.CommunityRemoteDataSource>()),
    );
    gh.factory<_i379.HomeRemoteDataSource>(
      () => _i961.HomeRemoteDataSourceImpl(apiManager: gh<_i119.ApiManager>()),
    );
    gh.factory<_i1069.DoctorHomeRemoteDataSource>(
      () => _i460.DoctorHomeRemoteDataSourceImpl(
        apiManager: gh<_i119.ApiManager>(),
      ),
    );
    gh.factory<_i536.DoctorArticlesRepo>(
      () => _i182.DoctorArticlesRepoImpl(
        gh<_i940.DoctorArticlesRemoteDataSource>(),
      ),
    );
    gh.factory<_i627.ProfilePatientRemoteDataSource>(
      () => _i209.ProfilePatientRemoteDataSourceImpl(
        networkInfo: gh<_i932.NetworkInfo>(),
        apiManager: gh<_i119.ApiManager>(),
      ),
    );
    gh.factory<_i909.MedicineRemoteDataSource>(
      () => _i387.MedicineRemoteDataSourceImpl(
        networkInfo: gh<_i932.NetworkInfo>(),
        apiManager: gh<_i119.ApiManager>(),
      ),
    );
    gh.factory<_i846.DoctorsRemoteDataSource>(
      () => _i983.DoctorsRemoteDataSourceImpl(
        networkInfo: gh<_i932.NetworkInfo>(),
        apiManager: gh<_i119.ApiManager>(),
      ),
    );
    gh.factory<_i396.DoctorsRepo>(
      () => _i514.DoctorsRepoImpl(
        doctorsRemoteDataSource: gh<_i846.DoctorsRemoteDataSource>(),
      ),
    );
    gh.factory<_i1023.AddCommentUseCase>(
      () => _i1023.AddCommentUseCase(gh<_i443.PatientCommunityRepo>()),
    );
    gh.factory<_i157.CreateCommunityPostUseCase>(
      () => _i157.CreateCommunityPostUseCase(gh<_i443.PatientCommunityRepo>()),
    );
    gh.factory<_i341.GetCommentsUseCase>(
      () => _i341.GetCommentsUseCase(gh<_i443.PatientCommunityRepo>()),
    );
    gh.factory<_i353.GetCommunityPostsUseCase>(
      () => _i353.GetCommunityPostsUseCase(gh<_i443.PatientCommunityRepo>()),
    );
    gh.factory<_i223.AuthRemoteDataSource>(
      () => _i810.AuthRemoteDataSourceImpl(
        networkInfo: gh<_i932.NetworkInfo>(),
        apiManager: gh<_i119.ApiManager>(),
      ),
    );
    gh.factory<_i811.UpdateDoctorProfileUseCase>(
      () => _i811.UpdateDoctorProfileUseCase(gh<_i968.DoctorProfileRepo>()),
    );
    gh.factory<_i629.HomeRepo>(
      () => _i848.HomeRepoImpl(gh<_i379.HomeRemoteDataSource>()),
    );
    gh.factory<_i855.MedicineRepo>(
      () => _i674.MedicineRepoImpl(
        remoteDataSource: gh<_i909.MedicineRemoteDataSource>(),
      ),
    );
    gh.factory<_i330.AddMedicineUseCase>(
      () => _i330.AddMedicineUseCase(gh<_i855.MedicineRepo>()),
    );
    gh.factory<_i51.DeleteMedicineUseCase>(
      () => _i51.DeleteMedicineUseCase(gh<_i855.MedicineRepo>()),
    );
    gh.factory<_i24.GetMedicinesUseCase>(
      () => _i24.GetMedicinesUseCase(gh<_i855.MedicineRepo>()),
    );
    gh.factory<_i403.UpdateMedicineUseCase>(
      () => _i403.UpdateMedicineUseCase(gh<_i855.MedicineRepo>()),
    );
    gh.factory<_i183.DoctorHomeRepo>(
      () => _i1022.DoctorHomeRepoImpl(
        remoteDataSource: gh<_i1069.DoctorHomeRemoteDataSource>(),
      ),
    );
    gh.factory<_i634.GetAllArticlesUseCase>(
      () => _i634.GetAllArticlesUseCase(gh<_i629.HomeRepo>()),
    );
    gh.factory<_i194.CreateArticleUseCase>(
      () => _i194.CreateArticleUseCase(gh<_i536.DoctorArticlesRepo>()),
    );
    gh.factory<_i409.GetDoctorPostsUseCase>(
      () => _i409.GetDoctorPostsUseCase(gh<_i536.DoctorArticlesRepo>()),
    );
    gh.factory<_i913.UpdateMedicineCubit>(
      () => _i913.UpdateMedicineCubit(
        updateMedicineUseCase: gh<_i403.UpdateMedicineUseCase>(),
      ),
    );
    gh.factory<_i826.GetAllDoctorsUseCase>(
      () => _i826.GetAllDoctorsUseCase(gh<_i396.DoctorsRepo>()),
    );
    gh.factory<_i94.GetDoctorByIdUseCase>(
      () => _i94.GetDoctorByIdUseCase(gh<_i396.DoctorsRepo>()),
    );
    gh.factory<_i182.SearchDoctorsUseCase>(
      () => _i182.SearchDoctorsUseCase(gh<_i396.DoctorsRepo>()),
    );
    gh.factory<_i556.ProfilePatientRepo>(
      () => _i72.ProfilePatientRepoImpl(
        profilePatientRemoteDataSource:
            gh<_i627.ProfilePatientRemoteDataSource>(),
      ),
    );
    gh.factory<_i713.PatientCommunityCubit>(
      () => _i713.PatientCommunityCubit(
        gh<_i353.GetCommunityPostsUseCase>(),
        gh<_i157.CreateCommunityPostUseCase>(),
        gh<_i1023.AddCommentUseCase>(),
        gh<_i341.GetCommentsUseCase>(),
      ),
    );
    gh.factory<_i170.AuthRepo>(
      () => _i279.AuthRepoImpl(
        authRemoteDataSource: gh<_i223.AuthRemoteDataSource>(),
      ),
    );
    gh.factory<_i227.DeleteMedicineCubit>(
      () => _i227.DeleteMedicineCubit(
        deleteMedicineUseCase: gh<_i51.DeleteMedicineUseCase>(),
      ),
    );
    gh.factory<_i437.MedicineListCubit>(
      () => _i437.MedicineListCubit(
        getMedicinesUseCase: gh<_i24.GetMedicinesUseCase>(),
      ),
    );
    gh.factory<_i649.DoctorsCubit>(
      () => _i649.DoctorsCubit(
        getAllDoctorsUseCase: gh<_i826.GetAllDoctorsUseCase>(),
        searchDoctorsUseCase: gh<_i182.SearchDoctorsUseCase>(),
      ),
    );
    gh.factory<_i786.UpdateProfilePatientUseCase>(
      () => _i786.UpdateProfilePatientUseCase(gh<_i556.ProfilePatientRepo>()),
    );
    gh.factory<_i621.MedicineCubit>(
      () => _i621.MedicineCubit(gh<_i330.AddMedicineUseCase>()),
    );
    gh.factory<_i1011.GetArticleDetailsUseCase>(
      () => _i1011.GetArticleDetailsUseCase(gh<_i629.HomeRepo>()),
    );
    gh.factory<_i364.GetDoctorHistoryUseCase>(
      () => _i364.GetDoctorHistoryUseCase(gh<_i183.DoctorHomeRepo>()),
    );
    gh.factory<_i656.GetPendingRequestsUseCase>(
      () => _i656.GetPendingRequestsUseCase(gh<_i183.DoctorHomeRepo>()),
    );
    gh.factory<_i605.UpdateAppointmentStatusUseCase>(
      () => _i605.UpdateAppointmentStatusUseCase(gh<_i183.DoctorHomeRepo>()),
    );
    gh.factory<_i646.RegisterDoctorUseCase>(
      () => _i646.RegisterDoctorUseCase(authRepo: gh<_i170.AuthRepo>()),
    );
    gh.factory<_i2.ForgotPasswordUsecase>(
      () => _i2.ForgotPasswordUsecase(gh<_i170.AuthRepo>()),
    );
    gh.factory<_i861.LoginUseCase>(
      () => _i861.LoginUseCase(gh<_i170.AuthRepo>()),
    );
    gh.factory<_i797.RegisterPatientUseCase>(
      () => _i797.RegisterPatientUseCase(gh<_i170.AuthRepo>()),
    );
    gh.factory<_i1011.ResetPasswordUsecase>(
      () => _i1011.ResetPasswordUsecase(gh<_i170.AuthRepo>()),
    );
    gh.factory<_i719.HomeCubit>(
      () => _i719.HomeCubit(
        fetchArticlesUseCase: gh<_i634.GetAllArticlesUseCase>(),
      ),
    );
    gh.factory<_i197.DoctorArticlesCubit>(
      () => _i197.DoctorArticlesCubit(
        gh<_i194.CreateArticleUseCase>(),
        gh<_i409.GetDoctorPostsUseCase>(),
      ),
    );
    gh.factory<_i609.DoctorHomeCubit>(
      () => _i609.DoctorHomeCubit(
        gh<_i656.GetPendingRequestsUseCase>(),
        gh<_i605.UpdateAppointmentStatusUseCase>(),
        gh<_i364.GetDoctorHistoryUseCase>(),
      ),
    );
    gh.factory<_i65.LoginCubit>(
      () => _i65.LoginCubit(loginUseCase: gh<_i861.LoginUseCase>()),
    );
    gh.factory<_i10.PatientRegistrationCubit>(
      () => _i10.PatientRegistrationCubit(gh<_i797.RegisterPatientUseCase>()),
    );
    gh.factory<_i427.PatientEditDynamicListCubit>(
      () => _i427.PatientEditDynamicListCubit(
        updateProfilePatientUseCase: gh<_i786.UpdateProfilePatientUseCase>(),
        prefKey: gh<String>(),
        isAllergies: gh<bool>(),
      ),
    );
    gh.factory<_i829.ArticleDetailsCubit>(
      () => _i829.ArticleDetailsCubit(gh<_i1011.GetArticleDetailsUseCase>()),
    );
    gh.factory<_i961.PatientEditDocumentsCubit>(
      () => _i961.PatientEditDocumentsCubit(
        updateProfilePatientUseCase: gh<_i786.UpdateProfilePatientUseCase>(),
        isRadiology: gh<bool>(),
      ),
    );
    gh.factory<_i1061.ForgotPasswordCubit>(
      () => _i1061.ForgotPasswordCubit(
        forgotPasswordUsecase: gh<_i2.ForgotPasswordUsecase>(),
      ),
    );
    gh.factory<_i1052.PatientEditBasicInfoCubit>(
      () => _i1052.PatientEditBasicInfoCubit(
        updateProfilePatientUseCase: gh<_i786.UpdateProfilePatientUseCase>(),
      ),
    );
    gh.factory<_i533.DoctorRegistrationCubit>(
      () => _i533.DoctorRegistrationCubit(
        registerDoctorUseCase: gh<_i646.RegisterDoctorUseCase>(),
      ),
    );
    gh.factory<_i316.ResetPasswordCubit>(
      () => _i316.ResetPasswordCubit(
        resetPasswordUsecase: gh<_i1011.ResetPasswordUsecase>(),
      ),
    );
    return this;
  }
}

class _$NetworkModule extends _i200.NetworkModule {}
