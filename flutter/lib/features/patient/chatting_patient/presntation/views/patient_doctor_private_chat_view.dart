import 'package:Axon/core/routes/app_routes.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import 'package:Axon/core/widgets/custom_app_bar.dart';

class PatientDoctorPrivateChatView extends StatefulWidget {
  final String name;
  final String image;
  final String description;

  const PatientDoctorPrivateChatView({
    super.key,
    required this.name,
    required this.image,
    required this.description,
  });

  @override
  State<PatientDoctorPrivateChatView> createState() =>
      _PatientDoctorPrivateChatViewState();
}

class _PatientDoctorPrivateChatViewState
    extends State<PatientDoctorPrivateChatView> {
  final TextEditingController messageController =
      TextEditingController();

  late List<Map<String, dynamic>> messages;

  @override
  void initState() {
    super.initState();
    messages = [
      {
        'text': 'What is your complaint?',
        'isMe': false,
      },
    ];
  }

  @override
  void dispose() {
    messageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F8FA),
      body: Column(
        children: [
          /// ================= App Bar =================
          CustomAppBar(
            title: widget.name,
            trailing: InkWell(
              onTap: () {
                Navigator.pushNamed(
                  context,
                  AppRoutes.doctorShowPatientProfile,
                  arguments: {
                    'name': widget.name,
                    'image': widget.image,
                  },
                );
              },
              child: Container(
                padding: EdgeInsets.all(2.w),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: AppColors.white,
                    width: 2,
                  ),
                ),
                child: CircleAvatar(
                  radius: 18,
                  backgroundImage: AssetImage(widget.image),
                ),
              ),
            ),
          ),

          /// ================= Messages =================
          Expanded(
            child: ListView.builder(
              padding: EdgeInsets.symmetric(
                horizontal: 16.w,
                vertical: 12.h,
              ),
              itemCount: messages.length,
              itemBuilder: (_, index) {
                final msg = messages[index];
                final bool isMe = msg['isMe'];

                return Align(
                  alignment: isMe
                      ? Alignment.centerRight
                      : Alignment.centerLeft,
                  child: Container(
                    margin: EdgeInsets.only(
                      bottom: 10.h,
                      left: isMe ? 60.w : 0,
                      right: isMe ? 0 : 60.w,
                    ),
                    padding: EdgeInsets.symmetric(
                      horizontal: 14.w,
                      vertical: 10.h,
                    ),
                    decoration: BoxDecoration(
                      color: isMe
                          ? AppColors.primaryColor
                          : AppColors.white,
                      borderRadius: BorderRadius.circular(16.r),
                    ),
                    child: TextApp(
                      text: msg['text'],
                      color: isMe
                          ? AppColors.white
                          : AppColors.black,
                      fontSize: 13,
                    ),
                  ),
                );
              },
            ),
          ),

          /// ================= Input =================
          Container(
            padding: EdgeInsets.fromLTRB(
              16.w,
              10.h,
              16.w,
              16.h,
            ),
            decoration: const BoxDecoration(
              color: AppColors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 8,
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: CustomTextField(
                    controller: messageController,
                    hintText: 'Type a message',
                  ),
                ),
                SizedBox(width: 10.w),
                GestureDetector(
                  onTap: () {
                    if (messageController.text.isEmpty) return;

                    setState(() {
                      messages.add({
                        'text': messageController.text,
                        'isMe': true,
                      });
                    });

                    messageController.clear();
                  },
                  child: Container(
                    width: 44.w,
                    height: 44.w,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppColors.primaryColor,
                    ),
                    child: const Icon(
                      Icons.send,
                      color: AppColors.white,
                      size: 20,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
