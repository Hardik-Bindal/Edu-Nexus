import { apiRequest } from "./api";

export const getMyGroups = () => apiRequest("/groups");

export const createGroup = (name) =>
  apiRequest("/groups", {
    method: "POST",
    body: { name },
  });

export const addGroupMember = (groupId, studentId) =>
  apiRequest("/groups/add-member", {
    method: "POST",
    body: { groupId, studentId },
  });

export const uploadGroupMaterial = (groupId, title, content) =>
  apiRequest("/groups/material", {
    method: "POST",
    body: { groupId, title, content },
  });

export const requestGroupAIMaterial = (topic, level) =>
  apiRequest("/groups/ai-material", {
    method: "POST",
    body: { topic, level },
  });

