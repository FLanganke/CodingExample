const auth = require("../infrastructure/authentication");
import { UserService } from '../services/userService'
import * as express from "express";
import { HobbyService } from '../services/hobbyService';
import { UserHobbyService } from '../services/userHobbyService';

export const userHobbiesController = express.Router();

userHobbiesController.post("/", auth, async (req, res) => {

    try {
        const user = await UserService.getUserFromRequest(req.user)
        if (!user)
            return res.status(401).send();
        let hobby = await HobbyService.getOrAddHobby(req.body.name);
        if (hobby) {
            let newUserHobby = await UserHobbyService.addUserHobby(hobby.id, user.id);
            if (newUserHobby)
                return res.status(200).send(newUserHobby);
            else
                return res.status(422).send("Already assigned");
        } else {
            return res.status(500).send("Error on creating hobby")
        }
    } catch {
        return res.status(400).send("Bad request");
    }

});

userHobbiesController.delete("/", auth, async (req, res) => {
    try {
        const user = await UserService.getUserFromRequest(req.user)
        if (!user)
            return res.status(401).send();
        if (await UserHobbyService.deleteUserHobby(req.body.id, user.id)) {
            return res.status(200).send();
        } else {
            return res.status(404).send();
        }
    } catch  {
        return res.status(400).send("Bad request");
    }
    
});

userHobbiesController.get("/forUser", auth, async (req, res) => {
    try {
        if (!UserService.isAdmin(req.user))
            return res.status(403).send();
        let userHobbies = await UserHobbyService.getHobbiesForUser(req.body.userId);
        if (!userHobbies || userHobbies.length === 0)
            return res.status(404).send();
        return res.status(200).send(userHobbies);
    } catch (e) {
        return res.status(400).send("Bad request");
    }
});

userHobbiesController.get("/", auth, async (req, res) => {
    try {
        const user = await UserService.getUserFromRequest(req.user)
        if (!user)
            return res.status(401).send();
        let userHobbies = await UserHobbyService.getHobbiesForUser(user.id);
        if (!userHobbies || userHobbies.length === 0)
            return res.status(404).send();
        return res.status(200).send(userHobbies);
    } catch (e) {
        return res.status(400).send("Bad request" + e);
    }
});


userHobbiesController.get("/sortedByOccurence", auth, async (req, res) => {
    try {
        let reqUser: any = req.user;
        const user = await UserService.getById(reqUser._id);
        if (!user)
            return res.status(401).send();
        let userHobbies = await UserHobbyService.getUserHobbiesByOccurence();
        if (!userHobbies || userHobbies.length === 0)
            return res.status(404).send();
        return res.status(200).send(userHobbies);
    } catch (e) {
        return res.status(400).send("Bad request" + e);
    }
});