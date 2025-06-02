import mongoose from 'mongoose';
import { UserInterface } from '../interfaces/IUser';
import userModel from '../models/userModels';
import { IUserRepository } from '../interfaces/user/IUserRepository';
import BaseRepository from './baseRepository';


class UserRepository implements IUserRepository {

  private userRepository: BaseRepository<UserInterface>;
  

  constructor() {
    this.userRepository = new BaseRepository(userModel);
  }

  async emailExistCheck(email: string): Promise<boolean | null> {
    try {
      const userFound = await this.userRepository.findOne({ email: email });

      if (userFound) {
        return true
      } else {
        return false
      }

    } catch (error) {
      console.log(error as Error);
      throw error
    }
  }

  async saveUser(userData: any): Promise<UserInterface | null> {
    try {
      const newUser = await this.userRepository.create(userData);
      return newUser;
    } catch (error) {
      console.log('Error in Save user: ',error);
      throw error
    }
  }

  async login(email: string): Promise<UserInterface | null> {
    try {
      return await this.userRepository.findOne({ email: email, isVerified: true })
    } catch (error) {
      console.log(error);
      throw error
    }
  }

  async getUserById(userId: string): Promise<UserInterface | null> {
    try {
      return await this.userRepository.findById(userId);
    } catch (error) {
      console.log('Error in getUserById: ',error);
      throw error
    }
  }


}

export default UserRepository;