import request from "./client";

export function getStudySessions(token) {
  return request("/api/study-sessions", { token });
}

export function createStudySession(token, minutes) {
  return request("/api/study-sessions", { method: "POST", token, body: { minutes } });
}
