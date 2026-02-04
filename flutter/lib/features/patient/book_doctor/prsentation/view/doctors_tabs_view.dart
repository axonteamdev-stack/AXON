import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/custom_app_bar.dart';
import 'package:Axon/core/widgets/text_app.dart';
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

  final categories = [
    'All',
    'Heart',
    'Internal',
    'Kidney',
    'Bones',
    'Neuro',
    'Psychology',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      body: SafeArea(
        child: Column(
          children: [
            CustomAppBar(
              title: 'Doctors',
              trailing: const Icon(
                Icons.search,
                color: AppColors.white,
                size: 22,
              ),
              onTrailingTap: () {
                setState(() {
                  showSearch = !showSearch;
                });
              },
            ),

            if (showSearch)
              Padding(
                padding: EdgeInsets.fromLTRB(16.w, 12.h, 16.w, 4.h),
                child: TextField(
                  controller: searchController,
                  onChanged: (value) {
                    context.read<DoctorsCubit>().searchDoctors(value);
                  },
                  decoration: InputDecoration(
                    hintText: 'Search doctor or specialty',
                    prefixIcon: const Icon(Icons.search),
                    filled: true,
                    fillColor: AppColors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14.r),
                      borderSide: BorderSide(
                        color: AppColors.primaryColor.withOpacity(0.3),
                      ),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14.r),
                      borderSide: BorderSide(
                        color: AppColors.primaryColor.withOpacity(0.3),
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14.r),
                      borderSide: const BorderSide(
                        color: AppColors.primaryColor,
                      ),
                    ),
                  ),
                ),
              ),

            SizedBox(height: 10.h),

            SizedBox(
              height: 40.h,
              child: ListView.separated(
                padding: EdgeInsets.symmetric(horizontal: 16.w),
                scrollDirection: Axis.horizontal,
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
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 250),
                      curve: Curves.easeOutCubic,
                      padding: EdgeInsets.symmetric(
                        horizontal: 18.w,
                        vertical: 7.h,
                      ),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppColors.primaryColor
                            : AppColors.white,
                        borderRadius: BorderRadius.circular(28.r),
                        border: Border.all(
                          color: isSelected
                              ? AppColors.primaryColor
                              : AppColors.primaryColor.withOpacity(0.25),
                        ),
                        boxShadow: isSelected
                            ? [
                                BoxShadow(
                                  color: AppColors.primaryColor
                                      .withOpacity(0.25),
                                  blurRadius: 12,
                                  offset: const Offset(0, 4),
                                ),
                              ]
                            : [],
                      ),
                      child: Center(
                        child: TextApp(
                          text: categories[i],
                          fontSize: 11.5,
                          letterSpacing: 0.2,
                          weight: AppTextWeight.semiBold,
                          color: isSelected
                              ? AppColors.white
                              : AppColors.primaryColor,
                        ),
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
