import 'package:Axon/features/doctor/Articles%20Doctor/presentation/manager/doctor_articles_cubit.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/presentation/views/wedgits/article_header.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/presentation/views/wedgits/article_item_card.dart';
import 'package:Axon/features/doctor/Articles%20Doctor/presentation/views/wedgits/create_article_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';

class DoctorArticlesView extends StatelessWidget {
  const DoctorArticlesView({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => DoctorArticlesCubit(),
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
                  child: BlocBuilder<DoctorArticlesCubit,
                      DoctorArticlesState>(
                    builder: (context, state) {
                      if (state.articles.isEmpty) {
                        return const Center(
                          child: TextApp(
                            text: 'No articles yet',
                            color: AppColors.grey,
                          ),
                        );
                      }

                      return ListView.separated(
                        itemCount: state.articles.length,
                        separatorBuilder: (_, __) =>
                            SizedBox(height: 14.h),
                        itemBuilder: (_, index) =>
                            ArticleItemCard(
                          article: state.articles[index],
                        ),
                      );
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
