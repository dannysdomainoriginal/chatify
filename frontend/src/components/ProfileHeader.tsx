import { useState, useRef, type FormEvent } from "react";
import {
  LogOutIcon,
  VolumeOffIcon,
  Volume2Icon,
  PencilIcon,
  LoaderIcon,
} from "lucide-react";
import { useAuthStore } from "@/hooks/store/useAuthStore";
import { useChatStore } from "@/hooks/store/useChatStore";
import toast from "react-hot-toast";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

const ProfileHeader = () => {
  const [updating, setUpdating] = useState(false);
  const { logOut, updateProfile } = useAuthStore((s) => s.actions)
  const user = useAuthStore((s) => s.authUser)
  const isSoundEnabled = useChatStore((s) => s.isSoundEnabled)
  const { toggleSound } = useChatStore((s) => s.actions);

  const [selectedImg, setSelectedImg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: FormEvent) => {
    setUpdating(true)
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        setSelectedImg(base64Image);
        await toast
          .promise(updateProfile({ profilePic: base64Image }), {
            loading: "Saving...",
            success: "Profile updated successfully",
            error: "Error updating your profile",
          })
          .finally(() => setUpdating(false));
      };
    }
  };

  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => !updating && fileInputRef.current?.click()}
            >
              {updating ? (
                <LoaderIcon className="size-5 m-auto animate-spin" />
              ) : (
                <>
                  <img
                    src={selectedImg || user?.profilePic || "/avatar.png"}
                    alt="User Image"
                    className="size-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-xs">
                      <PencilIcon />
                    </span>
                  </div>
                </>
              )}
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              disabled={updating}
            />
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {user?.fullName}
            </h3>
            <p className="text-slate-400 text-xs">Online</p>
          </div>

          {/* BUTTONS */}
          <div className="flex ml-5 gap-4 items-center">
            {/* LOGOUT BTN */}
            <button
              className="text-slate-400 hover:text-slate-200 transition-colors"
              onClick={logOut}
            >
              <LogOutIcon className="size-5" />
            </button>

            {/* SOUND TOGGLE BTN */}
            <button
              className="text-slate-400 hover:text-slate-200 transition-colors"
              onClick={() => {
                // play mouse click on toggle
                mouseClickSound.currentTime = 0; // reset to start
                mouseClickSound
                  .play()
                  .catch((err) => toast.error("Click sound effect failed"));
                toggleSound();
              }}
            >
              {isSoundEnabled ? (
                <Volume2Icon className="size-5" />
              ) : (
                <VolumeOffIcon className="size-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
