import 'package:Axon/l10n/app_localizations.dart';
import 'package:flutter/widgets.dart';

extension LocalizationExt on BuildContext {
  AppLocalizations get l10n => AppLocalizations.of(this)!;
}