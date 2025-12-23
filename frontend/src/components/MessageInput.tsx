import { useChatStore } from "@/hooks/store/useChatStore";
import useKeyboardSound from "@/hooks/utilities/useKeyboardSound";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import React, {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import toast, { LoaderIcon } from "react-hot-toast";

const MessageInput = () => {
  const sound = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [isSending, setIsSending] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSoundEnabled = useChatStore((s) => s.isSoundEnabled);
  const { sendMessage } = useChatStore((s) => s.actions);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    setIsSending(true)

    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) sound();

    await sendMessage({ text: text.trim(), image: imagePreview });

    setText("");
    setImagePreview("");
    setIsSending(false)
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file?.type.startsWith("image/"))
      return toast.error("Please select an image file");

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value;
  };

  return (
    <div className="p-4 border-t bg-slate-700/50">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="max-w-3xl mx-auto flex space-x-4"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundEnabled && sound();
          }}
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
          placeholder="Type your message..."
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${
            imagePreview ? "text-cyan-500" : ""
          }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <LoaderIcon className="size-4 m-auto animate-spin" />
          ) : (
            <SendIcon className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
