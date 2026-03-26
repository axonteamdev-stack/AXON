import 'package:get_it/get_it.dart';
import 'package:injectable/injectable.dart';

import 'di.config.dart';
	
final getIt = GetIt.instance;  
  
@InjectableInit(  
  initializerName: 'init', // default  
  preferRelativeImports: true, // default  
  asExtension: true, // default  
)  
void configureDependencies() => getIt.init();

// flutter pub run build_runner build --delete-conflicting-outputs
// flutter pub run build_runner watch --delete-conflicting-outputs