import 'package:Axon/core/di/di.dart';
import 'package:Axon/core/style/colors.dart';
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
      create: (_) => getIt<HomeCubit>()..fetchHomeArticles(),
      child: Scaffold(
        backgroundColor: AppColors.white,
        body: SafeArea(
          child: BlocBuilder<HomeCubit, HomeState>(
            builder: (context, state) {

              if (state is HomeLoading || state is HomeInitial) {
                return const Center(child: CircularProgressIndicator());
              }

              if (state is HomeError) {
                return Center(child: Text(state.failure.toString()));
              }

              if (state is HomeSuccess) {
                final articles = state.articlesEntity?.articles ?? [];

                return Column(
                  children: [
                    const HomeHeader(
                      name: "Abdullah",
                      notificationCount: 5,
                    ),
                    HomeScrollableContent(
                      articles: articles,
                    ),
                  ],
                );
              }

              return const SizedBox();
            },
          ),
        ),
      ),
    );
  }
}