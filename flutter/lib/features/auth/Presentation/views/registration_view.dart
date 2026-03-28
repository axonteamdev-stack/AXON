import 'package:Axon/core/di/di.dart';
import 'package:Axon/features/auth/Presentation/manager/general%20register%20data/general_register_cubit.dart';
import 'package:Axon/features/auth/Presentation/manager/selected gender/gender_cubit.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/register_body.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';


/// ================== MAIN VIEW ==================
class RegistrationView extends StatelessWidget {
  const RegistrationView({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => getIt<GeneralRegisterCubit>()),
        BlocProvider(create: (_) => getIt<GenderCubit>()),
      ],
      child: RegisterBody (),
    );
  }
}
