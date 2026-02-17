import 'package:Axon/core/extensions/context_extension.dart';
import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/routes/app_routes.dart';
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/features/patient/home_patient/presentation/views/widgets/quick_action_item.dart';
import 'package:Axon/features/patient/medicine/presentation/manager/medicine%20cubit/medicine_cubit.dart';
import 'package:Axon/features/patient/medicine/presentation/view/add_medicine_view.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class QuickActionsSection extends StatelessWidget {
  const QuickActionsSection({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Widget> items = [
      QuickActionItem(
        icon: AppImages.doctors1,
        label: context.l10n.doctors,
        onTap: () {
          context.pushName(AppRoutes.bookDoctorTabs);
        },
      ),
      QuickActionItem(
        icon: AppImages.hospital1,
        label: context.l10n.hospitals,
        onTap: () {},
      ),
      QuickActionItem(
        icon: AppImages.Med1,
        label: context.l10n.medicine,
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => BlocProvider(
                create: (_) => MedicineCubit(),
                child: const AddMedicineView(),
              ),
            ),
          );
        },
      ),
      QuickActionItem(
        icon: AppImages.chatBot,
        label: context.l10n.asaly,
        onTap: () {
          context.pushName(AppRoutes.chatBot);
        },
      ),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 20.w),
          child: TextApp(
            text: context.l10n.quick_actions,
            weight: AppTextWeight.semiBold,
            fontSize: 15.sp,
            color: AppColors.black,
          ),
        ),
        SizedBox(height: 10.h),
        Padding(
          padding: EdgeInsets.symmetric(horizontal: 16.w),
          child: Container(
            padding: EdgeInsets.symmetric(vertical: 10.h, horizontal: 12.w),
            decoration: BoxDecoration(
              color: AppColors.white,
              borderRadius: BorderRadius.circular(16.r),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.2),
                  blurRadius: 18,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: items,
            ),
          ),
        ),
      ],
    );
  }
}
