import { useContext } from "react";
import { Authcontex } from "../auth.context";

import { login, register, logout, getuser } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(Authcontex);
  const { User, setUser, loading, setLoading } = context;

  const handlelogin = async ({ email, password }) => {
    try {
      setLoading(true);
      const data = await login({ email, password });
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const handleregister = async ({ username, email, password }) => {
    try {
      setLoading(true);
      const data = await register({ username, email, password });
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const handllogout = async () => {
    try {
      setLoading(true);
      const data = await logout();
      setUser(null);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const handlgetuser = async () => {
    try {
      setLoading(true);
      const data = await getuser();
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  return {
    User,
    loading,
    handlelogin,
    handleregister,
    handllogout,
    handlgetuser,
  };
};
