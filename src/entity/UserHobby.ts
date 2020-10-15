import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne} from "typeorm";
import { Hobby } from "./Hobby";

@Entity()
export class UserHobby {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    hobbyId: number;

    @ManyToOne(type => Hobby, hobby => hobby.userHobbies)
    hobby: string
}
