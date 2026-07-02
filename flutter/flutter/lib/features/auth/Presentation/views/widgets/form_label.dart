import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class FormLabel extends StatelessWidget {
  final String text;

  const FormLabel({super.key, required this.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(bottom: 6.h),
      child: TextApp(
        text: text,
        fontSize: 12.sp,
        weight: AppTextWeight.regular,
        color: const Color.fromARGB(221, 33, 32, 32),
      ),
    );
  }
}
