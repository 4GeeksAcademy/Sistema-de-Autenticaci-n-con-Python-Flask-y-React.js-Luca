import { BASE_URL } from "./BASE_URL";

export const loginWhitEmailAndPassword = async (data) => {
  return await BASE_URL("/login", "POST", data);
};

export const registerUser = async (data) => {
  return await BASE_URL("/register", "POST", data);
};
