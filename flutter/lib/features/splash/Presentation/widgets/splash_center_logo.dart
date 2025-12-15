import 'package:flutter/material.dart';

class SplashCenterLogo extends StatelessWidget {
  final Animation<double> animation;

  const SplashCenterLogo({
    super.key,
    required this.animation,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: AnimatedBuilder(
        animation: animation,
        builder: (context, child) {
          final start = animation.value.clamp(0.0, 1.0);
          final end = (start + 0.1).clamp(0.0, 1.0);

          return ShaderMask(
            shaderCallback: (bounds) {
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
        child: Image.asset('assets/logo/X.png'),
      ),
    );
  }
}
