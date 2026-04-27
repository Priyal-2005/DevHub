import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import AppShell from "../components/AppShell";
import PostCard from "../components/PostCard";
import { useAuth } from "../hooks/useAuth";
import { getFollowers, getFollowing, toggleFollow } from "../services/followService";
import { getPosts } from "../services/postService";
import { getProfile, upsertProfile } from "../services/profileService";
import { getInitials } from "../utils/format";

function ProfilePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    bio: "",
    skills: "",
    githubUrl: "",
    portfolioUrl: "",
  });

  const isOwnProfile = user?.id === id;

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError("");

      try {
        const profilePromise = getProfile(id).catch((requestError) => {
          if (isOwnProfile && requestError.response?.status === 404) {
            return {
              id: `local-${id}`,
              userId: id,
              bio: "",
              skills: [],
              githubUrl: "",
              portfolioUrl: "",
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
              },
            };
          }

          throw requestError;
        });

        const [profileData, postsData, followersData, followingData, currentFollowingData] = await Promise.all([
          profilePromise,
          getPosts({ page: 1, limit: 50 }),
          getFollowers(id),
          getFollowing(id),
          user?.id ? getFollowing(user.id) : Promise.resolve({ items: [] }),
        ]);

        const posts = (postsData?.items || [])
          .filter((post) => post.author?.id === id)
          .map((post) => ({
            ...post,
            likesCount: post.likesCount || 0,
            commentsCount: post.commentsCount || 0,
            comments: post.comments || [],
            isLiked: false,
          }));

        setProfile(profileData);
        setUserPosts(posts);
        setFollowers(followersData?.items || []);
        setFollowing(followingData?.items || []);
        setIsFollowing((currentFollowingData?.items || []).some((item) => item.id === id));
        setProfileForm({
          bio: profileData.bio || "",
          skills: Array.isArray(profileData.skills) ? profileData.skills.join(", ") : "",
          githubUrl: profileData.githubUrl || "",
          portfolioUrl: profileData.portfolioUrl || "",
        });
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Could not load this profile.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadProfile();
    }
  }, [id, user?.id]);

  const skills = useMemo(() => {
    if (!profile?.skills) {
      return [];
    }

    return Array.isArray(profile.skills) ? profile.skills : [];
  }, [profile]);

  const handleToggleFollow = async () => {
    if (isOwnProfile) {
      return;
    }

    setIsSubmitting(true);
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    setFollowers((current) =>
      nextState
        ? [...current, { id: user.id, name: user.name, email: user.email, avatar: user.avatar }]
        : current.filter((item) => item.id !== user.id)
    );

    try {
      await toggleFollow(id);
    } catch (requestError) {
      setIsFollowing(!nextState);
      setFollowers((current) =>
        !nextState
          ? [...current, { id: user.id, name: user.name, email: user.email, avatar: user.avatar }]
          : current.filter((item) => item.id !== user.id)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        bio: profileForm.bio || undefined,
        skills: profileForm.skills
          ? profileForm.skills
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : undefined,
        githubUrl: profileForm.githubUrl || undefined,
        portfolioUrl: profileForm.portfolioUrl || undefined,
      };

      const updatedProfile = await upsertProfile(payload);
      setProfile((current) => ({
        ...current,
        ...updatedProfile,
        user: current?.user || profile?.user,
      }));
      setEditingProfile(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update your profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateUserPost = (nextPost) => {
    setUserPosts((current) => current.map((item) => (item.id === nextPost.id ? nextPost : item)));
  };

  const rightAside = (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-white">Network</h2>
      <div className="mt-4 grid gap-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-sm text-slate-400">Followers</p>
          <p className="mt-2 text-2xl font-semibold text-white">{followers.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-sm text-slate-400">Following</p>
          <p className="mt-2 text-2xl font-semibold text-white">{following.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <p className="text-sm text-slate-400">Posts</p>
          <p className="mt-2 text-2xl font-semibold text-white">{userPosts.length}</p>
        </div>
      </div>
    </div>
  );

  return (
    <AppShell title="Developer profile" subtitle="Your public-facing DevHub identity." rightAside={rightAside}>
      {isLoading ? <div className="card p-6 text-slate-300">Loading profile...</div> : null}
      {error ? <div className="card p-6 text-rose-300">{error}</div> : null}

      {!isLoading && !error && profile ? (
        <>
          <section className="card p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-sky-500 text-lg font-semibold text-slate-950">
                  {getInitials(profile.user?.name)}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">{profile.user?.name}</h2>
                  <p className="mt-1 text-slate-400">{profile.user?.email}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                    {profile.bio || "No bio added yet."}
                  </p>
                </div>
              </div>

              {isOwnProfile ? (
                <button type="button" onClick={() => setEditingProfile((current) => !current)} className="button-secondary">
                  {editingProfile ? "Close editor" : "Edit profile"}
                </button>
              ) : (
                <button type="button" onClick={handleToggleFollow} disabled={isSubmitting} className="button-primary">
                  {isSubmitting ? "Updating..." : isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {skills.length ? (
                skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-200">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">No skills listed yet.</span>
              )}
            </div>
          </section>

          {editingProfile ? (
            <section className="card p-6">
              <form className="space-y-4" onSubmit={handleProfileSave}>
                <textarea
                  name="bio"
                  rows="4"
                  className="input resize-none"
                  placeholder="Tell people a little about your work..."
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                />
                <input
                  name="skills"
                  className="input"
                  placeholder="React, Node.js, Prisma"
                  value={profileForm.skills}
                  onChange={handleProfileChange}
                />
                <input
                  name="githubUrl"
                  className="input"
                  placeholder="GitHub URL"
                  value={profileForm.githubUrl}
                  onChange={handleProfileChange}
                />
                <input
                  name="portfolioUrl"
                  className="input"
                  placeholder="Portfolio URL"
                  value={profileForm.portfolioUrl}
                  onChange={handleProfileChange}
                />
                <div className="flex justify-end">
                  <button type="submit" disabled={isSubmitting} className="button-primary">
                    {isSubmitting ? "Saving..." : "Save profile"}
                  </button>
                </div>
              </form>
            </section>
          ) : null}

          <section className="space-y-4">
            <div className="card p-6">
              <h3 className="text-xl font-semibold text-white">Posts</h3>
              <p className="mt-2 text-sm text-slate-400">Recent posts from this developer.</p>
            </div>

            {userPosts.length ? (
              userPosts.map((post) => <PostCard key={post.id} post={post} onPostUpdate={updateUserPost} />)
            ) : (
              <div className="card p-6 text-slate-400">No posts published yet.</div>
            )}
          </section>
        </>
      ) : null}
    </AppShell>
  );
}

export default ProfilePage;
