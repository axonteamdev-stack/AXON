import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/home_bottom_nav_bar.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/home/home_cubit.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/home/home_state.dart';
import 'package:Axon/features/patient/home_patient/presentation/views/widgets/home_header.dart';
import 'package:Axon/features/patient/home_patient/presentation/views/widgets/home_scrollable_content.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';


class HomeView extends StatelessWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => HomeCubit()..loadHome(),
      child: Scaffold(
        backgroundColor: AppColors.white,
        bottomNavigationBar: const HomeBottomNavBar(),
        body: SafeArea(
          child: BlocBuilder<HomeCubit, HomeState>(
            builder: (context, state) {
              if (state is HomeLoading || state is HomeInitial) {
                return const Center(child: CircularProgressIndicator());
              }

             return Column(
      children: [
        const HomeHeader(
          name: "Abdullah",
          notificationCount: 5,
        ),
        const HomeScrollableContent(),
      ],
    );
            },
          ),
        ),
      ),
    );
  }
}



