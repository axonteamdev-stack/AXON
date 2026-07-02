// import 'package:flutter/material.dart';
// import 'package:flutter_screenutil/flutter_screenutil.dart';
// import 'package:Axon/core/style/colors.dart';

// class AppSnackBar {
//   static void error(BuildContext context, String message) {
//     _show(
//       context,
//       message,
//       background: Colors.black87,
//       icon: Icons.error_outline,
//     );
//   }

//   static void success(BuildContext context, String message) {
//     _show(
//       context,
//       message,
//       background: AppColors.primaryColor,
//       icon: Icons.check_circle_outline,
//     );
//   }

//   static void warning(BuildContext context, String message) {
//     _show(
//       context,
//       message,
//       background: Colors.orange.shade700,
//       icon: Icons.warning_amber_rounded,
//     );
//   }

//   static void _show(
//     BuildContext context,
//     String message, {
//     required Color background,
//     required IconData icon,
//   }) {
//     ScaffoldMessenger.of(context)
//       ..hideCurrentSnackBar()
//       ..showSnackBar(
//         SnackBar(
//           behavior: SnackBarBehavior.floating,
//           margin: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
//           shape: RoundedRectangleBorder(
//             borderRadius: BorderRadius.circular(14.r),
//           ),
//           backgroundColor: background,
//           elevation: 0,
//           content: Row(
//             crossAxisAlignment: CrossAxisAlignment.center,
//             children: [
//               Icon(icon, color: Colors.white, size: 22.sp),
//               SizedBox(width: 10.w),
//               Expanded(
//                 child: Text(
//                   message,
//                   style: TextStyle(
//                     color: Colors.white,
//                     fontSize: 14.sp,
//                     fontWeight: FontWeight.w500,
//                   ),
//                 ),
//               ),
//             ],
//           ),
//           duration: const Duration(seconds: 2),
//         ),
//       );
//   }
// }
