import { useParams } from "react-router-dom";
import { useAuthStore, useThemeStore, useUserStore } from "../store/store";
import { useEffect, useState } from "react";
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  Window
} from "stream-chat-react";
import { StreamChat, Channel as StreamChannel, type ChannelSort } from "stream-chat";
import { isDarkTheme } from "../constants/themes";
import CustomChannelPreview from "../components/CustomChannelPreview";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

function ChatPage() {
  const { theme } = useThemeStore();
  const { authUser } = useAuthStore();
  const { streamToken, getStreamToken } = useUserStore();
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState<StreamChat | undefined>();
  const [activeChannel, setActiveChannel] = useState<StreamChannel | undefined>();
  const [loading, setLoading] = useState(true);

  const isDarkMode = isDarkTheme(theme);
  const filters = {
    type: 'messaging',
    members: { $in: authUser?._id ? [authUser._id] : [] }
  };
  const sort = { last_message_at: -1 } as ChannelSort;

  useEffect(() => {
    if (authUser) {
      getStreamToken();
    }
  }, [authUser, getStreamToken]);

  useEffect(() => {
    if (!streamToken || !authUser) return;

    const initChat = async () => {
      try {
        console.log("init stream chat client...");
        const client = StreamChat.getInstance(STREAM_API_KEY, {
          timeout: 5000,
        });

        console.log('client.userID', client.userID);
        console.log('authUser._id', authUser._id);

        // Check if connected user is different from current user
        if (client.userID && client.userID !== authUser._id) {
          console.log('Disconnecting previous user:', client.userID);
          await client.disconnectUser();
        }

        // Connect if no user or different user
        if (!client.userID) {
          console.log('Connecting new user:', authUser._id);
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.name,
              image: authUser.profilePicture,
            },
            streamToken
          );
        }

        console.log('client.userID after connect', client.userID);
        setChatClient(client);
      } catch (error) {
        console.log("Error in init stream chat client", error);
      }
    };

    initChat();
  }, [authUser, streamToken]);

  // Separate cleanup effect for component unmount only
  // This is intentional to only clean up on unmount and exclude chatClient in array dependency
  useEffect(() => {
    return () => {
      if (chatClient) {
        console.log('Component unmounting - disconnecting user');
        chatClient.disconnectUser();
        setChatClient(undefined);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set active channel when targetUserId changes
  // TargetUserId changes when we switch a friend to message with
  useEffect(() => {
    if (!chatClient || !targetUserId || !authUser) return;
    const handleActiveChannel = async () => {
      try {
        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currentChannel = chatClient.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });
        await currentChannel.watch();
        setActiveChannel(currentChannel);
        console.log("currentChannel", currentChannel.cid);
      } catch (error) {
        console.log("Error in init stream chat client", error);
      } finally {
        setLoading(false);
      }
    }
    handleActiveChannel();
  }, [chatClient, targetUserId, authUser]);

  if (loading || !chatClient || !activeChannel)
    return <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-base-100">
      Connecting to chat...
    </div>;

  return (
    <div>
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Channel List Sidebar */}
        <div className="w-80 border-r border-base-300">
          <Chat client={chatClient} theme={`str-chat__theme-${isDarkMode ? 'dark' : 'light'}`}>
            {authUser?._id && (
              <ChannelList
                Preview={(previewProps) => (
                  <CustomChannelPreview
                    {...previewProps}
                    currentActiveChannel={activeChannel}
                  />
                )}
                filters={filters}
                sort={sort}
                options={{ state: true, presence: true, limit: 10 }}
              />
            )}
          </Chat>
        </div>

        {/* Chat Window */}
        <div className="w-full border-r border-base-300 bg-base-200">
          <Chat client={chatClient} theme={`str-chat__theme-${isDarkMode ? 'dark' : 'light'}`}>
            <Channel channel={activeChannel}>
              <div className="relative w-full">
                <Window>
                  <ChannelHeader />
                  <MessageList />
                  <MessageInput focus />
                </Window>
              </div>
            </Channel>
          </Chat>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
