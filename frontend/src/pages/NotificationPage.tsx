import { useEffect } from "react";
import { useUserStore } from "../store/store";
import { CameraIcon } from "lucide-react";

function NotificationPage() {
  const { acceptFriendRequest, friendRequestData, friendRequestDataLoading, getAllFriendRequests } = useUserStore();

  useEffect(() => {
    getAllFriendRequests();
  }, [getAllFriendRequests]);

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
        {!friendRequestDataLoading && friendRequestData && friendRequestData.allFriendRequests.length > 0 ? friendRequestData.allFriendRequests.map(friendRequest => (
          <div key={friendRequest._id} className="card bg-base-200 shadow p-4 flex flex-row items-center hover:scale-102 transition-transform gap-4">
            {friendRequest.sender.profilePicture ? (
              <div className="avatar mb-2">
                <div className="w-16 rounded-full">
                  <img src={friendRequest.sender.profilePicture} alt={friendRequest.sender.name} />
                </div>
              </div>
            ) : (
              <div className="w-16 h-16">
                <CameraIcon className="size-16" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate" title={friendRequest.sender.name}>{friendRequest.sender.name}</div>
              <div className="text-xs text-base-content/70 truncate" title={friendRequest.sender.bio}>{friendRequest.sender.bio}</div>
            </div>
            <div className="ml-auto flex items-center">
              <button className="btn btn-sm btn-primary mt-3" onClick={() => acceptFriendRequest(friendRequest._id)}>
                Accept
              </button>
            </div>
          </div>
        )) : <div className="text-base-content/70">No notifications</div>}
      </div>
    </div>
  );
}

export default NotificationPage;