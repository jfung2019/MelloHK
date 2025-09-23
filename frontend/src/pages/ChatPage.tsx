import { useParams } from "react-router-dom";
import { useAuthStore, useUserStore } from "../store/store";
import { useEffect, useState } from "react";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat, Channel as StreamChannel } from "stream-chat";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

function ChatPage() {
  const { authUser } = useAuthStore();
  const { streamToken, getStreamToken } = useUserStore();
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState<StreamChat | undefined>();
  const [channel, setChannel] = useState<StreamChannel | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      getStreamToken();
    }
    const initChat = async () => {
      if (!streamToken || !authUser || !targetUserId) return;
      try {
        console.log("init stream chat client...");
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.name,
            image: authUser.profilePicture,
          },
          streamToken
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currentChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currentChannel.watch();
        setChatClient(client);
        setChannel(currentChannel);
      } catch (error) {
        console.log("Error in init stream chat client", error);
      } finally {
        setLoading(false);
      }
    };
    initChat();

    // Cleanup function
    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
        setChatClient(undefined);
        setChannel(undefined);
      }
    };
  }, [getStreamToken, authUser, streamToken, targetUserId, chatClient]);

  if (loading || !chatClient || !channel)
    return <div>Conecting to chat...</div>;

  return (
    <div>
      {/* <p>chatPage for friend ID: {targetUserId}</p>
      <p>streamToken: {streamToken}</p> */}
      <div className="h-[calc(100vh-4rem)]">
        <Chat client={chatClient}>
          <Channel channel={channel}>
            <div className="relative w-full">
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput focus />
              </Window>
            </div>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
}

export default ChatPage;
