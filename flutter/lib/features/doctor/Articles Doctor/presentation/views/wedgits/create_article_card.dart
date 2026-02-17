import 'dart:io';

import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:image_picker/image_picker.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_button.dart';
import 'package:Axon/core/widgets/text_app.dart';
import '../../manager/doctor_articles_cubit.dart';

class CreateArticleCard extends StatefulWidget {
  const CreateArticleCard({super.key});

  @override
  State<CreateArticleCard> createState() => _CreateArticleCardState();
}

class _CreateArticleCardState extends State<CreateArticleCard> {
  final titleController = TextEditingController();
  final contentController = TextEditingController();
  String? imagePath;

  Future<void> pickImage() async {
    final picker = ImagePicker();
    final image =
        await picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      setState(() {
        imagePath = image.path;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(14.w),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18.r),
        border: Border.all(color: AppColors.primaryColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextApp(
            text: context.l10n.create_article,
            weight: AppTextWeight.semiBold,
            color: AppColors.primaryColor,
          ),
          SizedBox(height: 10.h),
          TextField(
            controller: titleController,
            decoration: InputDecoration(
              hintText: context.l10n.enter_title,
              border: InputBorder.none,
              isDense: true,
            ),
          ),
          SizedBox(height: 2.h),
          TextField(
            controller: contentController,
            maxLines: 3,
            decoration: InputDecoration(
              hintText: context.l10n.enter_content,
              border: InputBorder.none,
              isDense: true,
            ),
          ),
          if (imagePath != null) ...[
            SizedBox(height: 8.h),
            ClipRRect(
              borderRadius: BorderRadius.circular(12.r),
              child: Image.file(
                File(imagePath!),
                height: 130.h,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),
          ],
          SizedBox(height: 6.h),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              GestureDetector(
                onTap: pickImage,
                child: Row(
                  children: [
                    Icon(
                      Icons.image,
                      size: 20.sp,
                      color: AppColors.primaryColor,
                    ),
                    SizedBox(width: 6.w),
                    TextApp(
                      text: context.l10n.add_image,
                      color: AppColors.primaryColor,
                    ),
                  ],
                ),
              ),
              CustomButton(
                text: context.l10n.share,
                width: 90.w,
                height: 34.h,
                onPressed: () {
                  if (titleController.text.isEmpty ||
                      contentController.text.isEmpty) {
                    return;
                  }

                  context.read<DoctorArticlesCubit>().addArticle(
                        title: titleController.text,
                        content: contentController.text,
                        imagePath: imagePath,
                      );

                  titleController.clear();
                  contentController.clear();
                  setState(() {
                    imagePath = null;
                  });
                },
              ),
            ],
          ),
        ],
      ),
    );
  }
}
