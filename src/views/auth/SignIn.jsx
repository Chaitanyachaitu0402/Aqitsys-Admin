import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "components/checkbox";

export default function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
  setLoading(true); // start loader
  setMessage("");

  const enteredEmail = email.trim().toLowerCase();
  const enteredPassword = password.trim();

  console.log("Entered Email:", enteredEmail);
  console.log("Entered Password:", enteredPassword);

  // Simulate API delay
  setTimeout(() => {
    if (
      enteredEmail === "admin@gmail.com" &&
      enteredPassword === "Admin@123"
    ) {
      setIsError(false);
      setMessage("Login Successful!");

      setTimeout(() => {
        navigate("/admin/default");
      }, 1000);
    } else {
      setIsError(true);
      setMessage("Please enter correct credentials.");
      setLoading(false); // stop loader if error
    }
  }, 1000);
};

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>

        {/* Email */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="Enter your email"
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Password*"
          placeholder="Enter your password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Message */}
        {message && (
          <p
            className={`mb-3 text-sm font-medium ${
              isError ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}

        {/* Sign In Button */}
        <button
  onClick={handleSignIn}
  disabled={loading}
  className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed"
>
{loading ? (
  <span className="flex items-center justify-center gap-2">
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
    Signing In...
  </span>
) : (
  "Sign In"
)}
</button>
      </div>
    </div>
  );
}