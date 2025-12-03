import { useEffect, useState } from "react";
import axios from "axios";

export default function useFetch(url, params) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = import.meta.env.VITE_TERMINAL_SK;

  useEffect(() => {
    async function fetchData() {
      try {
        if (token) {
          const res = await axios.get(url, {
            ...(params && { params }),
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setData(res.data?.data || res?.data || []);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [url, params]);

  return { data, loading, error };
}
