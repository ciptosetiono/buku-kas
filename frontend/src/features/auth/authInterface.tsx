export interface UserInterface {
    id: string;
    name: string;
    email: string;
  };
  
export interface AuthResponseInterface {
    token: string;
    user: UserInterface;
}
  