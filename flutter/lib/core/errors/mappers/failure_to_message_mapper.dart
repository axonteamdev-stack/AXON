import 'package:flutter/material.dart';
import 'package:Axon/core/errors/failures.dart';
import 'package:Axon/core/extensions/localization_ext.dart';

String mapFailureToMessage(BuildContext context, Failure failure) {
  switch (failure) {
    case OfflineFailure _:
      return context.l10n.offline_error;

    case TimeoutFailure _:
      return context.l10n.server_error;

    case TooManyRequestsFailure _:
      return context.l10n.too_many_requests;

    case WrongPasswordFailure _:
      return context.l10n.wrong_password;

    case NoUserFailure _:
      return context.l10n.no_user;

    case ExistedAccountFailure _:
      return context.l10n.account_exists;

    case WeakPasswordFailure _:
      return context.l10n.weak_password;

    case UnmatchedPassFailure _:
      return context.l10n.unmatched_password;

    case UnauthorizedFailure _:
  return context.l10n.wrong_password;

    case NotFoundFailure _:
      return context.l10n.not_found;

    case ServerFailure _:
      return context.l10n.server_error;

    default:
      return context.l10n.server_error;
  }
}