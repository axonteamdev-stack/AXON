import 'package:Axon/core/bloc_observer.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/service/shared_pref/shared_pref.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

void main() async {
    WidgetsFlutterBinding.ensureInitialized();
     await SharedPref.preferences.instantiatePreferences();

  Bloc.observer = AppBlocObserver();
  runApp(const Axon());
}

class Axon extends StatelessWidget {

  const Axon({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(375, 812),
      minTextAdapt: true,
      splitScreenMode: true,
      builder: (context, child) {
        return MaterialApp(
        
          title: 'Axon',
          debugShowCheckedModeBanner: false,

          initialRoute: AppRoutes.splash,
          onGenerateRoute: AppRoutes.onGenerateRoute,
        );
      },
    );
  }
}
