import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import Post from "../post/Post";

const Posts = ({ userId, newPost }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const url = userId ? `/posts/user/${userId}` : "/posts/feed";
        const res = await axiosInstance.get(url);
        setPosts(res.data);
      } catch (err) {}
      setLoading(false);
    };
    fetchPosts();
  }, [userId]);

  useEffect(() => {
    if (newPost) setPosts((prev) => [newPost, ...prev]);
  }, [newPost]);

  const handleDelete = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" />
    </div>
  );

  if (!posts.length) return (
    <div className="text-center py-5 text-muted">
      <i className="bi bi-journal-x fs-1 d-block mb-2"></i>
      No posts yet
    </div>
  );

  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id} post={post} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default Posts;
