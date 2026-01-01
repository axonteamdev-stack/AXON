import 'package:flutter/material.dart';

class Snackbar {
  static void showSnackbar(
    BuildContext context, {
    required String message,
    Color backgroundColor = Colors.black87,
    Duration duration = const Duration(seconds: 3),
  }) {
    final snackBar = SnackBar(
      content: Text(
        message,
        style: const TextStyle(color: Colors.white),
      ),
      backgroundColor: backgroundColor,
      duration: duration,
      behavior: SnackBarBehavior.floating,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      margin: const EdgeInsets.all(16),
    );

    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(snackBar);
  }

  // Success Snackbar
  static void showSuccess(BuildContext context, {required String message}) {
    showSnackbar(
      context,
      message: message,
      backgroundColor: const Color(0xFF4CAF50), 
    );
  }

  // Error Snackbar
  static void showError(BuildContext context, {required String message}) {
    showSnackbar(
      context,
      message: message,
      backgroundColor: const Color(0xFFE57373), 
    );
  }

  // Warning Snackbar
  static void showWarning(BuildContext context, {required String message}) {
    showSnackbar(
      context,
      message: message,
      backgroundColor: const Color(0xFFFFB74D), 
    );
  }

  // Info Snackbar
  static void showInfo(BuildContext context, {required String message}) {
    showSnackbar(
      context,
      message: message,
      backgroundColor: const Color(0xFF64B5F6), 
    );
  }
}
