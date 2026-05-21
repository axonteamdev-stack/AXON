
import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/comunity_patient/data/models/community_post_model.dart';
import 'package:Axon/features/patient/comunity_patient/domain/entities/community_post_entity.dart';
import 'package:Axon/features/patient/comunity_patient/presentation/manager/community_patient/patient_community_cubit.dart';
import 'package:Axon/features/patient/comunity_patient/presentation/views/widgets/comments_bottom_sheet.dart';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class PatientPostItemCard
    extends StatefulWidget {

  final CommunityPostEntity post;

  const PatientPostItemCard({
    super.key,
    required this.post,
  });

  @override
  State<PatientPostItemCard>
      createState() =>
          _PatientPostItemCardState();
}

class _PatientPostItemCardState
    extends State<
        PatientPostItemCard> {

  bool expanded = false;

  @override
  Widget build(BuildContext context) {

    final post = widget.post;

    return Container(

      padding:
          EdgeInsets.all(
        16.w,
      ),

      decoration: BoxDecoration(

        color:
            AppColors.white,

        borderRadius:
            BorderRadius.circular(
          18.r,
        ),

        border: Border.all(

          color:
              AppColors.grey
                  .withOpacity(
            0.15,
          ),

          width: 1,
        ),

        boxShadow: [

          BoxShadow(

            color:
                AppColors.black
                    .withOpacity(
              0.08,
            ),

            blurRadius: 18,

            spreadRadius: 2,

            offset:
                const Offset(
              0,
              8,
            ),
          ),
        ],
      ),

      child: Column(

        crossAxisAlignment:
            CrossAxisAlignment.start,

        children: [

          // ================= AUTHOR =================

          Row(

            children: [

              CircleAvatar(

                radius: 22.r,

                backgroundColor:
                    AppColors.primaryColor
                        .withOpacity(
                  0.1,
                ),

                backgroundImage:
                    post.authorImage !=
                            null
                        ? NetworkImage(
                            "https://tender-morna-axon-fp-b76b6646.koyeb.app${post.authorImage}",
                          )
                        : null,

                child:
                    post.authorImage ==
                            null
                        ? Icon(
                            Icons.person,
                            color: AppColors
                                .primaryColor,
                            size: 22.sp,
                          )
                        : null,
              ),

              SizedBox(
                width: 10.w,
              ),

              Expanded(

                child: Column(

                  crossAxisAlignment:
                      CrossAxisAlignment
                          .start,

                  children: [

                    TextApp(

                      text:
                          post.authorName,

                      weight:
                          AppTextWeight
                              .bold,

                      fontSize: 14,
                    ),

                    SizedBox(
                      height: 2.h,
                    ),

                    TextApp(

                      text:
                          "community",

                      fontSize: 11,

                      color:
                          AppColors
                              .grey,
                    ),
                  ],
                ),
              ),
            ],
          ),

          SizedBox(
            height: 14.h,
          ),

          // ================= TITLE =================

          TextApp(

            text:
                post.title,

            weight:
                AppTextWeight.bold,

            color:
                AppColors.primaryColor,

            fontSize: 16,
          ),

          SizedBox(
            height: 10.h,
          ),

          // ================= CONTENT =================

          GestureDetector(

            onTap: () {

              setState(() {

                expanded =
                    !expanded;
              });
            },

            child: TextApp(

              text:
                  post.content,

              maxLines:
                  expanded
                      ? null
                      : 3,

              fontSize: 14,
            ),
          ),

          if (post.content.length >
              120)

            Padding(

              padding:
                  EdgeInsets.only(
                top: 4.h,
              ),

              child: TextApp(

                text:
                    expanded
                        ? context
                            .l10n
                            .show_less
                        : context
                            .l10n
                            .read_more,

                fontSize: 11,

                color:
                    AppColors
                        .primaryColor,
              ),
            ),

          // ================= IMAGE =================

          if (post.image != null &&
              post.image!
                  .isNotEmpty) ...[

            SizedBox(
              height: 12.h,
            ),

            ClipRRect(

              borderRadius:
                  BorderRadius.circular(
                14.r,
              ),

              child: Image.network(

                "https://tender-morna-axon-fp-b76b6646.koyeb.app${post.image}",

                height: 190.h,

                width:
                    double.infinity,

                fit: BoxFit.cover,

                errorBuilder:
                    (_, __, ___) {

                  return Container(

                    height: 190.h,

                    alignment:
                        Alignment.center,

                    color: Colors.grey
                        .shade200,

                    child: const Icon(
                      Icons
                          .broken_image,
                    ),
                  );
                },
              ),
            ),
          ],

          SizedBox(
            height: 16.h,
          ),

          // ================= ACTIONS =================

          Row(

            mainAxisAlignment:
                MainAxisAlignment
                    .spaceBetween,

            children: [

              // LIKE

              Row(

                children: [

                  Icon(

                    Icons.favorite_border,

                    color: Colors.red,

                    size: 20.sp,
                  ),

                  SizedBox(
                    width: 5.w,
                  ),

                  const TextApp(
                    text: "0",
                    fontSize: 13,
                  ),
                ],
              ),

              // COMMENTS

              GestureDetector(

              onTap: () {

  showModalBottomSheet(

    context: context,

    isScrollControlled: true,

    backgroundColor: Colors.transparent,

    builder: (_) => BlocProvider.value(

      value:
          context.read<PatientCommunityCubit>(),

      child: CommentsBottomSheet(
        postId: post.id,
      ),
    ),
  );
},
                child: Row(

                  children: [

                    Icon(

                      Icons
                          .chat_bubble_outline,

                      size: 20.sp,

                      color:
                          AppColors
                              .grey,
                    ),

                    SizedBox(
                      width: 5.w,
                    ),

                   TextApp(
  text: post.commentsCount.toString(),
  fontSize: 13,
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