import React, { useState } from "react";
import { addDoc, collection, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/ToastProvider.jsx";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();

  React.useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const ref = doc(db, "posts", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          addToast("Post not found", "error");
          navigate("/");
          return;
        }
        const data = snap.data();
        setTitle(data.title || "");
        setDescription(data.description || data.postText || "");
        setImageUrl(data.imageUrl || data.image || "");
      } catch (e) {
        console.error("Failed to load post:", e);
        addToast("Failed to load post", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("[CreatePost] currentUser:", auth.currentUser);
    if (!auth.currentUser) {
      addToast("Please sign in to add a post.", "error");
      navigate("/login");
      return;
    }
    if (!title.trim() || !description.trim()) {
      addToast("Title and description are required.", "error");
      return;
    }
    try {
      setSubmitting(true);
      if (id) {
        // Edit flow
        const ref = doc(db, "posts", id);
        await updateDoc(ref, {
          title: title.trim(),
          description: description.trim(),
          imageUrl: imageUrl.trim() || null,
          // Do not overwrite author/createdAt on edit
          updatedAt: serverTimestamp(),
        });
        addToast("Post updated", "success");
      } else {
        // Create flow
        const postsRef = collection(db, "posts");
        const payload = {
          title: title.trim(),
          description: description.trim(),
          imageUrl: imageUrl.trim() || null,
          author: {
            id: auth.currentUser.uid,
            name: auth.currentUser.displayName || auth.currentUser.email || "Anonymous",
          },
          createdAt: serverTimestamp(),
        };
        console.log("[CreatePost] adding payload:", payload);
        const res = await addDoc(postsRef, payload);
        console.log("[CreatePost] added doc id:", res.id);
        addToast("Post added", "success");
      }
      navigate("/");
    } catch (err) {
      console.error("Failed to add/update post:", err?.code, err?.message, err);
      addToast(id ? "Failed to update post." : "Failed to add post.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="createPostPage">
      <h1>{id ? "Edit Post" : "Create Post"}</h1>
      <form onSubmit={onSubmit} className="createPostForm">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
        <div className="formRow">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
          />
        </div>

        <div className="formRow">
          <label>Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="formRow">
          <label>Description</label>
          <textarea
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write your post description..."
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? (id ? "Updating..." : "Posting...") : id ? "Update Post" : "Add Post"}
        </button>
          </>
        )}
      </form>
    </div>
  );
}

export default CreatePost;