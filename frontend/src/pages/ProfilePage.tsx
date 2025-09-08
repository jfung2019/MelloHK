import { useState, type FormEvent } from "react";
import { CameraIcon, LoaderCircle, Mail, Users } from "lucide-react";
import { useAuthStore } from "../store/store";
import toast from "react-hot-toast";
import { countryOptions } from "../constants/countries";
import type { ProfileUpdatePayload } from "../types/types";


function ProfilePage() {
  const { authUser, isSavingProfileLoading, updateProfile } = useAuthStore();
  const [imgLoading, setImgLoading] = useState<boolean>(true);
  const [imgError, setImgError] = useState<boolean>(false);
  const [formData, setFormData] = useState<ProfileUpdatePayload>({
    name: authUser?.name || "",
    profilePicture: authUser?.profilePicture || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "Hong Kong"
  });

  // Helper to check if formData matches initial user data
  const isUnchanged =
    formData.name === (authUser?.name || "") &&
    formData.profilePicture === (authUser?.profilePicture || "") &&
    formData.bio === (authUser?.bio || "") &&
    formData.location === (authUser?.location || "Hong Kong");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required!");
      return;
    }
    if (!formData.profilePicture.trim()) {
      toast.error("Profile picture is required!");
      return;
    }
    if (formData.bio.length > 160) {
      toast.error("Bio must be at most 160 characters.");
      return;
    }
    if (!formData.location.trim()) {
      toast.error("Location is required!");
      return;
    }
    await updateProfile({
      ...formData,
      name: formData.name,
      profilePicture: formData.profilePicture,
      bio: formData.bio || "",
      location: formData.location || ""
    });
  };

  return (
    <div className="bg-base-100 flex flex-col items-center mt-8 gap-6">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body items-center">
          <h1 className="text-2xl font-bold">Hi, {authUser?.name}!</h1>
          <form className="flex flex-col items-center gap-4 mt-2 w-full" onSubmit={handleSubmit}>
            {formData.profilePicture && !imgError ?
              <div className="relative w-24 h-24 flex items-center justify-center">
                {imgLoading && (
                  <LoaderCircle className="absolute animate-spin text-primary w-10 h-10" />
                )}
                <img
                  src={formData.profilePicture}
                  alt="Profile"
                  className={`rounded-full w-24 h-24 object-cover transition-opacity duration-300 ${imgLoading ? "opacity-0" : "opacity-100"}`}
                  onLoad={() => setImgLoading(false)}
                  onError={() => { setImgError(true); setImgLoading(false); }}
                />
              </div>
              :
              <div className="relative w-24 h-24 flex items-center justify-center">
                <CameraIcon className="size-18" />
              </div>
            }
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                className="w-full rounded-2xl bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary shadow-inner px-6 py-4 transition-all duration-200 placeholder-gray-400"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                className="w-full rounded-2xl bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary shadow-inner px-6 py-4 placeholder-gray-400"
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>
            <div className="flex flex-col gap-2 w-full relative">
              <label htmlFor="location">Location</label>
              <div className="relative">
                <select
                  id="location"
                  className="w-full min-w-full appearance-none rounded-2xl text-gray-100 border border-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary shadow-inner px-6 py-4 pr-12 transition-all duration-200 focus:bg-gray-900 focus:text-primary"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                >
                  {countryOptions.map(country => (
                    <option key={country} value={country} className="w-full min-w-full bg-gray-900 text-gray-100 hover:bg-primary hover:text-white">
                      {country}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="profilePicture">Profile Picture URL</label>
              <input
                id="profilePicture"
                type="text"
                className="w-full rounded-2xl bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary shadow-inner px-6 py-4 transition-all duration-200 placeholder-gray-400"
                value={formData.profilePicture}
                onChange={e => setFormData({ ...formData, profilePicture: e.target.value })}
                placeholder="Profile picture URL"
              />
            </div>
            <button
              className={`btn w-full ${isUnchanged || isSavingProfileLoading ? 'bg-gray-700 text-gray-400 cursor-not-allowed border-gray-700' : 'btn-primary'}`}
              type="submit"
              disabled={isUnchanged || isSavingProfileLoading}
            >
              {isSavingProfileLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoaderCircle className="animate-spin w-5 h-5" />
                  Saving...
                </span>
              ) : (
                "Save"
              )}
            </button>
          </form>
          <div className="w-full mt-4">
            <div className="bg-gray-900/80 rounded-2xl shadow-lg p-6 flex flex-col gap-4 border border-gray-800">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Mail className="text-primary w-5 h-5" />
                  <span className="font-semibold">Email:</span>
                  <span className="ml-auto text-gray-400">{authUser?.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="text-primary w-5 h-5" />
                  <span className="font-semibold">Friends:</span>
                  <span className="ml-auto text-gray-400">{authUser?.friends?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;