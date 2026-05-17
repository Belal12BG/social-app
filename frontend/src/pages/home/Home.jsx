import { useState } from "react";
// import { useSelector } from "react-redux";
import Share from "../../components/share/Share";
import Posts from "../../components/posts/Posts";

const Home = () => {
  // const { darkMode } = useSelector((state) => state.theme);
  const [newPost, setNewPost] = useState(null);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }} className="py-3 px-2">
      <Share onPostCreated={(post) => setNewPost(post)} />
      <Posts newPost={newPost} />
    </div>
  );
};

export default Home;
