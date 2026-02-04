import 'dart:io';
import 'package:Axon/features/patient/comunity_patient/data/models/patient_post_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import '../../manager/community_patient/patient_community_cubit.dart';
import 'comments_bottom_sheet.dart';

class PatientPostItemCard extends StatefulWidget {
  final PatientPostModel post;

  const PatientPostItemCard({super.key, required this.post});

  @override
  State<PatientPostItemCard> createState() => _PatientPostItemCardState();
}

class _PatientPostItemCardState extends State<PatientPostItemCard> {
  bool expanded = false;

  @override
  Widget build(BuildContext context) {
    final post = widget.post;

    return Container(
      padding: EdgeInsets.all(14.w),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(18.r),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextApp(
            text: post.title,
            weight: AppTextWeight.bold,
            color: AppColors.primaryColor,
          ),
          SizedBox(height: 6.h),
          GestureDetector(
            onTap: () => setState(() => expanded = !expanded),
            child: TextApp(
              text: post.content,
              fontSize: 13,
              maxLines: expanded ? null : 3,
            ),
          ),
          if (post.imagePath != null) ...[
            SizedBox(height: 8.h),
            ClipRRect(
              borderRadius: BorderRadius.circular(12.r),
              child: Image.file(
                File(post.imagePath!),
                height: 170.h,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),
          ],
          SizedBox(height: 12.h),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _LikeButton(post: post),
              GestureDetector(
               onTap: () {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (_) {
      return BlocProvider.value(
        value: context.read<PatientCommunityCubit>(),
        child: PatientCommentsSheet(
          postId: post.id,
        ),
      );
    },
  );
},

                child: Row(
                  children: [
                    const Icon(Icons.chat_bubble_outline,
                        size: 18, color: AppColors.grey),
                    SizedBox(width: 4.w),
                    TextApp(
                      text: post.commentsCount.toString(),
                      fontSize: 12,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _LikeButton extends StatelessWidget {
  final PatientPostModel post;

  const _LikeButton({required this.post});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        context
            .read<PatientCommunityCubit>()
            .toggleLikePost(post.id);
      },
      child: Row(
        children: [
          Icon(
            post.isLiked ? Icons.favorite : Icons.favorite_border,
            size: 18,
            color: post.isLiked ? Colors.red : AppColors.grey,
          ),
          SizedBox(width: 4.w),
          TextApp(text: post.likes.toString(), fontSize: 12),
        ],
      ),
    );
  }
}
