import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/libraries/axios";
import { useAuthUser } from "@/hooks/auth/useAuthUser";
import type { Message } from "./useMessages";
import queryClient from "@/libraries/tanstack";

interface SendMessageInput {
  receiverId: string;
  text?: string;
  image?: string;
}

export const useSendMessage = () => {
  const { data: authUser } = useAuthUser();

  return useMutation({
    mutationFn: async (data: SendMessageInput) => {
      if (!authUser?._id) {
        throw new Error("User not authenticated");
      }
      
      const res = await api.post<Message>(`/messages/send/${data.receiverId}`, {
        text: data.text,
        image: data.image,
      });
      return res.data;
    },

    onMutate: async (variables) => {
      if (!authUser?._id) return;

      const { receiverId, text, image } = variables;

      const queryKey = ["auth", authUser._id, "messages", receiverId];

      await queryClient.cancelQueries({ queryKey });

      const previousMessages =
        queryClient.getQueryData<Message[]>(queryKey) || [];

      const optimisticMessage: Message = {
        _id: `optimistic-${Date.now()}`,
        senderId: authUser._id, // realistic temporary ID
        receiverId,
        text: text ?? "",
        image,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Message[]>(queryKey, [
        ...previousMessages,
        optimisticMessage,
      ]);

      return { previousMessages };
    },

    onError: (_err, variables, context) => {
      if (!authUser?._id || !context?.previousMessages) return;
      const queryKey = ["auth", authUser._id, "messages", variables.receiverId];
      queryClient.setQueryData(queryKey, context.previousMessages);
    },

    onSuccess: (savedMessage, variables) => {
      if (!authUser?._id) return;

      const queryKey = ["auth", authUser._id, "messages", variables.receiverId];
      queryClient.setQueryData<Message[]>(queryKey, (old = []) =>
        old.map((msg) =>
          msg._id.startsWith("optimistic") ? savedMessage : msg
        )
      );

      // Optionally, invalidate chat-partners for ordering, etc.
      queryClient.invalidateQueries({
        queryKey: ["auth", authUser._id, "chat-partners"],
      });
    },
  });
};
