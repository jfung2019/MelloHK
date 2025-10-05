import { Chat, ChannelList } from "stream-chat-react";
import { useAuthStore, useThemeStore, useUserStore } from "../store/store";
import CustomChannelPreview from "../components/CustomChannelPreview";
import { isDarkTheme } from "../constants/themes";
import { StreamChat, type ChannelSort } from "stream-chat";
import { useEffect, useState } from "react";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

function ChannelListPage() {
  const { theme } = useThemeStore();
  const { authUser } = useAuthStore();
  const { streamToken, getStreamToken } = useUserStore();
  const [chatClient, setChatClient] = useState<StreamChat | undefined>();

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

        // Check if connected user is different from current user
        // Case: Relogging to another user 
        if (client.userID && client.userID !== authUser._id) {
          await client.disconnectUser();
        }

        // Connect if no user or different/new user
        if (!client.userID) {
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.name,
              image: authUser.profilePicture,
            },
            streamToken
          );
        }
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


  if (!chatClient) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <Chat client={chatClient} theme={`str-chat__theme-${isDarkMode ? 'dark' : 'light'}`}>
        <ChannelList
          Preview={(previewProps) => (
            <CustomChannelPreview
              {...previewProps}
            />
          )}
          filters={filters}
          sort={sort}
          options={{ state: true, presence: true, limit: 10 }}
        />
      </Chat>
    </div>
  );
}

export default ChannelListPage;