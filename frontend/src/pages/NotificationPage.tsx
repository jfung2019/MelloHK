import { useEffect } from "react";
import { useUserStore } from "../store/store"

function NotificationPage() {
  const { acceptFriendRequest, friendRequestData, friendRequestDataLoading, getAllFriendRequests } = useUserStore();
  console.log('friendRequestData friendRequestData', friendRequestData);

  useEffect(() => {
    getAllFriendRequests();
  }, [getAllFriendRequests])

  return (
    <div className="w-full p-4">
      <h1 className="text-3xl">Notification Page</h1>
      <div className="py-4">
        <div className="grid grid-cols-3 gap-4">
          {!friendRequestDataLoading && friendRequestData && friendRequestData.allFriendRequests.length > 0 ? friendRequestData.allFriendRequests.map(friendRequest =>
            <div className="card flex gap-2 bg-base-200 p-4" key={friendRequest._id}>
              <div className="avatar flex items-center mb-2 gap-4">
                <div className="w-16 rounded-full">
                  <img src={friendRequest.sender.profilePicture || 'https://img.daisyui.com/images/profile/demo/gordon@192.webp'} alt={friendRequest.sender.name} />
                </div>
                <h1 className="text-3xl">{friendRequest.sender.name}</h1>
              </div>
              <p className="bg-base-300 rounded-2xl p-2">{friendRequest.sender.bio}</p>
              <button className="btn btn-sm btn-primary mt-3" onClick={() => acceptFriendRequest(friendRequest._id)}>Accept Friend Request</button>
            </div>
          ) : "No notifications"}
        </div>
      </div>
    </div>
  )
}

export default NotificationPage