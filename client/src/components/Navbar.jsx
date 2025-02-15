import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="nav-brand">
          <Link to="/">Todo App</Link>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links-desktop">
          {token ? (
            <>
              <Link to="/todos">My Todos</Link>
              <button onClick={handleLogout} className="btn btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>

        {/* Hamburger Menu Button */}
        <button 
          className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`} 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </button>

        {/* Mobile Menu with Overlay */}
        {isMenuOpen && (
          <>
            <div className="menu-overlay" onClick={toggleMenu}></div>
            <div className="mobile-menu">
              {token ? (
                <>
                  <Link to="/todos" onClick={toggleMenu}>My Todos</Link>
                  <button onClick={handleLogout} className="mobile-menu-button">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={toggleMenu}>Login</Link>
                  <Link to="/register" onClick={toggleMenu}>Register</Link>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 