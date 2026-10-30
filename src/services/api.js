
const API_URL = "http://localhost:3000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const getEmployees = () => request("/employees");
export const getEmployee = (id) => request(`/employees/${id}`);

export const addEmployee = (employee) =>
  request("/employees", {
    method: "POST",
    body: JSON.stringify(employee),
  });

export const updateEmployee = (id, employee) =>
  request(`/employees/${id}`, {
    method: "PUT",
    body: JSON.stringify(employee),
  });

export const deleteEmployee = (id) =>
  request(`/employees/${id}`, {
    method: "DELETE",
  });

export const getDepartments = () => request("/departments");
export const getDesignations = () => request("/designations");
