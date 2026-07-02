import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:flutter/material.dart';

extension ContextExt on BuildContext {
  //color
  AppColors get color => AppColors();

  // images
  AppImages get assets => AppImages();

  // style
  TextStyle get textStyle => Theme.of(this).textTheme.displaySmall!;

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
