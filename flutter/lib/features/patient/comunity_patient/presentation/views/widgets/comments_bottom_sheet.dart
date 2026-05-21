import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/comunity_patient/presentation/manager/community_patient/patient_community_cubit.dart';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class CommentsBottomSheet
    extends StatefulWidget {

  final String postId;

  const CommentsBottomSheet({
    super.key,
    required this.postId,
  });

  @override
  State<CommentsBottomSheet>
      createState() =>
          _CommentsBottomSheetState();
}

class _CommentsBottomSheetState
    extends State<
        CommentsBottomSheet> {

  final TextEditingController
      commentController =
          TextEditingController();

  @override
  void initState() {

    super.initState();

    Future.microtask(() {

      context
          .read<
              PatientCommunityCubit>()
          .getComments(
            postId:
                widget.postId,
          );
    });
  }

  @override
  Widget build(BuildContext context) {

    return Container(

      height:
          MediaQuery.of(context)
                  .size
                  .height *
              .75,

      padding:
          EdgeInsets.all(
        16.w,
      ),

      decoration:
          const BoxDecoration(

        color: Colors.white,

        borderRadius:
            BorderRadius.vertical(
          top: Radius.circular(
            24,
          ),
        ),
      ),

      child: Column(

        children: [

          Container(

            width: 60.w,

            height: 5.h,

            decoration:
                BoxDecoration(

              color: Colors.grey[300],

              borderRadius:
                  BorderRadius.circular(
                20,
              ),
            ),
          ),

          SizedBox(
            height: 16.h,
          ),

          const TextApp(
            text: "Comments",
            fontSize: 18,
            // fontWeight:
            //     FontWeight.bold,
          ),

          SizedBox(
            height: 16.h,
          ),

          Expanded(

            child: BlocBuilder<
                PatientCommunityCubit,
                PatientCommunityState>(

              builder:
                  (context, state) {

                // LOADED

                if (state
                    is PatientCommentsLoaded) {

                  final comments =
                      state
                          .comments
                          .comments;

                  if (comments
                      .isEmpty) {

                    return const Center(
                      child: TextApp(
                        text:
                            "No Comments Yet",
                      ),
                    );
                  }

                  return ListView.separated(

                    itemCount:
                        comments.length,

                    separatorBuilder:
                        (_, __) =>
                            SizedBox(
                      height: 12.h,
                    ),

                    itemBuilder:
                        (_, index) {

                      final comment =
                          comments[
                              index];

                      return Container(

                        padding:
                            EdgeInsets.all(
                          12.w,
                        ),

                        decoration:
                            BoxDecoration(

                          color:
                              Colors.grey
                                  .shade100,

                          borderRadius:
                              BorderRadius.circular(
                            14,
                          ),
                        ),

                        child: Column(

                          crossAxisAlignment:
                              CrossAxisAlignment
                                  .start,

                          children: [

                            TextApp(
                              text:
                                  comment.authorName,
                              // fontWeight:
                              //     FontWeight.bold,
                            ),

                            SizedBox(
                              height: 6.h,
                            ),

                            TextApp(
                              text:
                                  comment.content,
                            ),
                          ],
                        ),
                      );
                    },
                  );
                }

                // ERROR

                if (state
                    is PatientCommunityError) {

                  return Center(
                    child: TextApp(
                      text: state
                          .failure
                          .toString(),
                    ),
                  );
                }

                // LOADING

                return const Center(
                  child:
                      CircularProgressIndicator(),
                );
              },
            ),
          ),

          SizedBox(
            height: 12.h,
          ),

          Row(

            children: [

              Expanded(

                child: TextField(

                  controller:
                      commentController,

                  decoration:
                      InputDecoration(

                    hintText:
                        "Write a comment...",

                    filled: true,

                    fillColor:
                        Colors.grey
                            .shade100,

                    border:
                        OutlineInputBorder(

                      borderRadius:
                          BorderRadius.circular(
                        14,
                      ),

                      borderSide:
                          BorderSide.none,
                    ),
                  ),
                ),
              ),

              SizedBox(
                width: 8.w,
              ),

              IconButton(

                onPressed: () async {

                  if (commentController
                      .text
                      .trim()
                      .isEmpty) {
                    return;
                  }

                  await context
                      .read<
                          PatientCommunityCubit>()
                      .addComment(

                        postId:
                            widget.postId,

                        content:
                            commentController
                                .text
                                .trim(),
                      );

                  if (!mounted) {
                    return;
                  }

                  commentController
                      .clear();

                  await context
                      .read<
                          PatientCommunityCubit>()
                      .getComments(

                        postId:
                            widget.postId,
                      );
                },

                icon: const Icon(
                  Icons.send,
                  color:
                      AppColors.primaryColor,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}