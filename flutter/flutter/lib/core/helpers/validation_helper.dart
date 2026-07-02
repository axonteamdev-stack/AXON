class ValidationHelper {

  static String? validateEmail(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Email is required';
    }

    if (!value.contains('@') || !value.contains('.')) {
      return 'Email must contain "@" and domain';
    }

    final emailRegex = RegExp(r'^[\w\.-]+@[\w\.-]+\.\w+$');
    if (!emailRegex.hasMatch(value)) {
      return 'Enter a valid email format (e.g., user@mail.com)';
    }

    return null;
  }

  // -------------------------------
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    }

    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!RegExp(r'[A-Z]').hasMatch(value)) {
      return 'Password must contain at least 1 uppercase letter';
    }
    if (!RegExp(r'[a-z]').hasMatch(value)) {
      return 'Password must contain at least 1 lowercase letter';
    }
    if (!RegExp(r'[0-9]').hasMatch(value)) {
      return 'Password must contain at least 1 number';
    }

    return null;
  }

  static String? validateConfirmPassword(String? value, String? original) {
    if (value == null || value.isEmpty) {
      return 'Confirm password is required';
    }
    if (value != original) {
      return 'Passwords do not match';
    }
    return null;
  }

  // -------------------------------
  
  static String? validateName(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Name is required';
    }
    if (value.length < 3) {
      return 'Name must be at least 3 characters';
    }
    if (!RegExp(r"^[a-zA-Z\s]+$").hasMatch(value)) {
      return 'Name must contain letters only';
    }
    return null;
  }

  // -------------------------------

  static String? validatePhone(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Phone number is required';
    }

    // Remove spaces
    value = value.replaceAll(" ", "");

    /// Must start with 01
    if (!value.startsWith("01")) {
      return 'Phone number must start with "01"';
    }

    /// Must be 11 digits
    if (value.length != 11) {
      return 'Phone number must be exactly 11 digits';
    }

    /// Egyptian operators validation
    final egyptRegex = RegExp(r'^(010|011|012|015)[0-9]{8}$');
    if (!egyptRegex.hasMatch(value)) {
      return 'Invalid Egyptian phone number format';
    }

    return null;
  }

  // -------------------------------

  static String? validateNotEmpty(String? value, {String? fieldName}) {
    if (value == null || value.trim().isEmpty) {
      return '${fieldName ?? "This field"} is required';
    }
    return null;
  }

  // -------------------------------

  static String? validateNumber(String? value, {String? fieldName}) {
    if (value == null || value.trim().isEmpty) {
      return '${fieldName ?? "Number"} is required';
    }
    if (double.tryParse(value) == null) {
      return '${fieldName ?? "Value"} must be a valid number';
    }
    return null;
  }

  // -------------------------------

  static String? validateNationalID(String? value) {
    if (value == null || value.isEmpty) {
      return 'National ID is required';
    }

    if (value.length != 14) {
      return 'National ID must be exactly 14 digits';
    }

    if (!RegExp(r'^\d{14}$').hasMatch(value)) {
      return 'National ID must contain digits only';
    }

    if (!(value.startsWith('2') || value.startsWith('3'))) {
      return 'National ID must start with 2 or 3';
    }

    return null;
  }
}
