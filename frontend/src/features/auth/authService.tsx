import { UserInterface, AuthResponseInterface } from "./authInterface";

export const saveAuthData = async (authResponse: AuthResponseInterface) => {
  if (typeof window !== "undefined") {
    //await Promise.all([saveAccessToken(token), saveUserData(user)]);
    await Promise.all([saveUserData(authResponse.user)]);
  }
};

export const saveAccessToken = async (token: string) => {
  localStorage.setItem("access_token", token);
};

export const saveUserData = async (user: UserInterface) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuthData = async () => {
  localStorage.removeItem('user');
 // localStorage.removeItem("access_token");
}

export const logout = async (): Promise <boolean> => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL+'/auth/logout', {
    method: 'POST',
    credentials: 'include', // Important to send cookies!
  });

  if (res.ok) {
    clearAuthData();
    return  true;
  } else {
    return false;
  }
};
