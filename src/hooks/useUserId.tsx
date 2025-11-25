import { useState, useEffect } from "react";

export const useUserId = () => {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const stored = sessionStorage.getItem("user_id");
    if (stored) {
      setUserId(stored);
    }
  }, []);

  const updateUserId = (id: string) => {
    setUserId(id);
    sessionStorage.setItem("user_id", id);
  };

  return { userId, updateUserId };
};
