import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_app_bar.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/duration_cubit/duration_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/medicine%20cubit/medicine_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/time_cubit/intake-time_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/widget/add_medicine_body.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class AddMedicineView extends StatelessWidget {
  const AddMedicineView({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => MedicineCubit()),
        BlocProvider(create: (_) => IntakeTimeCubit()),
        BlocProvider(create: (_) => DurationCubit()),
      ],
      child: Builder( 
        builder: (context) {
          return Scaffold(
            backgroundColor: AppColors.white,
            body: Column(
              children: [
                const CustomAppBar(title: "Add New Medicine"),
                Expanded(
                  child: AddMedicineBody(),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
