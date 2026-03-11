import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service";

const HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const handleVerifyUser = async () => {
    if (!token) {
      navigate("/login");
    } else {
      await authService.getMe();
    }
  };

  useEffect(() => {
    handleVerifyUser();
  }, []);

  return (
    <main className="grid grid-cols-3 ">
      <div></div>
    </main>
  );
};

export default HomePage;
