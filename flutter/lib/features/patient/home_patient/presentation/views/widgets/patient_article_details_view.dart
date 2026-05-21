import 'package:Axon/core/di/di.dart';
import 'package:Axon/core/network/endpoints.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/home_patient/presentation/manager/article_patient/article_details_cubit.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class PatientArticleDetailsView
    extends StatelessWidget {

  final String articleId;

  const PatientArticleDetailsView({

    super.key,

    required this.articleId,
  });

  @override
  Widget build(BuildContext context) {

    return BlocProvider(

      create:
          (_) =>
              getIt<ArticleDetailsCubit>()
                ..getArticleById(
                  articleId,
                ),

      child: Scaffold(

        backgroundColor:
            AppColors.white,

        body: BlocBuilder<
            ArticleDetailsCubit,
            ArticleDetailsState>(

          builder:
              (context, state) {

            // LOADING

            if (state
                is ArticleDetailsLoading) {

              return const Center(
                child:
                    CircularProgressIndicator(),
              );
            }

            // ERROR

            if (state
                is ArticleDetailsError) {

              return Center(
                child: TextApp(
                  text: state.failure
                      .toString(),
                ),
              );
            }

            // SUCCESS

            if (state
                is ArticleDetailsSuccess) {

              final article =
                  state.article;

              final imageUrl =
                  "${Endpoints.baseUrlImage}${article.image}";

              return Stack(

                children: [

                  Column(

                    children: [

                      SizedBox(

                        height: 300,

                        width:
                            double.infinity,

                        child: ClipRRect(

                          borderRadius:
                              const BorderRadius.vertical(

                            bottom:
                                Radius.circular(
                              12,
                            ),
                          ),

                          child: Stack(

                            fit:
                                StackFit.expand,

                            children: [

                              /// IMAGE

                              article.image
                                      .isNotEmpty
                                  ? Image.network(

                                      imageUrl,

                                      fit:
                                          BoxFit.cover,

                                      errorBuilder:
                                          (
                                        context,
                                        error,
                                        stackTrace,
                                      ) {

                                        return Container(

                                          color:
                                              Colors.grey[200],

                                          child:
                                              const Center(

                                            child:
                                                Icon(

                                              Icons.image_not_supported,

                                              size:
                                                  50,

                                              color:
                                                  Colors.grey,
                                            ),
                                          ),
                                        );
                                      },
                                    )
                                  : Container(

                                      color:
                                          Colors.grey[200],

                                      child:
                                          const Center(

                                        child:
                                            Icon(

                                          Icons.image_not_supported,

                                          size:
                                              50,

                                          color:
                                              Colors.grey,
                                        ),
                                      ),
                                    ),

                              /// GRADIENT

                              Container(

                                decoration:
                                    BoxDecoration(

                                  gradient:
                                      LinearGradient(

                                    begin:
                                        Alignment.bottomCenter,

                                    end:
                                        Alignment.topCenter,

                                    colors: [

                                      AppColors.black
                                          .withOpacity(
                                        0.55,
                                      ),

                                      Colors.transparent,
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      /// CONTENT

                      Expanded(

                        child:
                            SingleChildScrollView(

                          padding:
                              const EdgeInsets.fromLTRB(

                            20,

                            20,

                            20,

                            32,
                          ),

                          child:
                              Column(

                            crossAxisAlignment:
                                CrossAxisAlignment.start,

                            children: [

                              TextApp(

                                text:
                                    article.title,

                                weight:
                                    AppTextWeight.bold,

                                fontSize:
                                    22,

                                color:
                                    AppColors.primaryColor,
                              ),

                              const SizedBox(
                                height: 16,
                              ),

                              TextApp(

                                text:
                                    article.content,

                                fontSize:
                                    14,

                                height:
                                    1.7,

                                color:
                                    AppColors.black,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),

                  /// CLOSE BUTTON

                  Positioned(

                    top: 40,

                    right: 18,

                    child:
                        GestureDetector(

                      onTap:
                          () =>
                              Navigator.pop(
                        context,
                      ),

                      child:
                          Container(

                        width: 34,

                        height: 34,

                        decoration:
                            BoxDecoration(

                          shape:
                              BoxShape.circle,

                          color:
                              AppColors.black
                                  .withOpacity(
                            0.35,
                          ),
                        ),

                        child:
                            const Icon(

                          Icons.close,

                          size: 18,

                          color:
                              AppColors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              );
            }

            return const SizedBox();
          },
        ),
      ),
    );
  }
}