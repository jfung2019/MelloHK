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

  return (
    <div className="w-full p-8">
<h1 className="text-2xl font-bold mb-6">Friends</h1>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
  {!isFriendListLoading && friends.length > 0 ? (
    friends.map(friend => (
      <div
        key={friend._id}
        className="w-full bg-base-200 shadow-md rounded-2xl p-3 md:p-4 hover:scale-105 transition-transform flex flex-col"
      >
        <div className="flex items-center gap-3 md:gap-4 mb-2">
          <div className="avatar">
            <div className="w-14 md:w-16 rounded-full">
              <img src={friend.profilePicture || 'https://img.daisyui.com/images/profile/demo/gordon@192.webp'} alt={friend.name} />
            </div>
          </div>
          <h2 className="font-semibold text-base md:text-lg truncate">{friend.name}</h2>
        </div>
        <div className="font-medium text-sm md:text-base w-full bg-base-300 rounded-2xl p-2 mb-2">{friend.bio}</div>
        <Link className="btn btn-sm btn-primary w-full mt-auto" to={`/chat/${friend._id}`}>Message</Link>
      </div>
    ))
  ) : (
    <div className="text-base-content/70">No friends yet.</div>
  )}
</div>

      <h2 className="text-xl font-semibold mb-4">Meet New People</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {allUsers.map(user => (
          <div key={user._id} className="card bg-base-200 shadow p-4 flex flex-row items-center hover:scale-105 transition-transform gap-4">
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
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate" title={user.name}>{user.name}</div>
              <div className="text-xs text-base-content/70 truncate" title={user.email}>{user.email}</div>
            </div>

            {/* Add Friend button */}
            <div className="ml-auto flex items-center">
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
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage;