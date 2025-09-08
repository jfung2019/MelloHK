import { CameraIcon, LoaderCircle } from "lucide-react";
import { useAuthStore } from "../store/store"
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { countryOptions } from "../constants/countries";

function ProfileCompletionPage() {
  const { authUser, updateProfile } = useAuthStore();
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "",
    profilePicture: authUser?.profilePicture || ""
  });
  console.log('ProfileCompletionPage init', authUser)

  // validate the form input for the required fields
  const validateFormCompletion = (): boolean => {
    const validations = [
      { valid: formData.name.trim(), message: "Name is required!" },
      { valid: formData.name.length >= 2, message: "Name must be at least 2 characters." },
      { valid: formData.name.length <= 30, message: "Name must be at most 30 characters." },
      { valid: formData.bio.trim(), message: "Bio is required!" },
      { valid: formData.bio.length <= 160, message: "Bio must be at most 160 characters." },
      { valid: formData.location.trim(), message: "Location is required!" },
      { valid: formData.location.length >= 2, message: "Location must be at least 2 characters." },
      { valid: formData.location.length <= 30, message: "Location must be at most 30 characters." },
      { valid: formData.profilePicture.trim(), message: "Profile picture is required!" }
    ];

    for (const rule of validations) {
      if (!rule.valid) {
        toast.error(rule.message);
        return false;
      }
    }
    return true;
  };

  // handleSubmit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateFormCompletion() === true) return updateProfile(formData);
  }

  console.log("profile Completion page", authUser);

  return (
    <div className="flex flex-col items-center gap-6 mt-8">
      <h1 className="text-2xl font-bold">Complete your Profile</h1>
      {formData.profilePicture && !imgError ? (
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
      ) : (
        <div className="relative w-24 h-24 flex items-center justify-center">
          <CameraIcon className="size-18" />
        </div>
      )}
      <form className="flex flex-col gap-4 w-full max-w-md" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
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
        <div className="flex flex-col gap-2">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            className="w-full rounded-2xl bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary shadow-inner px-6 py-4 transition-all duration-200 placeholder-gray-400"
            value={formData.bio}
            onChange={e => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Tell us about yourself"
            rows={3}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="location">Location</label>
          <div className="relative">
            <select
              id="location"
              style={{ minWidth: '100%' }}
              className="w-full min-w-full appearance-none rounded-2xl bg-gray-800/80 text-gray-100 border border-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary shadow-inner px-6 py-4 pr-12 transition-all duration-200 focus:bg-gray-900 focus:text-primary"
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
        <div className="flex flex-col gap-2">
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
        <button className="btn btn-primary w-full" type="submit">Save Profile</button>
      </form>
    </div>
  )
}

export default ProfileCompletionPage