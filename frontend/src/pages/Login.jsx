import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  async function handleGoogleSuccess(response) {
    try {
      const backendResponse = await api.post("/auth/google", {
        credential: response.credential,
      });

      const { accessToken, user } = backendResponse.data;

      login(accessToken, user);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => alert("Google Login Failed")}
      />
    </div>
  );
}
