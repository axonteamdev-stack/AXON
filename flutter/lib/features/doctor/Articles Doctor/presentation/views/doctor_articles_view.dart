import 'package:Axon/core/di/di.dart';
import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/presentation/manager/doctor_articles_cubit.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/presentation/manager/doctor_articles_state.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/presentation/views/wedgits/article_header.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/presentation/views/wedgits/article_item_card.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/presentation/views/wedgits/create_article_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class DoctorArticlesView extends StatelessWidget {
  const DoctorArticlesView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => getIt<DoctorArticlesCubit>(),
      child: Scaffold(
        backgroundColor: AppColors.white,
        body: SafeArea(
          child: Padding(
            padding: EdgeInsets.all(16.w),
            child: Column(
              children: [

                const ArticleHeader(),

                SizedBox(height: 16.h),

                const CreateArticleCard(),

                SizedBox(height: 20.h),

                Expanded(
                  child: BlocBuilder<
                      DoctorArticlesCubit,
                      DoctorArticlesState>(
                    builder: (context, state) {

                      // Loading
                      if (state is DoctorArticlesLoading) {
                        return const Center(
                          child: CircularProgressIndicator(),
                        );
                      }

                      // Error
                      if (state is DoctorArticlesError) {
                        return Center(
                          child: Text(
                            state.failure.toString(),
                          ),
                        );
                      }

                      // Success
                      if (state is DoctorArticlesSuccess) {

                        final article = state.articleEntity?.article;

                        if (article == null) {
                          return Center(
                            child: TextApp(
                              text: context.l10n.no_articles,
                              color: AppColors.grey,
                            ),
                          );
                        }

                        return ListView(
                          children: [
                            ArticleItemCard(
                              article: article,
                            ),
                          ],
                        );
                      }

                      return const SizedBox();
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}