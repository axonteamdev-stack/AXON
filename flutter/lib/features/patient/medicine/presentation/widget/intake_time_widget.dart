import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/time_cubit/intake-time_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/time_cubit/intake_time_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class IntakeTime extends StatelessWidget {
  const IntakeTime({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) => IntakeTimeCubit(),
      child: BlocBuilder<IntakeTimeCubit, IntakeTimeState>(
        builder: (context, state) {
          final cubit = context.read<IntakeTimeCubit>();

          return Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // ===== HOUR =====
                GestureDetector(
                  onVerticalDragUpdate: (details) {
                    if (details.delta.dy < -8) {
                      cubit.increaseHour(); // swipe up
                    } else if (details.delta.dy > 8) {
                      cubit.decreaseHour(); // swipe down
                    }
                  },
                  child: Column(
                    children: [
                      TextApp(
                        text: "HOUR",
                        color: AppColors.primaryColor,
                        weight: AppTextWeight.bold,
                        fontSize: 12,
                      ),
                      const SizedBox(height: 8),
                      _box(state.hour.toString().padLeft(2, '0')),
                    ],
                  ),
                ),

                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8),
                  child: Text(":", style: TextStyle(fontSize: 28)),
                ),

                // ===== MINUTE =====
                GestureDetector(
                  onVerticalDragUpdate: (details) {
                    if (details.delta.dy < -8) {
                      cubit.increaseMinute();
                    } else if (details.delta.dy > 8) {
                      cubit.decreaseMinute();
                    }
                  },
                  child: Column(
                    children: [
                      TextApp(
                        text: "MIN",
                        color: AppColors.primaryColor,
                        weight: AppTextWeight.bold,
                        fontSize: 12,
                      ),
                      const SizedBox(height: 8),
                      _box(state.minute.toString().padLeft(2, '0')),
                    ],
                  ),
                ),

                const SizedBox(width: 18),

                // ===== AM / PM =====
                Padding(
                  padding: EdgeInsets.only(top: 24.0.h),
                  child: Column(
                    children: [
                      GestureDetector(
                        onTap: cubit.setAm,
                        child: _amPmBox("AM", state.isAm),
                      ),
                      const SizedBox(height: 8),
                      GestureDetector(
                        onTap: cubit.setPm,
                        child: _amPmBox("PM", !state.isAm),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _box(String value) {
    return Container(
      width: 70.w,
      height: 80.h,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(16.r),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 8)],
      ),
      child: TextApp(text: value, fontSize: 17, weight: AppTextWeight.bold),
    );
  }

  Widget _amPmBox(String text, bool selected) {
    return Container(
      width: 50.w,
      height: 36.h,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: selected ? AppColors.primaryColor : Colors.grey.shade300,
        borderRadius: BorderRadius.circular(12.r),
      ),

      child: TextApp(
        text: text,
        color: selected ? AppColors.white : AppColors.grey,
        weight: AppTextWeight.bold,
        fontSize: 14,
      ),
    );
  }
}
