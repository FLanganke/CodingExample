import { User } from "../entity/User";
import * as jwt from 'jsonwebtoken'
import * as config from "config";
import { getManager, getRepository } from "typeorm";
import { ApiUser } from "../model/UserApiModel";
import * as bcrypt from "bcrypt";

export class UserService {

    //custom method to generate authToken 
    static generateAuthToken(user: User) {
        const token = jwt.sign({ _id: user.id, isAdmin: user.isAdmin }, config.get('privkey'));
        return token;
    }

    //function to validate user..could use some extension
    static validateUser(user: User) {
        if (!user.username)
            return "username missing"
        if (!user.password)
            return "password missing"
        return user.password.length > 4 ? null : "Password to short";
    }

    static getByName(username: string) {
        return getManager()
            .createQueryBuilder(User, "user")
            .where("user.username = :username", { username: username })
            .getOne();
    }

    static getById(id: number) {
        return getManager()
            .createQueryBuilder(User, "user")
            .where("user.id = :id", { id: id })
            .getOne();
    }

    static mapToApi(user: User): ApiUser {
        return {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin
        }
    }

    static async checkPw(user: User, password: string) {
        return await bcrypt.compare(password, user.password)
    }

    static async getUserFromRequest(_user: Express.User) {
        let reqUser: any = _user; // hate to use any, but express does some weird empty interface definitions 
        return await UserService.getById(reqUser._id);
    }

    static async isAdmin(_user: Express.User) {
        let reqUser: any = _user; // hate to use any, but express does some weird empty interface definitions 
        const user = await UserService.getById(reqUser._id);
        if (!user || !user.isAdmin) {
            return false
        }
        return true
    }

    static async addNewUser(username: string, password: string, isAdmin: boolean) {
        let newUser: User = new User();
        newUser.username = username;
        newUser.password = await bcrypt.hash(password, 10);
        newUser.isAdmin = isAdmin;
        let userRepository = getRepository(User);
        return userRepository.save(newUser)
    }

    static async updateUser(userId: number, username: string, password: string, isAdmin: boolean) {
        let newUser: User = new User();
        newUser.username = username;
        newUser.password = await bcrypt.hash(password, 10);
        let userRepository = getRepository(User);
        newUser.isAdmin = isAdmin;

        await userRepository.update(userId, newUser);
        return newUser;
    }

    static async deleteUser(id: number) {
        //find the user
        let exUser = await UserService.getById(id);
        if (!exUser)
            return false;

        let userRepository = getRepository(User);
        await userRepository.delete(exUser)
        return true;
    }

    static async readAll() {
        const userRepo = getRepository(User);
        let users = await userRepo
            .createQueryBuilder("user")
            .getMany();        
        return users.map(us => {
            return UserService.mapToApi(us);
        })
    }
}