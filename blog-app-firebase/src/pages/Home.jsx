import React, { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastProvider.jsx";

function Home({ user }) {
  const [postLists, setPostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { addToast } = useToast();
  const addTarget = user ? "/add" : "/login";

  useEffect(() => {
    const postsCollectionRef = collection(db, "posts");
    const getPosts = async () => {
      try {
        const data = await getDocs(postsCollectionRef);
        const docs = data.docs.map((d) => ({ ...d.data(), id: d.id }));
        console.log("Fetched posts:", docs);
        setPostList(docs);
      } catch (e) {
        console.error("Failed to fetch posts:", e);
        setError(e?.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  const deletePost = async (id) => {
    try {
      const postDoc = doc(db, "posts", id);
      await deleteDoc(postDoc);
      setPostList((prev) => prev.filter((p) => p.id !== id));
      addToast("Post removed", "success");
    } catch (e) {
      console.error("Failed to delete:", e);
      addToast("Failed to remove post", "error");
    }
  };

  if (loading) {
    return (
      <div className="homePage">
        Loading posts...
        <Link to={addTarget} className="fab-add-post" aria-label="Add post" title={user ? "Add post" : "Sign in to add a post"}>+
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="homePage">
        Error: {error}
        <Link to={addTarget} className="fab-add-post" aria-label="Add post" title={user ? "Add post" : "Sign in to add a post"}>+
        </Link>
      </div>
    );
  }

  if (!postLists.length) {
    return (
      <div className="homePage">
        No posts found.
        <Link to={addTarget} className="fab-add-post" aria-label="Add post" title={user ? "Add post" : "Sign in to add a post"}>+
        </Link>
      </div>
    );
  }

  return (
    <div className="homePage">
      {postLists.map((post) => (
        <div className="post" key={post.id}>
          <div className="postThumb">
            {post.imageUrl || post.image ? (
              <img src={post.imageUrl || post.image} alt={post.title || "Post image"} />
            ) : (
              <div className="postThumbPlaceholder" aria-hidden="true" />
            )}
          </div>
          <div className="postBody">
            <h2 className="postTitle">{post.title}</h2>
            <p className="postDescription">{post.description ?? post.postText}</p>
            <div className="postMeta">
              <span className="postAuthorAvatar" aria-hidden="true"></span>
              <span className="postAuthorName">{post.author?.name ? post.author.name : "Author"}</span>
              {post.author?.id === auth.currentUser?.uid && (
                <div className="postActions">
                  <button onClick={() => navigate(`/edit/${post.id}`)}>Edit</button>
                  <button onClick={() => deletePost(post.id)}>Remove</button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <Link to={addTarget} className="fab-add-post" aria-label="Add post" title={user ? "Add post" : "Sign in to add a post"}>+
      </Link>
     </div>
  );
}

export default Home;