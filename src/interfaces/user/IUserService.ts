import { UserInterface } from "../IUser";

export interface IUserService {
    userSignup(userData: UserInterface): Promise<boolean | null>;
    saveUser(userData: any): Promise<UserInterface | null>;
    login(email: string): Promise<UserInterface | null>;

   
}
