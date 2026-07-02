import 'dart:io';

import 'package:Axon/core/style/colors.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ProfileImagePicker extends StatelessWidget {
  const ProfileImagePicker({super.key, this.image, required this.onPick});

  final File? image;
  final VoidCallback onPick;

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      clipBehavior: Clip.none,
      children: [
        GestureDetector(
          onTap: onPick,
          child: CircleAvatar(
            radius: 48.r,
            backgroundColor: const Color(0xFFEAEAEA),
            backgroundImage: image != null ? FileImage(image!) : null,
            child: image == null
                ? Icon(Icons.person, size: 45.r, color: AppColors.grey)
                : null,
          ),
        ),

        Positioned(
          bottom: 0,
          right: -4,
          child: GestureDetector(
            onTap: onPick,
            child: Container(
              width: 28.w,
              height: 28.w,
              decoration: BoxDecoration(
                color: AppColors.primaryColor,
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.white, width: 2),
              ),
              child: const Icon(Icons.add, color: AppColors.white, size: 18),
            ),
          ),
        ),
      ],
    );
  }
}
