import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/comunity_patient/data/models/patient_post_model.dart';
import '../../manager/community_patient/patient_community_cubit.dart';
import 'comments_bottom_sheet.dart';

class PatientPostItemCard extends StatefulWidget {
  final PatientPostModel post;

  const PatientPostItemCard({
    super.key,
    required this.post,
  });

  @override
  State<PatientPostItemCard> createState() =>
      _PatientPostItemCardState();
}

class _PatientPostItemCardState extends State<PatientPostItemCard> {
  bool expanded = false;

  @override
  Widget build(BuildContext context) {
    final post = widget.post;

    return Container(
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
    color: AppColors.white,
    borderRadius: BorderRadius.circular(18.r),
    border: Border.all(
      color: AppColors.grey.withOpacity(0.15),
      width: 1,
    ),
    boxShadow: [
      BoxShadow(
        color: AppColors.black.withOpacity(0.08),
        blurRadius: 18,
        spreadRadius: 2,
        offset: const Offset(0, 8),
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
          SizedBox(height: 12.h),

          GestureDetector(
            onTap: () => setState(() => expanded = !expanded),
            child: TextApp(
              text: post.content,
              maxLines: expanded ? null : 3,
            ),
          ),

          if (post.content.length > 120)
            Padding(
              padding: EdgeInsets.only(top: 4.h),
              child: TextApp(
                text: expanded ? 'Show less' : 'Read more',
                fontSize: 11,
                color: AppColors.primaryColor,
              ),
            ),

          if (post.imagePath != null) ...[
            SizedBox(height: 10.h),
            ClipRRect(
              borderRadius: BorderRadius.circular(14.r),
              child: Image.file(
                File(post.imagePath!),
                height: 180.h,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),
          ],

          SizedBox(height: 14.h),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              GestureDetector(
                onTap: () {
                  context
                      .read<PatientCommunityCubit>()
                      .toggleLikePost(post.id);
                },
                child: Row(
                  children: [
                    Icon(
                      post.isLiked
                          ? Icons.favorite
                          : Icons.favorite_border,
                      color:
                          post.isLiked ? Colors.red : AppColors.grey,
                      size: 18,
                    ),
                    SizedBox(width: 4.w),
                    TextApp(
                      text: post.likes.toString(),
                      fontSize: 12,
                    ),
                  ],
                ),
              ),
              GestureDetector(
                onTap: () {
                  showModalBottomSheet(
                    context: context,
                    isScrollControlled: true,
                    backgroundColor: Colors.transparent,
                    builder: (_) => BlocProvider.value(
                      value:
                          context.read<PatientCommunityCubit>(),
                      child: PatientCommentsSheet(
                        postId: post.id,
                      ),
                    ),
                  );
                },
                child: Row(
                  children: [
                    const Icon(
                      Icons.chat_bubble_outline,
                      size: 18,
                      color: AppColors.grey,
                    ),
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
