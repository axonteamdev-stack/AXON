import 'package:Axon/features/patient/comunity_patient/presentation/views/widgets/reply_bottom_sheet.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import '../../manager/community_patient/patient_community_cubit.dart';

class PatientCommentsSheet extends StatelessWidget {
  final String postId;

  const PatientCommentsSheet({
    super.key,
    required this.postId,
  });

  @override
  Widget build(BuildContext context) {
    final controller = TextEditingController();

    return Container(
      height: MediaQuery.of(context).size.height * 0.7,
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
      decoration: const BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: BlocBuilder<PatientCommunityCubit, PatientCommunityState>(
        builder: (context, state) {
          final post =
              state.posts.firstWhere((p) => p.id == postId);

          return Column(
            children: [
              const TextApp(
                text: 'Comments',
                weight: AppTextWeight.bold,
              ),
              SizedBox(height: 12.h),

              Expanded(
                child: ListView.separated(
                  itemCount: post.comments.length,
                  separatorBuilder: (_, __) =>
                      SizedBox(height: 12.h),
                  itemBuilder: (_, index) {
                    final comment = post.comments[index];

                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: EdgeInsets.all(10.w),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF2F3F5),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: TextApp(
                            text: comment.text,
                            fontSize: 13,
                          ),
                        ),
                        SizedBox(height: 6.h),
                        Row(
                          children: [
                            GestureDetector(
                              onTap: () {
                                context
                                    .read<PatientCommunityCubit>()
                                    .toggleLikeComment(
                                      postId,
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
                           GestureDetector(
  onTap: () {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) {
        return BlocProvider.value(
          value: context.read<PatientCommunityCubit>(),
          child: ReplyBottomSheet(
            postId: postId,
            commentId: comment.id,
          ),
        );
      },
    );
  },
  child: const TextApp(
    text: 'Reply',
    fontSize: 11,
    color: AppColors.primaryColor,
  ),
),

                          ],
                        ),
                      ],
                    );
                  },
                ),
              ),

              /// Add comment
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: controller,
                      decoration: const InputDecoration(
                        hintText: 'Write a comment...',
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(
                      Icons.send,
                      color: AppColors.primaryColor,
                    ),
                    onPressed: () {
                      if (controller.text.isEmpty) return;

                      context
                          .read<PatientCommunityCubit>()
                          .addComment(
                            postId,
                            controller.text,
                          );

                      controller.clear();
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
