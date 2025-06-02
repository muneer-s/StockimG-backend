import { UserInterface } from "../IUser";

export interface IUserRepository {
  emailExistCheck(email: string): Promise<boolean | null>;
  saveUser(userData: any): Promise<UserInterface | null>;
  login(email: string): Promise<UserInterface | null>;

}
