import 'package:Axon/core/routes/app_routes.dart';
<<<<<<< HEAD
import 'package:flutter/material.dart';

void main() {
  runApp(app());
}

class app extends StatelessWidget {
  const app({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(home: SplashView());
  }
}

=======
import 'package:Axon/features/splash/Presentation/widgets/splash_background.dart';
import 'package:Axon/features/splash/Presentation/widgets/splash_bottom_letters.dart';
import 'package:Axon/features/splash/Presentation/widgets/splash_center_logo.dart';
import 'package:Axon/features/splash/controller/splash_animation_controller.dart';
import 'package:flutter/material.dart';

>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
class SplashView extends StatefulWidget {
  const SplashView({super.key});

  @override
  State<SplashView> createState() => _SplashViewState();
}

class _SplashViewState extends State<SplashView> with TickerProviderStateMixin {
<<<<<<< HEAD
  late AnimationController _animationController;
  late AnimationController _animationLeftRight;
  late Animation<double> _fadeAnimation;
  late Animation<double> _fadeAnimationLeftRight;
=======
  final SplashAnimationController _controller = SplashAnimationController();
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb

  @override
  void initState() {
    super.initState();
<<<<<<< HEAD
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    );
    _animationLeftRight = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );

    _fadeAnimation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeIn,
    );
    _fadeAnimationLeftRight = CurvedAnimation(
      parent: _animationLeftRight,
      curve: Curves.easeOut,
    );
    _animationController.forward();
    _animationController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        _animationLeftRight.forward();
        Navigator.pushReplacementNamed(context, AppRoutes.onBoarding);
      }
    });
=======

    _controller.init(
      vsync: this,
      onFinished: () {
        if (!mounted) return;
        Navigator.pushReplacementNamed(context, AppRoutes.intro);
      },
    );
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
  }

  @override
  void dispose() {
<<<<<<< HEAD
    _animationController.dispose();
=======
    _controller.dispose();
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
<<<<<<< HEAD
          Center(
            child: AnimatedBuilder(
              animation: _fadeAnimation,
              builder: (BuildContext context, Widget? child) {
                return ShaderMask(
                  shaderCallback: (Rect bounds) {
                    final double start = _fadeAnimation.value.clamp(0.0, 1.0);
                    final double end = (start + 0.1).clamp(0.0, 1.0);
                    return LinearGradient(
                      colors: [
                        Colors.white.withAlpha(255),
                        Colors.white.withAlpha(0),
                      ],
                      stops: [start, end],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    ).createShader(bounds);
                  },
                  blendMode: BlendMode.dstIn,
                  child: child,
                );
              },
              child: Image.asset("assets/logo/X.png"),
            ),
          ),
          Positioned(
            bottom: MediaQuery.of(context).size.height / 2 - 87,
            left: MediaQuery.of(context).size.width / 2 - 73,
            width: 140,
            child: AnimatedBuilder(
              animation: _fadeAnimationLeftRight,
              builder: (BuildContext context, Widget? child) {
                return ShaderMask(
                  shaderCallback: (Rect bounds) {
                    final double start = _fadeAnimationLeftRight.value - 0.005;
                    final double end = _fadeAnimationLeftRight.value;
                    return LinearGradient(
                      colors: [
                        Colors.white.withAlpha(255),
                        Colors.white.withAlpha(0),
                      ],
                      stops: [start, end],
                      begin: Alignment.centerLeft,
                      end: Alignment.centerRight,
                    ).createShader(bounds);
                  },
                  blendMode: BlendMode.dstIn,
                  child: child,
                );
              },
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: SizedBox(
                  height: 50,
                  child: Row(
                    children: [
                      Image.asset("assets/logo/A.png", width: 44),
                      SizedBox(width: 40),
                      Image.asset("assets/logo/O.png"),
                      Image.asset("assets/logo/N.png"),
                    ],
                  ),
                ),
              ),
            ),
          ),
=======
          const SplashBackground(),

          SplashCenterLogo(animation: _controller.xFadeAnimation),

          SplashBottomLetters(animation: _controller.lettersFadeAnimation),
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
        ],
      ),
    );
  }
}
