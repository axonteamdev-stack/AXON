<<<<<<< HEAD
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
=======
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb
import 'package:flutter/material.dart';

extension ContextExt on BuildContext {
  //color
<<<<<<< HEAD
  AppColors get color => AppColors();

  // images
  AppImages get assets => AppImages();

  // style
  TextStyle get textStyle => Theme.of(this).textTheme.displaySmall!;
=======
  // AppColors get color => AppColors();

  // // images
  // AppImages get assets => AppImages();

  // // style
  // TextStyle get textStyle => Theme.of(this).textTheme.displaySmall!;
>>>>>>> 0dd14dd95286373c6535852ed9ea6f14b97cafeb

  // //Language
  //   String translate(String langkey) {
  //     return AppLocalizations.of(this)!.translate(langkey).toString();
  //   }

  //Navigation

  Future<dynamic> pushName(String routeName, {Object? arguments}) {
    return Navigator.of(this).pushNamed(routeName, arguments: arguments);
  }

  Future<dynamic> pushReplacementNamed(String routeName, {Object? arguments}) {
    return Navigator.of(
      this,
    ).pushReplacementNamed(routeName, arguments: arguments);
  }

  Future<dynamic> pushNamedAndRemoveUntil(
    String routeName, {
    Object? arguments,
  }) {
    return Navigator.of(
      this,
    ).pushNamedAndRemoveUntil(routeName, (route) => false);
  }

  void pop() => Navigator.of(this).pop();
}
