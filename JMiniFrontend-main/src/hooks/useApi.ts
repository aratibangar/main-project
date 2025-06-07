import { useState, useEffect } from 'react';
import axios from 'axios';

export function useApi<T = any>(url: string, options = {}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get<T>(url, options);
        if (!cancel) {
          setData(response.data);
          setError(null);
        }
      } catch (err: any) {
        if (!cancel) {
          setError(err.message || 'Something went wrong');
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancel = true;
    };
  }, [url]);

  return { data, loading, error };
}
