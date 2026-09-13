import { useState } from "react";
import { loginUser } from "../services/authService";

function LoginModal({ onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
const [errorMessage, setErrorMessage] = useState("");
const [isLoading, setIsLoading] = useState(false);
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
const handleSubmit = async (event) => {
  event.preventDefault();
setErrorMessage("");
setIsLoading(true);
  try {
    const data = await loginUser(formData);

localStorage.setItem("accessToken", data.accessToken);
localStorage.setItem("user", JSON.stringify(data.user));
onLoginSuccess(data.user);
onClose();
  } catch (error) {
  const message =
    error.response?.data?.message ||
    "Something went wrong while logging in.";

  setErrorMessage(message);
}
finally {
  setIsLoading(false);
}
};

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <h2>Login</h2>
        {errorMessage && (
  <p className="error-message">
    {errorMessage}
  </p>
)}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
  type="submit"
  className="submit-button"
  disabled={isLoading}
>
  {isLoading ? "Logging in..." : "Login"}
</button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;