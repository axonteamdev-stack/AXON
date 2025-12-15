import 'package:flutter/material.dart';

class SplashBottomLetters extends StatelessWidget {
  final Animation<double> animation;

  const SplashBottomLetters({
    super.key,
    required this.animation,
  });

  @override
  Widget build(BuildContext context) {
    return Positioned(
      bottom: MediaQuery.of(context).size.height / 2 - 87,
      left: MediaQuery.of(context).size.width / 2 - 73,
      width: 140,
      child: AnimatedBuilder(
        animation: animation,
        builder: (context, child) {
          final start = animation.value - 0.005;
          final end = animation.value - 0.8;

          return ShaderMask(
            shaderCallback: (bounds) {
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
                const SizedBox(width: 40),
                Image.asset("assets/logo/O.png"),
                Image.asset("assets/logo/N.png"),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
