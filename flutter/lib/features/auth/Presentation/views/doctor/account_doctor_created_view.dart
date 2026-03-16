import 'dart:async';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:flutter/material.dart';

class AccountDoctorCreatedView extends StatefulWidget {
  const AccountDoctorCreatedView({super.key});

  @override
  State<AccountDoctorCreatedView> createState() => _AccountDoctorCreatedViewState();
}

class _AccountDoctorCreatedViewState extends State<AccountDoctorCreatedView>
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

    _scaleAnimation =
        CurvedAnimation(parent: _controller, curve: Curves.elasticOut);

    _opacityAnimation =
        Tween<double>(begin: 0, end: 1).animate(_controller);

    _controller.forward();

    Timer(const Duration(seconds: 2), () {
      Navigator.pushNamedAndRemoveUntil(
        context,
        AppRoutes.doctorMain,
        (route) => false,
      );
    });
  }

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
                const TextApp(
                  text: "Account Created Successfully 🎉",
                  weight: AppTextWeight.bold,
                  fontSize: 20,
                  color: AppColors.black,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                const TextApp(
                  text: "Welcome! Redirecting to home...",
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
