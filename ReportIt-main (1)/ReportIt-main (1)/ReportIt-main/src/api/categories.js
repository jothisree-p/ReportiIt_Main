import { apiRequest } from "./http";

export const mapCategoryFromApi = (category) => ({
  id: category.id,
  name: category.name,
});

export const fetchCategories = async () => {
  const data = await apiRequest("/api/categories");
  return data.map(mapCategoryFromApi);
};

export const createCategory = async (name) => {
  const data = await apiRequest("/api/categories", {
    method: "POST",
    body: { name },
  });
  return mapCategoryFromApi(data);
};

export const updateCategory = async (id, name) => {
  const data = await apiRequest(`/api/categories/${id}`, {
    method: "PUT",
    body: { name },
  });
  return mapCategoryFromApi(data);
};

export const deleteCategory = async (id) => {
  await apiRequest(`/api/categories/${id}`, { method: "DELETE" });
};
