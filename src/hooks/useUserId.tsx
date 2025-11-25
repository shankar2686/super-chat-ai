import { useState, useEffect } from "react";

export const useUserId = () => {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem("user_id");
    if (stored) {
      setUserId(stored);
    }
  }, []);

  const updateUserId = (id: string) => {
    setUserId(id);
    localStorage.setItem("user_id", id);
  };

  return { userId, updateUserId };
};
