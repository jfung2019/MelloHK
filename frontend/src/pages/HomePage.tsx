import { useEffect } from "react";
import { useUserStore } from "../store/store";
import { CameraIcon } from "lucide-react";
import { Link } from "react-router-dom";

function HomePage() {
  const { allUsers, friends, getAllUsers, sendFriendRequest, getAllFriendRequests, friendRequestData, isFriendListLoading, getFriends } = useUserStore();

  useEffect(() => {
    getAllUsers();
    getFriends();
    getAllFriendRequests();
  }, [getAllUsers, getFriends, getAllFriendRequests]);
  console.log('friendsfriends,', friends)

  return (
    <div className="w-full p-8">
      <h1 className="text-2xl font-bold mb-6">Friends</h1>
      {/* Friend card */}
      {/* picture name in 1 row */}
      {/* bio in 1 row */}
      {/* button in 1 row to message friend */}
      <div className="grid grid-cols-3 gap-6 mb-8 flex-wrap">
        {!isFriendListLoading && friends.length > 0 ? (
          friends.map(friend => (
            <div key={friend._id} className="w-full bg-base-200 shadow-md rounded-2xl p-4 hover:scale-105 transition-transform">
              <div className="flex items-center gap-4">
                {/* ${friend.online ? "avatar-online" : "avatar-offline"} */}
                <div className={`avatar mb-2`}>
                  <div className="w-16 rounded-full">
                    <img src={friend.profilePicture || 'https://img.daisyui.com/images/profile/demo/gordon@192.webp'} alt={friend.name} />
                  </div>
                </div>
                <h1 className="font-semibold text-center">{friend.name}</h1>
              </div>
                <h1 className="font-semibold w-full bg-base-300 rounded-2xl p-2">{friend.bio}</h1>
               <Link className="btn btn-sm btn-primary mt-3 w-full" to={`/chat/${friend._id}`}>Message</Link>
            </div>
          ))
        ) : (
          <div className="text-base-content/70">No friends yet.</div>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">Meet New People</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {allUsers.map(user => (
          <div key={user._id} className="card bg-base-200 shadow p-4 flex flex-wrap items-center hover:scale-105 transition-transform">
            {user.profilePicture
              ?
              <div className={`avatar mb-2`}>
                <div className="w-16 rounded-full">
                  <img src={user.profilePicture} alt={user.name} />
                </div>
              </div>
              :
              <div className="w-16 h-16">
                <CameraIcon className="size-16" />
              </div>
            }
            <div className="font-semibold text-center">{user.name}</div>
            <div className="text-xs text-base-content/70 text-center">{user.email}</div>
            {/* Online status indicator */}
            <div className="flex items-center gap-2 mt-2">
              {/* ${user.online ? 'bg-success' : 'bg-base-content/30'} */}
              <span className={`inline-block w-2 h-2 rounded-full`}></span>
              {/* {user.online ? 'Online' : 'Offline'} */}
              <span className="text-xs text-base-content/60">Online</span>
            </div>
            {/* Add Friend button */}
            <button
              className="btn btn-sm btn-primary mt-3"
              onClick={() => { sendFriendRequest(user._id) }}
              disabled={!!friendRequestData?.outgoingSentFriendRequests?.some(req => req.recipient._id === user._id)}
            >
              {friendRequestData?.outgoingSentFriendRequests?.some(req => req.recipient._id === user._id)
                ? 'Pending'
                : 'Add Friend'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage;