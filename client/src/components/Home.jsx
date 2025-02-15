import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('token'));
  }, []);

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Organize Your Day</h1>
          <p className="subtitle">Simple, effective task management for everyone</p>
          
          <div className="cta-buttons">
            {isAuthenticated ? (
              <Link to="/todos" className="btn btn-primary">My Tasks</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary">Get Started</Link>
                <Link to="/register" className="btn btn-secondary">Create Account</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 

