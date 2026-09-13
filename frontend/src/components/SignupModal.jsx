import { useState } from "react";
import { registerUser } from "../services/authService";

function SignupModal({ onClose, onLoginSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
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
      const data = await registerUser(formData);

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));
onLoginSuccess(data.user);
      onClose();
    } catch (error) {
  console.log(
    "ERROR MESSAGE:",
    error.response?.data?.message
  );
  

  const message =
    error.response?.data?.message ||
    "Something went wrong while signing up.";

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

        <h2>Create Account</h2>
        {errorMessage && (
  <p className="error-message">
    {errorMessage}
  </p>
)}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>

            <input
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

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
  {isLoading ? "Creating account..." : "Sign Up"}
</button>
        </form>
      </div>
    </div>
  );
}

export default SignupModal;