import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/libraries/axios";
import type { Message } from "./useMessages";
import queryClient from "@/libraries/react-query";

interface SendMessageInput {
  receiverId: string;
  text?: string;
  image?: string;
}

export const useSendMessage = () => {
  return useMutation({
    mutationFn: async (data: SendMessageInput) => {
      const res = await api.post<Message>(`/messages/send/${data.receiverId}`, {
        text: data.text,
        image: data.image,
      });
      return res.data;
    },

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async (variables) => {
      const { receiverId, text, image } = variables;

      await queryClient.cancelQueries({
        queryKey: ["messages", receiverId],
      });

      const previousMessages =
        queryClient.getQueryData<Message[]>(["messages", receiverId]) || [];

      const optimisticMessage: Message = {
        _id: `optimistic-${Date.now()}`,
        senderId: "me", // UI only; real value comes from backend
        receiverId,
        text: text ?? "",
        image,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Message[]>(
        ["messages", receiverId],
        [...previousMessages, optimisticMessage],
      );

      return { previousMessages };
    },

    // ❌ ROLLBACK ON ERROR
    onError: (_err, variables, context) => {
      if (!context?.previousMessages) return;

      queryClient.setQueryData(
        ["messages", variables.receiverId],
        context.previousMessages,
      );
    },

    // ✅ REPLACE OPTIMISTIC MESSAGE
    onSuccess: (savedMessage, variables) => {
      queryClient.setQueryData<Message[]>(
        ["messages", variables.receiverId],
        (old = []) =>
          old.map((msg) =>
            msg._id.startsWith("optimistic") ? savedMessage : msg,
          ),
      );
    },

    // 🔄 UPDATE CHAT LIST
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["chat-partners"],
      });
    },
  });
};
