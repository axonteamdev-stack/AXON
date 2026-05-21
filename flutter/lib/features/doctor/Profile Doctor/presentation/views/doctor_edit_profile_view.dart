import 'dart:io';

import 'package:Axon/core/extensions/localization_ext.dart';

import 'package:Axon/core/style/app_images.dart';

import 'package:Axon/core/style/colors.dart';

import 'package:Axon/core/widgets/custom_button.dart';

import 'package:Axon/core/widgets/custom_text_field.dart';

import 'package:Axon/features/auth/Presentation/views/widgets/form_label.dart';
import 'package:Axon/features/auth/Presentation/views/widgets/reusable_dropdown.dart';

import 'package:Axon/features/doctor/Profile%20Doctor/presentation/manager/profile%20doctor/doctor_profile_cubit.dart';

import 'package:Axon/features/doctor/Profile%20Doctor/presentation/manager/profile%20doctor/doctor_profile_state.dart';

import 'package:flutter/material.dart';

import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:flutter_screenutil/flutter_screenutil.dart';

class DoctorEditProfileView
    extends StatelessWidget {

  const DoctorEditProfileView({
    super.key,
  });

  @override
  Widget build(BuildContext context) {

    return BlocBuilder<
        DoctorProfileCubit,
        DoctorProfileState>(

      builder: (context, state) {

        final cubit =
            context.read<
                DoctorProfileCubit>();

        return Scaffold(

          backgroundColor:
              AppColors.white,

          appBar: AppBar(

            scrolledUnderElevation: 0,

            surfaceTintColor:
                Colors.transparent,

            backgroundColor:
                AppColors.white,

            elevation: 0,

            leading: IconButton(

              icon: const Icon(

                Icons.arrow_back_ios,

                color:
                    AppColors.black,
              ),

              onPressed: () {

                Navigator.pop(
                  context,
                );
              },
            ),

            title: Text(

              context.l10n.edit_profile,

              style: const TextStyle(
                color:
                    AppColors.black,
              ),
            ),
          ),

          body: SingleChildScrollView(

            padding:
                EdgeInsets.symmetric(
              horizontal: 20.w,
            ),

            child: Column(

              crossAxisAlignment:
                  CrossAxisAlignment
                      .start,

              children: [

                SizedBox(
                  height: 24.h,
                ),

                // ================= PROFILE IMAGE =================

                Center(

                  child: GestureDetector(

                    onTap:
                        state.isEdit

                            ? cubit.pickImage

                            : null,

                    child: Stack(

                      alignment:
                          Alignment
                              .bottomRight,

                      children: [

                        Container(

                          padding:
                              EdgeInsets.all(
                            3.w,
                          ),

                          decoration:
                              const BoxDecoration(

                            shape:
                                BoxShape.circle,

                            color:
                                AppColors.white,
                          ),

                          child:
                              CircleAvatar(

                            radius:
                                52.r,

                            backgroundColor:
                                AppColors
                                    .primaryColor
                                    .withOpacity(
                              0.15,
                            ),

                            backgroundImage:

                                state.image !=
                                        null

                                    ? FileImage(
                                        File(
                                          state.image!,
                                        ),
                                      )

                                    : const AssetImage(
                                        AppImages
                                            .onboarding3,
                                      ),
                          ),
                        ),

                        if (state.isEdit)

                          Container(

                            width:
                                30.w,

                            height:
                                30.w,

                            decoration:
                                BoxDecoration(

                              shape:
                                  BoxShape.circle,

                              color:
                                  AppColors
                                      .primaryColor,

                              border:
                                  Border.all(

                                color:
                                    AppColors.white,

                                width:
                                    2,
                              ),
                            ),

                            child:
                                Icon(

                              Icons.add,

                              size:
                                  18.sp,

                              color:
                                  AppColors.white,
                            ),
                          ),
                      ],
                    ),
                  ),
                ),

                SizedBox(
                  height: 32.h,
                ),

                // ================= FULL NAME =================

                FormLabel(
                  text:
                      context.l10n.full_name,
                ),

                CustomTextField(

                  enabled: false,

                  controller:
                      TextEditingController(
                    text:
                        state.name,
                  ),
                ),

                SizedBox(
                  height: 20.h,
                ),

                // ================= EMAIL =================

                FormLabel(
                  text:
                      context.l10n.email,
                ),

                CustomTextField(

                  controller:
                      cubit.emailCtrl,

                  enabled: false,
                ),

                SizedBox(
                  height: 20.h,
                ),

                // ================= PHONE =================

                FormLabel(
                  text:
                      context
                          .l10n
                          .phone_number,
                ),

                CustomTextField(

                  controller:
                      cubit.phoneCtrl,

                  enabled:
                      state.isEdit,
                ),

                SizedBox(
                  height: 20.h,
                ),

                // ================= EXPERIENCE =================

                FormLabel(
                  text:
                      context
                          .l10n
                          .years_experience,
                ),

                CustomTextField(

                  controller:
                      cubit.expCtrl,

                  enabled:
                      state.isEdit,

                  keyboardType:
                      TextInputType.number,
                ),

                SizedBox(
                  height: 20.h,
                ),

                // ================= PRICE =================

                FormLabel(
                  text:
                      context.l10n.price,
                ),

                CustomTextField(

                  controller:
                      cubit.priceCtrl,

                  enabled:
                      state.isEdit,

                  keyboardType:
                      TextInputType.number,
                ),

                SizedBox(
                  height: 20.h,
                ),

                // ================= SPECIALIZATION =================

 
FormLabel(
  text:
      context
          .l10n
          .specialization,
),

state.isEdit

    ? ReusableDropdown(
        hint:
            context
                .l10n
                .select_specialization,

        value:
            cubit.selectedSpecialization,

        items: [
          context.l10n.cardiology,
          context.l10n.neurology,
          context.l10n.pediatrics,
          context.l10n.dentistry,
        ],

        onChanged: (v) {
          if (v != null) {
            cubit.specializationSelected(v);
          }
        },
      )

    : CustomTextField(
        enabled: false,

        controller:
            TextEditingController(
          text:
              state.profession,
        ),
      ),

       SizedBox(
                  height: 20.h,
                ),

                // ================= LICENSE NUMBER =================

                FormLabel(
                  text:
                      context
                          .l10n
                          .license_number,
                ),

                CustomTextField(

                  enabled: false,

                  controller:
                      TextEditingController(
                    text:
                        state.licenseNumber,
                  ),
                ),

                SizedBox(
                  height: 20.h,
                ),

                // ================= ABOUT =================

                FormLabel(
                  text:
                      context.l10n.about,
                ),

                CustomTextField(

                  controller:
                      cubit.aboutCtrl,

                  enabled:
                      state.isEdit,

                  maxLines: 4,
                ),

                SizedBox(
                  height: 12.h,
                ),

                // ================= LICENSE IMAGE =================

                FormLabel(
                  text:
                      context
                          .l10n
                          .medical_license,
                ),

                SizedBox(
                  height: 8.h,
                ),

                Container(

                  width:
                      double.infinity,

                  height: 150,

                  decoration:
                      BoxDecoration(

                    borderRadius:
                        BorderRadius
                            .circular(
                      12,
                    ),

                    border:
                        Border.all(
                      color:
                          Colors
                              .grey
                              .shade300,
                    ),
                  ),

                  child:
                      ClipRRect(

                    borderRadius:
                        BorderRadius
                            .circular(
                      12,
                    ),

                    child:

                        state.licenseImage
                                .isNotEmpty

                            ? Image.network(

                                state
                                    .licenseImage,

                                fit:
                                    BoxFit.cover,

                                errorBuilder:
                                    (
                                  context,
                                  error,
                                  stackTrace,
                                ) {

                                  return const Center(

                                    child:
                                        Icon(

                                      Icons
                                          .image_not_supported,

                                      size:
                                          40,
                                    ),
                                  );
                                },
                              )

                            : const Center(

                                child:
                                    Icon(

                                  Icons
                                      .image_not_supported,

                                  size:
                                      40,
                                ),
                              ),
                  ),
                ),

                SizedBox(
                  height: 40.h,
                ),

                // ================= BUTTON =================

                state.isLoading

                    ? const Center(

                        child:
                            CircularProgressIndicator(),
                      )

                    : CustomButton(

                        text:
                            state.isEdit

                                ? context
                                    .l10n
                                    .save

                                : context
                                    .l10n
                                    .edit,

                        onPressed: () {

                          state.isEdit

                              ? cubit
                                  .updateProfile()

                              : cubit
                                  .toggleEdit();
                        },
                      ),

                SizedBox(
                  height: 40.h,
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}