import { useEffect } from "react";
import { useAuthStore, useUserStore } from "../store/store";
import { CameraIcon } from "lucide-react";

function HomePage() {
  const { allUsers, friends, getAllUsers, getFriends } = useUserStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getAllUsers();
    getFriends(); 
  }, [getAllUsers, getFriends]);
  console.log('friendsfriends', friends)

  return (
    <div className="w-full p-8">
      <h1 className="text-2xl font-bold mb-6">Friends</h1>
      <div className="flex flex-row gap-6 mb-8 flex-wrap">
        {authUser && friends && friends.length > 0 ? (
          authUser.friends.map(friend => (
            <div key={friend.id} className="card bg-base-200 shadow-md p-4 flex flex-col items-center w-48 hover:scale-105 transition-transform">
              <div className={`avatar ${friend.online ? "avatar-online" : "avatar-offline"} mb-2`}>
                <div className="w-16 rounded-full">
                  <img src={friend.profilePicture || 'https://img.daisyui.com/images/profile/demo/gordon@192.webp'} alt={friend.name} />
                </div>
              </div>
              <div className="font-semibold text-center">{friend.name}</div>
            </div>
          ))
        ) : (
          <div className="text-base-content/70">No friends yet.</div>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">Meet New People</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {allUsers.map(user => (
          <div key={user.id} className="card bg-base-200 shadow p-4 flex flex-wrap items-center hover:scale-105 transition-transform">
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
              <span className={`inline-block w-2 h-2 rounded-full ${user.online ? 'bg-success' : 'bg-base-content/30'}`}></span>
              <span className="text-xs text-base-content/60">{user.online ? 'Online' : 'Offline'}</span>
            </div>
            {/* Add Friend button */}
            <button
              className="btn btn-sm btn-primary mt-3"
              onClick={() => {/* TODO: implement add friend logic */ }}
              disabled={!!authUser && authUser.friends.some(friend => friend.id === user.id)}
            >
              {!!authUser && authUser.friends.some(f => f.id === user.id)
                ? 'Friend' : 'Add Friend'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage;