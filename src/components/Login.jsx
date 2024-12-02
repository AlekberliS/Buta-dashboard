import  { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Simulate login process
    setLoading(true);

    try {
      // Replace with your API endpoint for fetching user data
      const response = await fetch(`http://localhost:3000/users?email=${email}`);
      const users = await response.json();

      if (users.length === 0) {
        setError("User not found");
        setLoading(false);
        return;
      }

      const user = users[0]; // Assuming the response returns an array of users
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      // Save user data to local storage
      localStorage.setItem("currentUser", JSON.stringify(userData));

      setLoading(false);
      onLogin(); // Call the parent-provided login handler
      navigate("/menu"); // Redirect after login
    } catch (error) {
      setError("Failed to login. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md transition duration-200 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
