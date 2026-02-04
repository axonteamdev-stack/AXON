import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import '../../manager/community_patient/patient_community_cubit.dart';

class PatientCommentsSheet extends StatefulWidget {
  final String postId;

  const PatientCommentsSheet({
    super.key,
    required this.postId,
  });

  @override
  State<PatientCommentsSheet> createState() =>
      _PatientCommentsSheetState();
}

class _PatientCommentsSheetState
    extends State<PatientCommentsSheet> {
  final commentController = TextEditingController();
  final replyController = TextEditingController();

  String? replyingToCommentId;

  @override
  Widget build(BuildContext context) {
    final cubit = context.read<PatientCommunityCubit>();

    return Container(
      height: MediaQuery.of(context).size.height * .7,
      padding: EdgeInsets.all(16.w),
      decoration: const BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(24),
        ),
      ),
      child: BlocBuilder<
          PatientCommunityCubit,
          PatientCommunityState>(
        builder: (context, state) {
          final post = state.posts
              .firstWhere((p) => p.id == widget.postId);

          return Column(
            children: [
              const TextApp(
                text: 'Comments',
                weight: AppTextWeight.bold,
              ),
              SizedBox(height: 12.h),

              /// ================= Comments =================
              Expanded(
                child: ListView.separated(
                  itemCount: post.comments.length,
                  separatorBuilder: (_, __) =>
                      SizedBox(height: 14.h),
                  itemBuilder: (_, index) {
                    final comment = post.comments[index];

                    return Column(
                      crossAxisAlignment:
                          CrossAxisAlignment.start,
                      children: [
                        /// Comment bubble
                        Container(
                          padding: EdgeInsets.all(10.w),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF2F3F5),
                            borderRadius:
                                BorderRadius.circular(12),
                          ),
                          child: TextApp(
                            text: comment.text,
                            fontSize: 13,
                          ),
                        ),

                        SizedBox(height: 6.h),

                        /// Actions
                        Row(
                          children: [
                            /// Like
                            GestureDetector(
                              onTap: () {
                                cubit.toggleLikeComment(
                                  widget.postId,
                                  comment.id,
                                );
                              },
                              child: Row(
                                children: [
                                  Icon(
                                    comment.isLiked
                                        ? Icons.favorite
                                        : Icons.favorite_border,
                                    size: 14,
                                    color: comment.isLiked
                                        ? Colors.red
                                        : AppColors.grey,
                                  ),
                                  SizedBox(width: 4.w),
                                  TextApp(
                                    text:
                                        comment.likes.toString(),
                                    fontSize: 11,
                                  ),
                                ],
                              ),
                            ),

                            SizedBox(width: 16.w),

                            /// Reply
                            GestureDetector(
                              onTap: () {
                                setState(() {
                                  replyingToCommentId =
                                      replyingToCommentId ==
                                              comment.id
                                          ? null
                                          : comment.id;
                                });
                              },
                              child: TextApp(
                                text: 'Reply',
                                fontSize: 11,
                                color:
                                    replyingToCommentId ==
                                            comment.id
                                        ? AppColors.primaryColor
                                        : AppColors.grey,
                              ),
                            ),
                          ],
                        ),

                        /// ================= Inline Reply =================
AnimatedSwitcher(
  duration: const Duration(milliseconds: 220),
  child: replyingToCommentId == comment.id
      ? Padding(
          padding: EdgeInsets.only(
            top: 6.h,
            left: 16.w,
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Expanded(
                child: TextField(
                  controller: replyController,
                  autofocus: true,
                  style: TextStyle(
                    fontSize: 13.sp,
                    color: AppColors.black,
                  ),
                  decoration: const InputDecoration(
                    hintText: 'Write a reply...',
                    hintStyle: TextStyle(
                      fontSize: 12,
                      color: AppColors.grey,
                    ),
                    isDense: true,
                    contentPadding: EdgeInsets.symmetric(
                      vertical: 6,
                    ),
                    border: InputBorder.none,
                  ),
                ),
              ),

              /// 👈 المسافة الصغيرة اللي انتي عايزاها
              SizedBox(width: 6.w),

              /// Send icon (في النص)
              SizedBox(
                height: 32,
                width: 32,
                child: Center(
                  child: GestureDetector(
                    onTap: () {
                      if (replyController.text.isEmpty) return;

                      cubit.addReply(
                        widget.postId,
                        comment.id,
                        replyController.text,
                      );

                      replyController.clear();
                      setState(() {
                        replyingToCommentId = null;
                      });
                    },
                    child: Icon(
                      Icons.send,
                      size: 18,
                      color: AppColors.primaryColor,
                    ),
                  ),
                ),
              ),
            ],
          ),
        )
      : const SizedBox.shrink(),
),


                        /// ================= Replies =================
                        if (comment.replies.isNotEmpty)
  Padding(
    padding: EdgeInsets.only(
      left: 20.w,   // indent أوضح شوية
      top: 8.h,
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: List.generate(
        comment.replies.length,
        (index) {
          final reply = comment.replies[index];

          return Padding(
            padding: EdgeInsets.only(
              bottom: index == comment.replies.length - 1
                  ? 0
                  : 8.h, // مسافة بين كل Reply والتاني
            ),
            child: TextApp(
              text: reply.text,
              fontSize: 12,
              color: AppColors.black,
            ),
          );
        },
      ),
    ),
  ),

                      ],
                    );
                  },
                ),
              ),

              SizedBox(height: 10.h),

              /// ================= Add Comment (OLD STYLE) =================
              Row(
                children: [
                  Expanded(
                    child: CustomTextField(
                      controller: commentController,
                      hintText: 'Write a comment...',
                    ),
                  ),
                  SizedBox(width: 6.w),
                  IconButton(
                    icon: const Icon(
                      Icons.send,
                      color: AppColors.primaryColor,
                      size: 22,
                    ),
                    onPressed: () {
                      if (commentController.text.isEmpty)
                        return;

                      cubit.addComment(
                        widget.postId,
                        commentController.text,
                      );

                      commentController.clear();
                    },
                  ),
                ],
              ),
            ],
          );
        },
      ),
    );
  }
}
