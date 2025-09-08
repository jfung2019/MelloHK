import { useEffect } from "react";
import { useAuthStore, useUserStore } from "../store/store";
import { CameraIcon } from "lucide-react";

function HomePage() {
  const { allUsers, getAllUsers } = useUserStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers])

  return (
    <div className="flex flex-col gap-4 p-4">
      <div>
        <h1>My Friends</h1>
        {authUser && authUser.friends.map(friend => (
          <div>{friend.name}</div>
        ))}
        {/* if online avatar-online :  avatar-offline */}
        <div className={`avatar avatar-online`}>
          <div className="w-24 rounded-full">
            <img src="https://img.daisyui.com/images/profile/demo/gordon@192.webp" />
          </div>
        </div>
      </div>
      <div>
        <h1 className="">Add and meet friends</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 flex-wrap gap-4 w-full">
          {allUsers.map(user => (
            <div key={user.id} className="flex flex-row items-center gap-4 p-4 border rounded bg-base-200">
              {user.profilePicture ?
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className={`rounded-full w-24 h-24 object-cover transition-opacity duration-300 opacity-100`}
                /> :
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <CameraIcon className="size-18" />
                </div>
              }
              <div className="font-semibold">{user.name}</div>
              <div className="text-xs text-base-content/70">{user.email}</div>
            </div>
          ))}
        </div>
      </div>
      <div>Modal for friend request sent to you list</div>
    </div>
  )
}

export default HomePage;