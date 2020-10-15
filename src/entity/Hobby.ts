import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { UserHobby } from "./UserHobby";

@Entity()
export class Hobby {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => UserHobby, userHobby => userHobby.hobby)
    userHobbies: UserHobby[]
}
