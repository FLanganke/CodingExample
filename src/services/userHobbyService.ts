import { getRepository } from "typeorm";
import { UserHobby } from "../entity/UserHobby";

export class UserHobbyService {
    static async addUserHobby(hobbyId: number, userId: number) {
        const userHobbiesRepository = getRepository(UserHobby);
        let userHobby = await userHobbiesRepository
            .createQueryBuilder("userhobby")
            .where("userhobby.hobbyId = :hobbyId", { hobbyId: hobbyId })
            .andWhere("userhobby.userId = :userId", { userId: userId })
            .getOne();
        if (userHobby)
            return null
        let newUserHobby = new UserHobby();
        newUserHobby.hobbyId = hobbyId;
        newUserHobby.userId = userId;
        userHobbiesRepository.save(newUserHobby);
        return newUserHobby;
    }

    static async deleteUserHobby(id: number, userId: number) {
        const userHobbiesRepository = getRepository(UserHobby);
        let userHobby = await userHobbiesRepository
            .createQueryBuilder("userhobby")
            .where("userhobby.id = :id", { id: id })
            .andWhere("userhobby.userId = :userId", { userId: userId }) // can only delete your own hobbies
            .getOne();
        if (!userHobby) {
            return false;
        } else {
            userHobbiesRepository.delete(userHobby);
            return true;
        }
    }

    static async getHobbiesForUser(userId: number) {
        const userHobbiesRepository = getRepository(UserHobby);
        return await userHobbiesRepository
            .createQueryBuilder("userhobby")
            .leftJoinAndSelect("userhobby.hobby", "hobby")
            .where("userhobby.userId = :userId", { userId: userId })
            .getMany();
    }

    static async getUserHobbiesByOccurence() {
        const userHobbiesRepository = getRepository(UserHobby);
        return await userHobbiesRepository
            .createQueryBuilder("userhobby")
            .leftJoinAndSelect("userhobby.hobby", "hobby")
            .select("hobby.id", "HobbyId")
            .addSelect("hobby.name", "HobbyName")
            .addSelect("COUNT(*) as count")
            .groupBy("userhobby.hobbyId")
            .orderBy("count", "DESC")
            .getRawMany();
    }
}