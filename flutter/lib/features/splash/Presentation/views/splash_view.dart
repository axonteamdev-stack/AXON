import 'package:flutter/material.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/features/splash/controller/splash_animation_controller.dart';
import 'package:Axon/features/splash/Presentation/widgets/splash_background.dart';
import 'package:Axon/features/splash/Presentation/widgets/splash_center_logo.dart';
import 'package:Axon/features/splash/Presentation/widgets/splash_bottom_letters.dart';

class SplashView extends StatefulWidget {
  const SplashView({super.key});

  @override
  State<SplashView> createState() => _SplashViewState();
}

class _SplashViewState extends State<SplashView>
    with TickerProviderStateMixin {

  final SplashAnimationController _controller =
      SplashAnimationController();

  @override
  void initState() {
    super.initState();

    _controller.init(
      vsync: this,
      onFinished: () {
        if (!mounted) return;
        Navigator.pushReplacementNamed(
          context,
          AppRoutes.onBoarding,
        );
      },
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          const SplashBackground(),

          SplashCenterLogo(
            animation: _controller.xFadeAnimation,
          ),

          SplashBottomLetters(
            animation: _controller.lettersFadeAnimation,
          ),
        ],
      ),
    );
  }
}
