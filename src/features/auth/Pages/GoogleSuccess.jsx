import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const { handlgetuser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      handlgetuser()
        .then(() => navigate("/dashboard"))
        .catch(() => navigate("/"));
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <p>Signing you in with Google...</p>
    </div>
  );
}