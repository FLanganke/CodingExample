import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Hobby } from "./Hobby";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    isAdmin: boolean;
}
