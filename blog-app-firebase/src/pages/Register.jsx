import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastProvider.jsx";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const onSuccess = async (user) => {
    try {
      if (name && user) {
        await updateProfile(user, { displayName: name });
      }
    } catch (e) {
      console.warn("Failed to set display name", e);
    }
    addToast(`Welcome ${name || user.email}`, "success");
    navigate("/");
  };

  const signInWithGoogle = async () => {
    try {
      setSubmitting(true);
      const result = await signInWithPopup(auth, provider);
      addToast(`Welcome ${result.user.displayName || result.user.email}`, "success");
      navigate("/");
    } catch (err) {
      console.error("Google sign-in failed:", err);
      addToast("Google sign-in failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast("Name is required", "error");
      return;
    }
    if (!email.trim()) {
      addToast("Email is required", "error");
      return;
    }
    if (password.length < 6) {
      addToast("Password must be at least 6 characters", "error");
      return;
    }
    if (password !== confirm) {
      addToast("Passwords do not match", "error");
      return;
    }
    try {
      setSubmitting(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await onSuccess(cred.user);
    } catch (err) {
      console.error("Register failed:", err);
      addToast(err?.message || "Register failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="authPage">
      <div className="authCard">
        <h1 className="page-title">Register</h1>
        <form onSubmit={onSubmit} className="createPostForm">
        <div className="formRow">
          <input
            type="text"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            placeholder="Your name"
            aria-label="Name"
          />
        </div>
        <div className="formRow">
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email"
          />
        </div>
        <div className="formRow">
          <input
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Password"
            aria-label="Password"
          />
        </div>
        <div className="formRow">
          <input
            type="password"
            value={confirm}
            onChange={(e)=>setConfirm(e.target.value)}
            placeholder="Confirm password"
            aria-label="Confirm Password"
          />
        </div>
        <div className="auth-actions">
          <button type="submit" disabled={submitting} className="btn-primary btn-full">{submitting ? "Creating..." : "Register"}</button>
          <button type="button" className="google-btn btn-full" onClick={signInWithGoogle} disabled={submitting}>
            <span className="google-icon" aria-hidden>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.826 32.91 29.28 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.156 7.961 3.039l5.657-5.657C33.64 6.053 28.995 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"/>
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.818C14.304 16.108 18.79 12 24 12c3.059 0 5.842 1.156 7.961 3.039l5.657-5.657C33.64 6.053 28.995 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                <path fill="#4CAF50" d="M24 44c4.913 0 9.388-1.875 12.787-4.943l-5.903-5.001C29.836 35.091 27.041 36 24 36c-5.258 0-9.787-3.058-11.67-7.438l-6.5 5.007C8.11 39.556 15.47 44 24 44z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.356 3.182-3.983 5.59-7.216 6.534.001-.001 5.903 5.001 5.903 5.001C36.212 37.832 40 31.554 40 24c0-1.341-.138-2.651-.389-3.917z"/>
              </svg>
            </span>
            Continue with Google
          </button>
        </div>
        </form>
      </div>
      <div className="authHero" aria-hidden>
        <h2 className="authTagline">
          Explore new <span className="accent">notes</span>,
          <br /> feel every <span className="accent">beat</span>
          <span style={{marginLeft: 8, verticalAlign: 'middle'}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#702C2B">
              <path d="M9 19V6l10-2v13" stroke="#702C2B" strokeWidth="1.5" fill="none"/>
              <circle cx="8" cy="19" r="2.5" fill="#702C2B"/>
              <circle cx="18" cy="17" r="2.5" fill="#C56869"/>
            </svg>
          </span>
        </h2>
        <p className="authSub">Your daily space to share sounds, stories, and vibes.</p>
      </div>
    </div>
  );
}

export default Register;
