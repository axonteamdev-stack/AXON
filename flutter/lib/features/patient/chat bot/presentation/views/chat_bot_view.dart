import 'package:Axon/core/extensions/localization_ext.dart';
import 'package:Axon/core/style/app_images.dart';
import 'package:Axon/core/widgets/custom_app_bar.dart';
import 'package:Axon/features/patient/chat%20bot/data/data_sources/chat_bot_remote_data_source.dart';
import 'package:Axon/features/patient/chat%20bot/data/repo_impl.dart/chat_bot_repository_impl.dart';
import 'package:Axon/features/patient/chat%20bot/presentation/manager/chat_bot_cubit/chat_bot_cubit.dart';
import 'package:Axon/features/patient/chat%20bot/presentation/manager/chat_bot_cubit/chat_bot_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

import 'package:Axon/core/style/colors.dart';
import 'package:Axon/core/widgets/text_app.dart';
import 'package:Axon/core/widgets/custom_text_field.dart';
import '../../data/models/chat_message_model.dart';

class ChatBotView extends StatefulWidget {
  const ChatBotView({super.key});

  @override
  State<ChatBotView> createState() => _ChatBotViewState();
}

class _ChatBotViewState extends State<ChatBotView> {
  final TextEditingController messageController = TextEditingController();
  final ScrollController scrollController = ScrollController();

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (scrollController.hasClients) {
        scrollController.animateTo(
          scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (_) =>
          ChatBotCubit(ChatBotRepositoryImpl(ChatRemoteDataSource())),
      child: Builder(
        builder: (context) {
          return Scaffold(
            backgroundColor: AppColors.white,
            body: Column(
              children: [
                 CustomAppBar(title: context.l10n.chat_bot_title ,
                trailing: Image.asset(
    AppImages.chatBot,
    width: 45.w,
    height: 45.w,
    // color: AppColors.white,
  ),
                ),

                Expanded(
                  child: BlocBuilder<ChatBotCubit, ChatBotState>(
                    builder: (context, state) {
                      final messages = context.read<ChatBotCubit>().messages;
                      _scrollToBottom();

                      return ListView.builder(
                        controller: scrollController,
                        padding: EdgeInsets.symmetric(
                          horizontal: 16.w,
                          vertical: 12.h,
                        ),
                        itemCount: messages.length,
                        itemBuilder: (_, index) {
                          final msg = messages[index];
                          final bool isMe = msg.type == MessageType.user;
                          final bool isWelcome =
                              msg.type == MessageType.bot && index == 0;

                          return Align(
                            alignment: isMe
                                ? Alignment.centerRight
                                : Alignment.centerLeft,
                            child: Container(
                              constraints: BoxConstraints(
                                maxWidth:
                                    MediaQuery.of(context).size.width * 0.75,
                              ),
                              margin: EdgeInsets.only(bottom: 10.h),
                              padding: EdgeInsets.symmetric(
                                horizontal: 14.w,
                                vertical: 10.h,
                              ),
                              decoration: BoxDecoration(
                                color: isMe
                                    ? AppColors.primaryColor
                                    : AppColors.white,
                                borderRadius: BorderRadius.only(
                                  topLeft: Radius.circular(16.r),
                                  topRight: Radius.circular(16.r),
                                  bottomLeft: Radius.circular(
                                    isMe ? 16.r : 4.r,
                                  ),
                                  bottomRight: Radius.circular(
                                    isMe ? 4.r : 16.r,
                                  ),
                                ),
                                boxShadow: const [
                                  BoxShadow(
                                    color: Colors.black12,
                                    blurRadius: 6,
                                    offset: Offset(0, 3),
                                  ),
                                ],
                              ),
                              child: TextApp(
                                text: msg.message,
                                fontSize: isWelcome ? 12 : 13,
                                height: isWelcome ? 1.4 : 1.5,
                                color: isMe ? AppColors.white : AppColors.black,
                              ),
                            ),
                          );
                        },
                      );
                    },
                  ),
                ),

                BlocBuilder<ChatBotCubit, ChatBotState>(
                  builder: (context, state) {
                    if (state is ChatBotLoading) {
                      return Padding(
                        padding: EdgeInsets.only(left: 16.w, bottom: 6.h),
                        child: Row(
                          children:  [
                            _Dot(),
                            _Dot(),
                            _Dot(),
                            SizedBox(width: 8),
                            TextApp(
                             text: context.l10n.ai_typing,
                              fontSize: 12,
                              color: AppColors.grey,
                            ),
                          ],
                        ),
                      );
                    }
                    return const SizedBox.shrink();
                  },
                ),

                Container(
                  padding: EdgeInsets.fromLTRB(16.w, 10.h, 16.w, 16.h),
                  decoration: const BoxDecoration(
                    color: AppColors.white,
                    boxShadow: [
                      BoxShadow(color: Colors.black12, blurRadius: 8),
                    ],
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: CustomTextField(
                          controller: messageController,
                           hintText: context.l10n.type_your_message,
                        ),
                      ),
                      SizedBox(width: 10.w),
                      GestureDetector(
                        onTap: () {
                          final text = messageController.text.trim();
                          if (text.isEmpty) return;

                          context.read<ChatBotCubit>().sendMessage(text);
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
        },
      ),
    );
  }
}

class _Dot extends StatelessWidget {
  const _Dot();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 6,
      height: 6,
      margin: const EdgeInsets.only(right: 4),
      decoration: const BoxDecoration(
        shape: BoxShape.circle,
        color: AppColors.grey,
      ),
    );
  }
}
