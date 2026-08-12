import request from "./client";

export function getTasks(token) {
  return request("/api/tasks", { token });
}

export function createTask(token, title) {
  return request("/api/tasks", { method: "POST", token, body: { title } });
}

export function updateTask(token, id, updates) {
  return request(`/api/tasks/${id}`, { method: "PATCH", token, body: updates });
}

export function deleteTask(token, id) {
  return request(`/api/tasks/${id}`, { method: "DELETE", token });
}
