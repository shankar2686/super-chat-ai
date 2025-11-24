import { useState, useEffect } from "react";

interface ApiKeys {
  openai: string;
  supermemory: string;
}

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openai: "",
    supermemory: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("api_keys");
    if (stored) {
      setApiKeys(JSON.parse(stored));
    }
  }, []);

  const updateApiKeys = (keys: ApiKeys) => {
    setApiKeys(keys);
    localStorage.setItem("api_keys", JSON.stringify(keys));
  };

  return { apiKeys, updateApiKeys };
};
