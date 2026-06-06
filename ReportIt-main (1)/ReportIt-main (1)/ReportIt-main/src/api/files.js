import { apiRequest } from "./http";
import { API_URL } from "./config";

export const mapFileFromApi = (file) => ({
  id: file.id,
  complaintId: file.complaintId,
  fileName: file.fileName || file.name || "Uploaded file",
  contentType: file.contentType || file.fileType || "",
  sizeBytes: file.sizeBytes || file.size || 0,
  uploadedAt: file.uploadedAt,
  downloadUrl: `${API_URL}/api/files/${file.id}/download`,
});

export const uploadComplaintFile = async (complaintId, file) => {
  const formData = new FormData();
  formData.append("complaintId", complaintId);
  formData.append("file", file);

  const data = await apiRequest("/api/files/upload", {
    method: "POST",
    body: formData,
  });

  return mapFileFromApi(data);
};

export const fetchComplaintFiles = async (complaintId) => {
  const data = await apiRequest(`/api/files/complaint/${complaintId}`);
  return data.map(mapFileFromApi);
};
