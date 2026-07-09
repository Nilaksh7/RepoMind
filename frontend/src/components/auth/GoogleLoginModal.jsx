import { GoogleLogin } from "@react-oauth/google";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import useAuth from "../../hooks/useAuth";

export default function GoogleLoginModal({ open, onClose }) {
  const navigate = useNavigate();
  const { login } = useAuth();

  if (!open) return null;

  async function handleGoogleSuccess(response) {
    try {
      const backendResponse = await api.post("/auth/google", {
        credential: response.credential,
      });

      const { accessToken, user } = backendResponse.data;

      login(accessToken, user);

      onClose();

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="relative w-[420px] rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            <span className="text-white">Repo</span>
            <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              Mind
            </span>
          </h1>

          <p className="mt-3 text-slate-400">
            Continue with Google to start exploring repositories.
          </p>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert("Google Login Failed")}
          />
        </div>
      </div>
    </div>
  );
}
