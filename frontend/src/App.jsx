import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext.jsx";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import { logoutUser } from "./services/authService";
import { getCurrentUser } from "./services/authService";


function App() {
  const { user, login, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

useEffect(() => {
  const validateUser = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      return;
    }

    try {
      const data = await getCurrentUser(accessToken);
      login(data.user);
    } catch (error) {
      console.error(
        "Token validation failed:",
        error.response?.data || error
      );

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      logout();
    }
  };

  validateUser();
}, []);
const handleLoginSuccess = (userData) => {
  login(userData);
};
  const handleLogout = async () => {
  const accessToken = localStorage.getItem("accessToken");

  try {
    if (accessToken) {
      await logoutUser(accessToken);
    }
  } catch (error) {
    console.error(
      "Logout failed:",
      error.response?.data || error
    );
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    logout();
  }
};
const handleGetProfile = async () => {
  console.log("Button clicked!");

  const accessToken = localStorage.getItem("accessToken");

  console.log("Access token:", accessToken);

  if (!accessToken) {
    console.log("No access token found");
    return;
  }

  try {
    const data = await getCurrentUser();
  } catch (error) {
    console.error(
      "Protected API failed:",
      error.response?.data || error
    );
  }
};

  return (
    <div>
      <Header
        user={user}
        onLoginClick={() => setShowLogin(true)}
        onSignupClick={() => setShowSignup(true)}
        onLogout={handleLogout}
      />

      <main className="main-content">

        <p>
          Welcome to our website. Please login or create an account
          to continue.
        </p>
      </main>
{showLogin && (
  <LoginModal
    onClose={() => setShowLogin(false)}
    onLoginSuccess={handleLoginSuccess}
  />
)}

     {showSignup && (
  <SignupModal
    onClose={() => setShowSignup(false)}
    onLoginSuccess={handleLoginSuccess}
  />
)}
    </div>
  );
}

export default App;