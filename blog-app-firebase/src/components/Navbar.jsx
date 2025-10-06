import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase-config';
import './Navbar.css';

function Navbar({ user }) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current || menuRef.current.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setOpen(false);
      navigate('/login');
    } catch (e) {
      console.error('Failed to sign out:', e);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Music Blog
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              Home
            </Link>
          </li>
          {user ? (
            <li className="navbar-item user-menu" ref={menuRef}>
              <button
                className="navbar-link user-trigger"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
              >
                Hi {user.displayName || user.email}
                <span className="chevron" aria-hidden>▾</span>
              </button>
              {open && (
                <div className="dropdown" role="menu">
                  <button className="dropdown-item" onClick={handleLogout} role="menuitem">
                    Logout
                  </button>
                </div>
              )}
            </li>
          ) : (
            <li className="navbar-item">
              <Link to="/login" className="navbar-link">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
