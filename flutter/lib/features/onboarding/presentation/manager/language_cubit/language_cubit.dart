import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:Axon/core/service/shared_pref/shared_pref.dart';
import 'package:Axon/core/service/shared_pref/pref_keys.dart';

class LanguageCubit extends Cubit<Locale> {

  LanguageCubit() : super(_getSavedLanguage());

  static Locale _getSavedLanguage() {
    final lang = SharedPref().getString(PrefKeys.language);

    if (lang != null && lang.isNotEmpty) {
      return Locale(lang);
    }

    return const Locale('en');
  }

  void toggleLanguage() {
    final newLang = state.languageCode == 'en' ? 'ar' : 'en';

    SharedPref().setString(PrefKeys.language, newLang);

    emit(Locale(newLang));
  }

  void setLanguage(String code) {
    SharedPref().setString(PrefKeys.language, code);

    emit(Locale(code));
  }
}