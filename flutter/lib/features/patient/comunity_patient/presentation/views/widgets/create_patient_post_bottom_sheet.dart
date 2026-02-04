import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:image_picker/image_picker.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/core/widgets/text_app.dart';
import '../../manager/community_patient/patient_community_cubit.dart';

class CreatePatientPostBottomSheet extends StatefulWidget {
  const CreatePatientPostBottomSheet({super.key});

  @override
  State<CreatePatientPostBottomSheet> createState() =>
      _CreatePatientPostBottomSheetState();
}

class _CreatePatientPostBottomSheetState
    extends State<CreatePatientPostBottomSheet> {
  final titleController = TextEditingController();
  final contentController = TextEditingController();

  String? imagePath;

  Future<void> _pickImage() async {
    final image =
        await ImagePicker().pickImage(source: ImageSource.gallery);
    if (image != null) {
      setState(() => imagePath = image.path);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: MediaQuery.of(context).viewInsets,
      child: Container(
        padding: EdgeInsets.all(16.w),
        decoration: const BoxDecoration(
          color: AppColors.white,
          borderRadius:
              BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const TextApp(
              text: 'Create Post',
              weight: AppTextWeight.bold,
            ),
            SizedBox(height: 12.h),

            /// Title
            CustomTextField(
              controller: titleController,
              hintText: 'Post title',
            ),
            SizedBox(height: 10.h),

            /// Content
            CustomTextField(
              controller: contentController,
              hintText: 'Write something...',
            ),

            /// Image preview
            if (imagePath != null) ...[
              SizedBox(height: 12.h),
              Stack(
                alignment: Alignment.topRight,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12.r),
                    child: Image.file(
                      File(imagePath!),
                      height: 150.h,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close,
                        color: Colors.white),
                    onPressed: () {
                      setState(() => imagePath = null);
                    },
                  ),
                ],
              ),
            ],

            SizedBox(height: 12.h),

            /// Actions
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                GestureDetector(
                  onTap: _pickImage,
                  child: Row(
                    children: const [
                      Icon(Icons.image,
                          color: AppColors.primaryColor),
                      SizedBox(width: 6),
                      TextApp(
                        text: 'Add Image',
                        color: AppColors.primaryColor,
                      ),
                    ],
                  ),
                ),

                ElevatedButton(
                  onPressed: () {
                    if (titleController.text.isEmpty ||
                        contentController.text.isEmpty) return;

                    context
                        .read<PatientCommunityCubit>()
                        .addPost(
                          title: titleController.text,
                          content: contentController.text,
                          imagePath: imagePath,
                        );

                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primaryColor,
                    padding: EdgeInsets.symmetric(
                      horizontal: 24.w,
                      vertical: 10.h,
                    ),
                  ),
                  child: const TextApp(
                    text: 'Share',
                    color: AppColors.white,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
