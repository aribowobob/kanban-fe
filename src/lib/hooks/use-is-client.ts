import { useEffect, useState } from "react";

/**
 * Custom hook to prevent hydration mismatches
 * Returns false on server-side and initial client render,
 * then true after hydration is complete
 */
export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};
