import 'package:Axon/core/network/api_manager.dart';

import 'package:Axon/core/style/colors.dart';

import 'package:Axon/features/doctor/Profile%20Doctor/data/datasources/impl/doctor_profile_remote_datasource_impl.dart';

import 'package:Axon/features/doctor/Profile%20Doctor/data/repo/doctor_profile_repo_impl.dart';
import 'package:Axon/features/doctor/Profile%20Doctor/domain/usecases/update_doctor_profile_use_case.dart';


import 'package:Axon/features/doctor/Profile%20Doctor/presentation/manager/profile%20doctor/doctor_profile_cubit.dart';

import 'package:Axon/features/doctor/Profile%20Doctor/presentation/manager/profile%20doctor/doctor_profile_state.dart';

import 'package:Axon/features/doctor/Profile%20Doctor/presentation/views/widgets/doctor_profile_body.dart';

import 'package:flutter/material.dart';

import 'package:flutter_bloc/flutter_bloc.dart';

class DoctorProfileView
    extends StatelessWidget {

  const DoctorProfileView({
    super.key,
  });

  @override
  Widget build(BuildContext context) {

    return BlocProvider(

      create: (_) {

        final apiManager =
            ApiManager();

        final remoteDataSource =
            DoctorProfileRemoteDataSourceImpl(

          apiManager: apiManager,
        );

        final repo =
            DoctorProfileRepoImpl(
          remoteDataSource,
        );

        final useCase =
            UpdateDoctorProfileUseCase(
          repo,
        );

        return DoctorProfileCubit(
          useCase,
        );
      },

      child: BlocBuilder<
          DoctorProfileCubit,
          DoctorProfileState>(

        builder: (context, state) {

          return Scaffold(

            backgroundColor:
                AppColors.white,

            body: DoctorProfileBody(
              state: state,
            ),
          );
        },
      ),
    );
  }
}