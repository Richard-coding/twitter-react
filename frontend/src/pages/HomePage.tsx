import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import PostService from "../services/post.service";

const HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);

  const handleVerifyUser = async () => {
    try {
      if (!token) {
        navigate("/login");
      } else {
        await authService.getMe();
        searchPostData();
      }
    } catch {
      navigate("/login");
    }
  };

  useEffect(() => {
    handleVerifyUser();
  }, []);

  const searchPostData = async () => {
    try {
      const response = await PostService.findAll();
      setPosts(response);
    } catch (error) {}
  };

  const handlePost = async () => {
    try {
      await PostService.create({ content: input });
      await searchPostData();
    } catch (error) {}
  };

  return (
    <main className="grid grid-cols-[1fr_2fr_1fr] gap-4 h-dvh max-w-7xl mx-auto  ">
      <div className="border-2 border-solid border-black">
        <ul>
          <li>Pinto</li>
          <li>Pinto</li>
          <li>Pinto</li>
          <li>Pinto</li>
          <li>Pinto</li>
          <li>Pinto</li>
          <li>Pinto</li>
          <li>Pinto</li>
        </ul>
      </div>
      <div className="border-2 border-solid border-black ">
        <div className="text-center">
          <input
            type="text"
            value={input}
            placeholder="What's Happening"
            className="p-4 border-2"
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="bg-blue-400 p-4" onClick={() => handlePost()}>
            Post
          </button>
        </div>

        {posts.map((post) => (
          <div key={post.id}>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
      <div className="border-2 border-solid border-black">Pinto</div>
    </main>
  );
};

export default HomePage;
