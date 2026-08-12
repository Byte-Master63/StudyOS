import request from "./client";

export const getCalendarEvents = (token) => request("/api/calendar-events", { token });
export const createCalendarEvent = (token, data) => request("/api/calendar-events", { method: "POST", token, body: data });
export const updateCalendarEvent = (token, id, data) => request(`/api/calendar-events/${id}`, { method: "PATCH", token, body: data });
export const deleteCalendarEvent = (token, id) => request(`/api/calendar-events/${id}`, { method: "DELETE", token });
