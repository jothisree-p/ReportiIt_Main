import { useCallback, useEffect, useState } from "react";
import { getComplaintStats } from "../complaintsData";
import { fetchAllComplaints, fetchAssignedComplaints, fetchMyComplaints } from "../api/complaints";
import { getRole } from "../authStorage";

const loaders = {
  CITIZEN: fetchMyComplaints,
  OFFICER: fetchAssignedComplaints,
  ADMIN: fetchAllComplaints,
};

export const useComplaints = (loader) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetcher =
        loader ||
        loaders[getRole()] ||
        fetchAllComplaints;
      const data = await fetcher();
      setComplaints(data);
    } catch (err) {
      setError(err.message || "Failed to load complaints");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    complaints,
    loading,
    error,
    stats: getComplaintStats(complaints),
    refresh: load,
  };
};
