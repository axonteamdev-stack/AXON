<<<<<<< HEAD
=======
import 'package:Axon/core/extensions/localization_ext.dart';
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class OrDivider extends StatelessWidget {
  const OrDivider({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: Divider(color: Colors.grey.shade300, thickness: 1)),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 10.w),
<<<<<<< HEAD
          child: TextApp(text: "OR", color: AppColors.grey),
=======
          child: TextApp(text: context.l10n.or, color: AppColors.grey),
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
        ),
        Expanded(child: Divider(color: Colors.grey.shade300, thickness: 1)),
      ],
    );
  }
}
