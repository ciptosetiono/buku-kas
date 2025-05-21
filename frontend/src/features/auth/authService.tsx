import { UserInterface, AuthResponseInterface } from "./authInterface";

export const saveAuthData = async ({ token, user }: AuthResponseInterface) => {
  if (typeof window !== "undefined") {
    await Promise.all([saveAccessToken(token), saveUserData(user)]);
  }
};

const saveAccessToken = async (token: string) => {
  localStorage.setItem("access_token", token);
};

const saveUserData = async (user: UserInterface) => {
  localStorage.setItem("user", JSON.stringify(user));
};
