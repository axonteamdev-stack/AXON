import 'package:Axon/core/routes/app_routes.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/features/patient/profile_patient/presentation/views/widgets/patient_profile_menu_item.dart';
import 'widgets/doctor_patient_header_delegate.dart';
import 'package:Axon/core/extensions/localization_ext.dart';

class DoctorShowPatientProfileView extends StatelessWidget {
  final String name;
  final String image;

  const DoctorShowPatientProfileView({
    super.key,
    required this.name,
    required this.image,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: CustomScrollView(
        slivers: [
          SliverPersistentHeader(
            pinned: true,
            delegate: DoctorPatientHeaderDelegate(
              name: name,
              image: image,
            ),
          ),
          SliverList(
            delegate: SliverChildListDelegate(
              [
                SizedBox(height: 16.h),

                PatientProfileMenuItem(
                  icon: Icons.person_outline,
                  title: context.l10n.basic_information,
                  dense: true,
                  onTap: () {
                    Navigator.pushNamed(
                      context,
                      AppRoutes.doctorViewPatientBasicInfo,
                    );
                  },
                ),

                PatientProfileMenuItem(
                  icon: Icons.favorite_outline,
                  title: context.l10n.health_conditions,
                  dense: true,
                  onTap: () {
                    Navigator.pushNamed(
                      context,
                      AppRoutes.doctorViewPatientHealthConditions,
                    );
                  },
                ),

                PatientProfileMenuItem(
                  icon: Icons.error_outline,
                  title: context.l10n.allergies,
                  dense: true,
                  onTap: () {
                    Navigator.pushNamed(
                      context,
                      AppRoutes.doctorViewPatientAllergies,
                    );
                  },
                ),

                PatientProfileMenuItem(
                  icon: Icons.monitor_heart_outlined,
                  title: context.l10n.radiology,
                  dense: true,
                  onTap: () {
                    Navigator.pushNamed(
                      context,
                      AppRoutes.doctorViewPatientRadiology,
                    );
                  },
                ),

                PatientProfileMenuItem(
                  icon: Icons.science_outlined,
                  title: context.l10n.lab_tests,
                  dense: true,
                  onTap: () {
                    Navigator.pushNamed(
                      context,
                      AppRoutes.doctorViewPatientLabTests,
                    );
                  },
                ),

                SizedBox(height: 32.h),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
