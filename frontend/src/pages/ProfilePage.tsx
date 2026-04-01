import { useEffect, useState } from "react";
import AppSidebar from "../components/AppSidebar";
import { useNavigate, useParams } from "react-router-dom";
import UserService, { type IUserProfile } from "../services/user.service";
import formatInitials from "../utils/formatInitials";
import PostService, { type IPost } from "../services/post.service";
import Post from "../components/Post";
import authService, { type IUserAuth } from "../services/auth.service";
import { formatDate } from "../utils/formatDate";
import { FollowService, type IFollow } from "../services/follow.service";

type Tab = "posts" | "likes";

export default function ProfilePage() {
  const { username } = useParams();
  const [tab, setTab] = useState<Tab>("posts");
  const [following, setFollowing] = useState<IFollow[]>([]);
  const [followers, setFollowers] = useState<IFollow[]>([]);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState<string | null>("");
  const [bioInput, setBioInput] = useState<string | null>("");
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const [posts, setPosts] = useState<IPost[] | null>(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [userLogged, setUserLogged] = useState<IUserAuth | null>(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });

  const handleVerifyUser = async () => {
    try {
      if (!token) {
        navigate("/login");
      } else {
        const response = await authService.getMe();
        setUserLogged(response);
      }
    } catch {
      navigate("/login");
    }
  };

  useEffect(() => {
    handleVerifyUser();
  }, []);

  const handleSearchProfile = async (id: string) => {
    try {
      const response = await UserService.getProfile(id);
      setUserProfile(response);
      setBio(response.bio);
      setBioInput(response.bio);
    } catch (error) {}
  };

  const handleSearchPosts = async (userId: string) => {
    try {
      const response = await PostService.findAllByUserId(userId);
      setPosts(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditProfile = async () => {
    try {
      const response = await UserService.update(userProfile!.id, {
        bio: bioInput || "",
      });
      setBioInput(response.bio);
      setBio(bioInput);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostLiked = async () => {
    try {
      const posts = await UserService.getLikedPosts(userProfile!.username);
      setPosts(posts);
    } catch (error) {}
  };

  const followersVerify = followers.some(
    (user) => user.followerId === userLogged?.id,
  );
  
  const handleFollow = async () => {
    if (!userProfile) return null;

    try {
      if (followersVerify) {
        await FollowService.unfollow(userProfile.id!);
      } else {
        await FollowService.follow(userProfile.id);
      }

      await handleSearchFollowers(userProfile.id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchFollowers = async (userId: string) => {
    try {
      const response = await FollowService.getFollowers(userId);
      setFollowers(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchFollowing = async () => {
    if (!userProfile?.id) return null;
    try {
      const response = await FollowService.getFollowing(userProfile?.id);
      setFollowing(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userProfile?.id) {
      handleSearchPosts(userProfile.id);
      handleSearchFollowers(userProfile.id);
      handleSearchFollowing();
    }
  }, [userProfile]);

  useEffect(() => {
    if (username) {
      handleSearchProfile(username);
    } else {
      navigate("/home");
    }
  }, [username]);

  return (
    <main className="grid grid-cols-[auto_1fr_auto] h-dvh max-w-7xl mx-auto bg-[#070714] text-slate-100 font-sans">
      <AppSidebar />

      {/* ── CONTEÚDO ── */}
      <section
        className="overflow-y-auto"
        style={{
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Header com volta */}
        <div
          className="sticky top-0 z-10 backdrop-blur-sm px-4 py-3 flex items-center gap-4"
          style={{
            background: "rgba(7,7,20,0.85)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <button className="p-2 rounded-full hover:bg-white/5 transition-colors text-slate-400 hover:text-slate-100">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-100">
              {userProfile?.username}
            </h1>
            <p className="text-xs text-slate-500">
              {userProfile?.stats?.postsCount} posts
            </p>
          </div>
        </div>

        {/* Banner */}
        <div
          className="h-36 w-full relative"
          style={{
            background:
              "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 40%, #6d28d9 70%, #a21caf 100%)",
          }}
        >
          {/* Padrão decorativo sutil */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 80% 20%, #c026d3 0%, transparent 40%)",
            }}
          />
        </div>

        {/* Avatar + ações */}
        <div className="px-4 pb-4">
          <div className="flex items-end justify-between -mt-12 mb-4">
            {/* Avatar */}
            <div
              className="w-24 h-24 rounded-full border-4 flex items-center justify-center text-white font-extrabold text-2xl shrink-0 z-10"
              style={{
                background: "linear-gradient(135deg, #6d28d9, #a21caf)",
                borderColor: "#070714",
              }}
            >
              {formatInitials(userProfile?.username)}
            </div>

            {/* Botão */}
            <div className="mt-14">
              {userLogged && userLogged.id === userProfile?.id ? (
                <button
                  onClick={() => setEditingBio(true)}
                  className="px-5 py-2 rounded-full text-sm font-bold border transition-all hover:bg-white/5"
                  style={{
                    borderColor: "rgba(255,255,255,0.2)",
                    color: "#e2e8f0",
                  }}
                >
                  Editar perfil
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleFollow();
                  }}
                  className="px-5 py-2 rounded-full text-sm font-bold transition-all"
                  style={
                    followersVerify
                      ? {
                          border: "1px solid rgba(255,255,255,0.2)",
                          color: "#e2e8f0",
                          background: "transparent",
                        }
                      : {
                          background:
                            "linear-gradient(135deg, #6d28d9, #7c3aed)",
                          color: "white",
                        }
                  }
                >
                  {followersVerify ? "Seguindo" : "Seguir"}
                </button>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="mb-4">
            <h2 className="text-xl font-extrabold text-slate-100">
              {userProfile?.name}
            </h2>
            <p className="text-slate-500 text-sm mb-3">
              @{userProfile?.username}
            </p>

            {editingBio ? (
              <div className="mb-3">
                <textarea
                  value={bioInput || ""}
                  onChange={(e) => setBioInput(e.target.value)}
                  maxLength={160}
                  rows={3}
                  className="w-full bg-transparent text-sm text-slate-200 resize-none outline-none rounded-xl p-3"
                  style={{ border: "1px solid rgba(109,40,217,0.5)" }}
                />
                <div className="flex gap-2 mt-2 justify-end">
                  <button
                    onClick={() => setEditingBio(false)}
                    className="px-4 py-1.5 text-sm rounded-full text-slate-400 hover:text-slate-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      setBio(bioInput);
                      setEditingBio(false);
                      handleEditProfile();
                    }}
                    className="px-4 py-1.5 text-sm rounded-full font-bold text-white transition-all hover:opacity-85"
                    style={{
                      background: "linear-gradient(135deg, #6d28d9, #7c3aed)",
                    }}
                  >
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                {bio}
              </p>
            )}

            <div className="flex items-center gap-1.5 text-slate-500 text-sm">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zm-7-9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
              <span>
                Entrou em
                {userProfile?.createdAt
                  ? " " + formatDate(userProfile.createdAt)
                  : "Data desconhecida"}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-5 mb-1 text-sm">
            <button className="hover:underline">
              <span className="font-bold text-slate-100">
                {following.length}
              </span>
              <span className="text-slate-500 ml-1">Seguindo</span>
            </button>
            <button className="hover:underline">
              <span className="font-bold text-slate-100">
                {followers?.length}
              </span>
              <span className="text-slate-500 ml-1">Seguidores</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          {(["posts", "likes"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);

                if (t === "likes") {
                  handlePostLiked();
                } else if (userProfile?.id) {
                  handleSearchPosts(userProfile.id);
                }
              }}
              className={`flex-1 py-4 text-sm font-semibold transition-colors relative ${
                tab === t
                  ? "text-slate-100"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t === "posts" ? "Posts" : "Curtidas"}
              {tab === t && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-12 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #6d28d9, #a21caf)",
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Lista */}
        {tab === "posts"
          ? posts &&
            posts?.length > 0 &&
            userProfile &&
            posts?.map((post) => (
              <Post
                key={post.id}
                data={post}
                searchPostData={() => handleSearchPosts(userProfile.id)}
                userData={userLogged!}
              />
            ))
          : userProfile &&
            posts?.map((post) => (
              <Post
                key={post.id}
                data={post}
                searchPostData={handlePostLiked}
                userData={userProfile}
              />
            ))}
      </section>

      {/* ── SIDEBAR DIREITA (vazia / placeholder) ── */}
      <aside className="px-4 py-3 w-72 hidden xl:block" />
    </main>
  );
}
