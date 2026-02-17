import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_app_bar.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/core/extensions/localization_ext.dart';
import '../manager/doctors_cubit.dart';
import '../manager/doctors_state.dart';
import '../widget/doctor_card.dart';

class DoctorsTabsView extends StatefulWidget {
  const DoctorsTabsView({super.key});

  @override
  State<DoctorsTabsView> createState() => _DoctorsTabsViewState();
}

class _DoctorsTabsViewState extends State<DoctorsTabsView> {
  int selectedIndex = 0;
  final searchController = TextEditingController();
  bool showSearch = false;

  late List<String> categories;

  @override
  Widget build(BuildContext context) {
    categories = [
      context.l10n.all,
      context.l10n.heart,
      context.l10n.internal,
      context.l10n.kidney,
      context.l10n.bones,
      context.l10n.neuro,
      context.l10n.psychology,
    ];

    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Column(
          children: [
            CustomAppBar(
              title: context.l10n.doctors,
              trailing: const Icon(Icons.search, color: AppColors.white),
              onTrailingTap: () {
                setState(() => showSearch = !showSearch);
              },
            ),

            if (showSearch)
              Padding(
                padding: EdgeInsets.fromLTRB(16.w, 12.h, 16.w, 4.h),
                child: CustomTextField(
                  controller: searchController,
                  hintText: context.l10n.search_doctor_specialty,
                  prefixIcon: const Icon(Icons.search),
                  onChanged: (v) =>
                      context.read<DoctorsCubit>().searchDoctors(v),
                ),
              ),

            SizedBox(height: 10.h),

            SizedBox(
              height: 35.h,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: EdgeInsets.symmetric(horizontal: 16.w),
                itemCount: categories.length,
                separatorBuilder: (_, __) => SizedBox(width: 10.w),
                itemBuilder: (_, i) {
                  final isSelected = i == selectedIndex;
                  return GestureDetector(
                    onTap: () {
                      setState(() => selectedIndex = i);
                      context
                          .read<DoctorsCubit>()
                          .filterBySpecialty(categories[i]);
                    },
                    child: Container(
                      padding: EdgeInsets.symmetric(
                          horizontal: 18.w, vertical: 7.h),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppColors.primaryColor
                            : AppColors.white,
                        borderRadius: BorderRadius.circular(28.r),
                        border: Border.all(
                          color: AppColors.primaryColor.withOpacity(.3),
                        ),
                      ),
                      child: TextApp(
                        text: categories[i],
                        color: isSelected
                            ? AppColors.white
                            : AppColors.primaryColor,
                        fontSize: 12,
                        weight: AppTextWeight.semiBold,
                      ),
                    ),
                  );
                },
              ),
            ),

            SizedBox(height: 16.h),

            Expanded(
              child: BlocBuilder<DoctorsCubit, DoctorsState>(
                builder: (_, state) {
                  if (state is DoctorsLoaded) {
                    return ListView.separated(
                      padding:
                          EdgeInsets.symmetric(horizontal: 16.w),
                      itemCount: state.filteredDoctors.length,
                      separatorBuilder: (_, __) =>
                          SizedBox(height: 14.h),
                      itemBuilder: (_, i) => DoctorCard(
                        doctor: state.filteredDoctors[i],
                      ),
                    );
                  }
                  return const SizedBox();
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
