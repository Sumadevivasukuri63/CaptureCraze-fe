import { useState, useEffect } from 'react';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  // Load remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in both fields");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
        alert("Login successful!");

        if (remember) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Optional redirect after login:
        // window.location.href = "/dashboard";
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      alert("Error logging in");
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    alert("Logged out successfully");
  };

  return (
    <div className="login-container">
      {!isLoggedIn ? (
        <form onSubmit={handleLogin} className="login-form">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="remember-me">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              id="remember"
            />
            <label htmlFor="remember">Remember me</label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        <div className="logout-section">
          <h2>You are logged in.</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default Login;
