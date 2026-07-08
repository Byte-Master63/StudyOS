import request from "./client";

export function getAssessments(token) {
  return request("/api/assessments", { token });
}

export function createAssessment(token, assessment) {
  return request("/api/assessments", { method: "POST", token, body: assessment });
}

export function updateAssessment(token, id, updates) {
  return request(`/api/assessments/${id}`, { method: "PATCH", token, body: updates });
}
