// import 'package:Axon/core/widgets/text_app.dart';
// import 'package:flutter/material.dart';
// import 'package:flutter_screenutil/flutter_screenutil.dart';

// class SpecializationDropdown extends StatelessWidget {
//   final String? value;
//   final Function(String?)? onChanged;

//   const SpecializationDropdown({
//     super.key,
//     this.value,
//     this.onChanged,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return Container(
//       width: double.infinity,
//       padding: EdgeInsets.symmetric(horizontal: 12.w),
//       decoration: BoxDecoration(
//         border: Border.all(color: Colors.grey.shade300),
//         borderRadius: BorderRadius.circular(10),
//       ),
//       child: DropdownButtonHideUnderline(
//         child: DropdownButton<String>(
//           value: value,
//           hint: TextApp(
//             text: "Select Specialization",
//             fontSize: 14.sp,
//             weight: AppTextWeight.regular,
//             color: Colors.grey,
//           ),
//           dropdownColor: Colors.white,
//           items: const [
//             DropdownMenuItem(value: "Cardiology", child: Text("Cardiology")),
//             DropdownMenuItem(value: "Neurology", child: Text("Neurology")),
//             DropdownMenuItem(value: "Pediatrics", child: Text("Pediatrics")),
//             DropdownMenuItem(value: "Dentistry", child: Text("Dentistry")),
//           ],
//           onChanged: onChanged,
//         ),
//       ),
//     );
//   }
// }
