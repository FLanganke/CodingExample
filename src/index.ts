import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as bcrypt from "bcrypt";
import { getRepository } from "typeorm";
import { User } from './entity/User'
import { createConnection } from "typeorm";
import { userController } from "./controller/UserController";
import { userHobbiesController } from "./controller/HobbyController";
import { UserService } from "./services/userService";


createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());

    app.use("/api/v1/users", userController);
    app.use("/api/v1/userhobbies", userHobbiesController);

    let userRepository = getRepository(User);
    if (await userRepository.count() === 0) {
        await UserService.addNewUser("admin", "pleaseChange", true);
    }

    // start express server
    app.listen(3000);

    console.log("Express server has started on port 3000.");

}).catch(error => console.log(error));
