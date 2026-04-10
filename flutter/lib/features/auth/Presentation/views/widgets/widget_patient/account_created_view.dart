import 'dart:async';
import 'package:Axon/core/extensions/context_extension.dart';
import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/service/shared_pref/pref_keys.dart';
import 'package:Axon/core/service/shared_pref/shared_pref.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';

class AccountCreatedView extends StatefulWidget {
  const AccountCreatedView({super.key});

  @override
  State<AccountCreatedView> createState() => _AccountCreatedViewState();
}

class _AccountCreatedViewState extends State<AccountCreatedView>
    with SingleTickerProviderStateMixin {

  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _opacityAnimation;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );

    _scaleAnimation = CurvedAnimation(
      parent: _controller,
      curve: Curves.elasticOut,
    );

    _opacityAnimation = Tween<double>(begin: 0, end: 1).animate(_controller);

    _controller.forward();

    Timer(const Duration(seconds: 2), () {
       Navigator.pushReplacementNamed(
      context,
      AppRoutes.patientMain,
    );
     
     
    });
  }         

//   void _handleNavigation() async {

//   await Future.delayed(const Duration(milliseconds: 300));

//   final role = SharedPref().getString(PrefKeys.userRole);

//   print("========== ACCOUNT CREATED DEBUG ==========");
//   print("Role from SharedPref: $role");
//   print("===========================================");

//   final normalizedRole = role?.toLowerCase().trim();

//   if (normalizedRole == "doctor") {

//     print("➡️ Navigate to DOCTOR HOME");

//     Navigator.pushReplacementNamed(
//       context,
//       AppRoutes.doctorMain,
//     );

//   } else if (normalizedRole == "patient") {

//     print("➡️ Navigate to PATIENT HOME");

//     Navigator.pushReplacementNamed(
//       context,
//       AppRoutes.patientMain,
//     );

//   } else {

//     print("⚠️ Role still null → retry");

//     Navigator.pushReplacementNamed(
//       context,
//       AppRoutes.patientMain,
//     );
//   }
// }
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      backgroundColor: AppColors.white,

      body: Center(
        child: FadeTransition(
          opacity: _opacityAnimation,

          child: ScaleTransition(
            scale: _scaleAnimation,

            child: Column(
              mainAxisSize: MainAxisSize.min,

              children: [

                Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    color: AppColors.primaryColor.withOpacity(.1),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check_circle,
                    color: AppColors.primaryColor,
                    size: 80,
                  ),
                ),

                const SizedBox(height: 24),

                TextApp(
                  text: context.l10n.account_created,
                  weight: AppTextWeight.bold,
                  fontSize: 20,
                  color: AppColors.black,
                  textAlign: TextAlign.center,
                ),

                const SizedBox(height: 8),

                TextApp(
                  text: context.l10n.redirecting_home,
                  fontSize: 14,
                  color: Colors.grey,
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}