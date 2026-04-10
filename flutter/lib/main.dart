import 'package:Axon/core/bloc_observer.dart';
import 'package:Axon/core/di/di.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/service/shared_pref/pref_keys.dart';
import 'package:Axon/core/service/shared_pref/shared_pref.dart';
import 'package:Axon/features/onboarding/presentation/manager/language_cubit/language_cubit.dart';
import 'package:Axon/l10n/app_localizations.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SharedPref.preferences.instantiatePreferences();

  final pref = SharedPref();

  final token = pref.getString(PrefKeys.accessToken);
  final role = pref.getString(PrefKeys.userRole);
  final seenOnboarding = pref.getBoolean(PrefKeys.onboardingSeen);

  String startRoute;

  if (seenOnboarding != true) {
    startRoute = AppRoutes.splash; 
  } else if (token != null && token.isNotEmpty) {
    if (role?.toLowerCase() == "doctor") {
      startRoute = AppRoutes.doctorMain;
    } else if (role?.toLowerCase() == "patient") {
      startRoute = AppRoutes.patientMain;
    } else {
      startRoute = AppRoutes.login;
    }
  } else {
    startRoute = AppRoutes.login;
  }

  Bloc.observer = AppBlocObserver();
  configureDependencies();

  runApp(Axon(startRoute: startRoute));
}

class Axon extends StatelessWidget {
  final String startRoute;

  const Axon({super.key, required this.startRoute});

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(375, 812),
      minTextAdapt: true,
      splitScreenMode: true,
      builder: (context, child) {
        return BlocProvider(
          create: (_) => LanguageCubit(),
          child: BlocBuilder<LanguageCubit, Locale>(
            builder: (context, locale) {
              return MaterialApp(
                debugShowCheckedModeBanner: false,

                locale: locale,

                supportedLocales: const [
                  Locale('en'),
                  Locale('ar'),
                ],

                localizationsDelegates: const [
                  AppLocalizations.delegate,
                  GlobalMaterialLocalizations.delegate,
                  GlobalWidgetsLocalizations.delegate,
                  GlobalCupertinoLocalizations.delegate,
                ],

                localeResolutionCallback: (locale, supportedLocales) {
                  for (final supportedLocale in supportedLocales) {
                    if (supportedLocale.languageCode ==
                        locale?.languageCode) {
                      return supportedLocale;
                    }
                  }
                  return supportedLocales.first;
                },

                initialRoute: startRoute,
                onGenerateRoute: AppRoutes.onGenerateRoute,
              );
            },
          ),
        );
      },
    );
  }
}