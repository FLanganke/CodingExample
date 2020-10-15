import { getManager, getRepository } from "typeorm";
import { Hobby } from "../entity/Hobby";

export class HobbyService {

    static async getOrAddHobby(name: string) {
        const hobbyRepository = getRepository(Hobby);
        let hobby = await hobbyRepository
            .createQueryBuilder("hobby")
            .where("hobby.name = :hobbyname", { hobbyname: name })
            .getOne();
        if (!hobby) {
            hobby = new Hobby();
            hobby.name = name
            await hobbyRepository.save(hobby);
        }
        return hobby;
    }

}