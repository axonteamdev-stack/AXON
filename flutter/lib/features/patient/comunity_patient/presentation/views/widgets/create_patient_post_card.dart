// import 'dart:io';

// import 'package:Axon/features/patient/comunity_patient/presentation/manager/community_patient/patient_community_cubit.dart';
// import 'package:flutter/material.dart';
// import 'package:flutter_screenutil/flutter_screenutil.dart';
// import 'package:image_picker/image_picker.dart';

// import 'package:Axon/core/style/colors.dart';
// import 'package:Axon/core/widgets/text_app.dart';
// import 'package:Axon/core/widgets/custom_button.dart';
// import 'package:flutter_bloc/flutter_bloc.dart';

// class CreatePatientPostCard extends StatefulWidget {
//   const CreatePatientPostCard({super.key});

//   @override
//   State<CreatePatientPostCard> createState() =>
//       _CreatePatientPostCardState();
// }

// class _CreatePatientPostCardState extends State<CreatePatientPostCard> {
//   final titleController = TextEditingController();
//   final contentController = TextEditingController();
//   String? imagePath;

//   Future<void> pickImage() async {
//     final image =
//         await ImagePicker().pickImage(source: ImageSource.gallery);
//     if (image != null) {
//       setState(() => imagePath = image.path);
//     }
//   }

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       padding: EdgeInsets.all(14.w),
//       decoration: BoxDecoration(
//         borderRadius: BorderRadius.circular(18.r),
//         border: Border.all(color: AppColors.primaryColor),
//       ),
//       child: Column(
//         crossAxisAlignment: CrossAxisAlignment.start,
//         children: [
//           const TextApp(
//             text: 'Create Post',
//             weight: AppTextWeight.semiBold,
//             color: AppColors.primaryColor,
//           ),
//           SizedBox(height: 10.h),
//           TextField(
//             controller: titleController,
//             decoration: const InputDecoration(
//               hintText: 'Post title',
//               border: InputBorder.none,
//             ),
//           ),
//           TextField(
//             controller: contentController,
//             maxLines: 3,
//             decoration: const InputDecoration(
//               hintText: 'Write something...',
//               border: InputBorder.none,
//             ),
//           ),
//           if (imagePath != null) ...[
//             SizedBox(height: 8.h),
//             ClipRRect(
//               borderRadius: BorderRadius.circular(12.r),
//               child: Image.file(
//                 File(imagePath!),
//                 height: 130.h,
//                 width: double.infinity,
//                 fit: BoxFit.cover,
//               ),
//             ),
//           ],
//           SizedBox(height: 8.h),
//           Row(
//             mainAxisAlignment: MainAxisAlignment.spaceBetween,
//             children: [
//               GestureDetector(
//                 onTap: pickImage,
//                 child: Row(
//                   children: const [
//                     Icon(Icons.image, color: AppColors.primaryColor),
//                     SizedBox(width: 6),
//                     TextApp(
//                       text: 'Add Image',
//                       color: AppColors.primaryColor,
//                     ),
//                   ],
//                 ),
//               ),
//               CustomButton(
//                 text: 'Share',
//                 width: 90.w,
//                 height: 34.h,
//                 onPressed: () {
//                   if (titleController.text.isEmpty ||
//                       contentController.text.isEmpty) return;

//                   context.read<PatientCommunityCubit>().addPost(
//                         title: titleController.text,
//                         content: contentController.text,
//                         imagePath: imagePath,
//                       );

//                   titleController.clear();
//                   contentController.clear();
//                   setState(() => imagePath = null);
//                 },
//               ),
//             ],
//           ),
//         ],
//       ),
//     );
//   }
// }
