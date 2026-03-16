import 'package:animated_toggle_switch/animated_toggle_switch.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/features/onboarding/presentation/manager/language_cubit/language_cubit.dart';

class LanguageSwitch extends StatelessWidget {
  const LanguageSwitch({super.key});

  @override
  Widget build(BuildContext context) {
    final cubit = context.watch<LanguageCubit>();
    final isEnglish = cubit.state.languageCode == 'en';

    return AnimatedToggleSwitch<bool>.dual(
      current: isEnglish,
      first: false,
      second: true,

      height: 28, // ⬅ أكبر شوية
      spacing: 4,
      indicatorSize: const Size(34, 22),

      onChanged: (_) => cubit.toggleLanguage(),

      // indicatorTransition: const ForegroundIndicatorTransition(
      //   curve: Curves.easeInOutCubic,
      //   duration: Duration(milliseconds: 300),
      // ),

      style: ToggleStyle(
        backgroundColor: AppColors.lightGrey.withOpacity(0.6),
        borderRadius: BorderRadius.circular(20),

        // 🔥 Indicator احترافي
        indicatorColor: AppColors.primaryColor,
        indicatorBoxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.15),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),

      textBuilder: (value) {
        final isActive = value == isEnglish;

        return Center(
          child: AnimatedDefaultTextStyle(
            duration: const Duration(milliseconds: 200),
            style: TextStyle(
              fontSize: 11, // ⬅ أوضح
              fontWeight: FontWeight.w700,
              height: 1.1, // ⬅ يحسن العربي
              color:
                   AppColors.primaryColor,
            ),
            child: Text(
              value ? 'EN' : 'عربي',
            ),
          ),
        );
      },
    );
  }
}
