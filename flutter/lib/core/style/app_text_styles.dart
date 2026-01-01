import 'package:Axon/core/style/colors.dart';
import 'package:flutter/material.dart';

class AppTextStyles {
  static const TextStyle headline = TextStyle(
    fontFamily: 'Inter',
    fontWeight: FontWeight.w600,
    fontSize: 22,
    color: AppColors.black,
    height: 1.0,
  );

  static const TextStyle body = TextStyle(
    fontFamily: 'Inter',
    fontWeight: FontWeight.w400,
    fontSize: 14,
    color: AppColors.grey,
    height: 1.0,
  );

  static const TextStyle button = TextStyle(
    fontFamily: 'Inter',
    fontWeight: FontWeight.w600,
    fontSize: 18,
    color: AppColors.white,
    height: 1.0,
  );

  static const TextStyle regular = TextStyle(
    fontFamily: 'Inter',
    fontWeight: FontWeight.w400,
  );

  static const TextStyle semiBold = TextStyle(
    fontFamily: 'Inter',
    fontWeight: FontWeight.w600,
  );

  static const TextStyle bold = TextStyle(
    fontFamily: 'Inter',
    fontWeight: FontWeight.w700,
  );
}
