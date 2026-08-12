import request from "./client";

export function signup({ username, email, password }) {
  return request("/auth/signup", {
    method: "POST",
    body: { username, email, password },
  });
}

export function login({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}
