import { Avatar } from "stream-chat-react";
import { useAuthStore } from "../store/store";
import { Link } from "react-router-dom";
import type { ChannelPreviewUIComponentProps } from "stream-chat-react";
import type { Channel } from "stream-chat";

interface CustomPreviewProps extends ChannelPreviewUIComponentProps {
  currentActiveChannel?: Channel;
}

function CustomChannelPreview(props: CustomPreviewProps) {
  const { channel, setActiveChannel, currentActiveChannel } = props;
  const { authUser } = useAuthStore();

  const member = Object.values(channel.state.members).find(
    (m) => m.user?.id !== authUser?._id
  );

  const isActive = channel.cid === currentActiveChannel?.cid;
  const lastMessage = channel.state.messages[channel.state.messages.length - 1];

  return (
    <Link
      to={`/chat/${member?.user?.id}`}
      title="Send Message"
    >
      <button
        onClick={() => setActiveChannel?.(channel)}
        className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 ${isActive ? 'bg-base-300' : ''
          }`}
      >
        <Avatar
          image={member?.user?.image}
          name={member?.user?.name || "Anonymous"}
        />
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium truncate">{member?.user?.name}</p>
            {lastMessage && (
              <span className="text-xs opacity-60">
                {new Date(lastMessage.created_at!).toLocaleDateString()}
              </span>
            )}
          </div>
          <p className="text-sm opacity-70 truncate">
            {lastMessage?.text || "No messages yet"}
          </p>
        </div>
      </button>
    </Link>
  );
}

export default CustomChannelPreview;