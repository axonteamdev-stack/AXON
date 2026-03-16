// import 'package:flutter/material.dart';
// import 'package:flutter_bloc/flutter_bloc.dart';

// import 'time_cubit.dart';

// class TimeContainer extends StatelessWidget {
//   const TimeContainer({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return BlocBuilder<TimeCubit, TimeState>(
//       builder: (context, state) {
//         final cubit = context.read<TimeCubit>();

//         return Container(
//           padding: const EdgeInsets.all(16),
//           decoration: BoxDecoration(
//             borderRadius: BorderRadius.circular(20),
//             border: Border.all(color: Colors.grey.shade300),
//           ),
//           child: Row(
//             mainAxisAlignment: MainAxisAlignment.center,
//             children: [
//               TimeBox(
//                 label: "HOUR",
//                 value: state.hour.toString().padLeft(2, '0'),
//                 onTap: () => cubit.changeHour(),
//               ),
//               const Padding(
//                 padding: EdgeInsets.symmetric(horizontal: 8),
//                 child: Text(":", style: TextStyle(fontSize: 28)),
//               ),
//               TimeBox(
//                 label: "MIN",
//                 value: state.minute.toString().padLeft(2, '0'),
//                 onTap: () => cubit.changeMinute(),
//               ),
//               const SizedBox(width: 16),
//               Column(
//                 children: [
//                   AmPmButton(
//                     text: "AM",
//                     selected: state.isAm,
//                     onTap: () => cubit.setAmPm(true),
//                   ),
//                   const SizedBox(height: 8),
//                   AmPmButton(
//                     text: "PM",
//                     selected: !state.isAm,
//                     onTap: () => cubit.setAmPm(false),
//                   ),
//                 ],
//               )
//             ],
//           ),
//         );
//       },
//     );
//   }
// }
