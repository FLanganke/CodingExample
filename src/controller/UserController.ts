const auth = require("../infrastructure/authentication");
import { UserService } from '../services/userService'
import * as express from "express";

export const userController = express.Router();

userController.get("/current", auth, async (req, res) => {
    try {
        let reqUser: any = req.user; // hate to use any, but express does some weird empty interface stuff here
        const user = await UserService.getById(reqUser._id);
        res.send(UserService.mapToApi(user));
    } catch (e) {
        return res.status(400).send("Bad request");
    }
});

userController.post("/login", async (req, res) => {
    try {
        //find the user requested to login
        let user = await UserService.getByName(req.body.username);
        if (!user)
            return res.status(400).send("User does not exist.");
        if (!UserService.checkPw(user, req.body.password))
            return res.status(401).send("Access denied. Username password combination invalid.");
        const token = UserService.generateAuthToken(user);
        res.header("x-auth-token", token).send({
            _id: user.id,
            name: user.username,
        });
    } catch (e) {
        return res.status(400).send("Bad request");
    }
});

userController.post("/", auth, async (req, res) => {
    try {
        // Only admin can add new users
        if (!UserService.isAdmin(req.user))
            res.status(403).send();

        // validate the request body first
        const valErr = UserService.validateUser(req.body)
        if (valErr)
            return res.status(400).send(valErr);

        //find an existing user
        let exUser = await UserService.getByName(req.body.username);
        if (exUser)
            return res.status(400).send("User already registered.");

        
        let newUser = await UserService.addNewUser(req.body.username, req.body.password, false);

        const token = UserService.generateAuthToken(newUser);
        res.header("x-auth-token", token).send({
            _id: newUser.id,
            name: newUser.username,
        });
    } catch (e) {
        return res.status(400).send("Bad request");
    }
});

userController.put("/", auth, async (req, res) => {
    try {
        let reqUser: any = req.user;
        const user = await UserService.getById(reqUser._id);
        if (!user) {
            return res.status(403).send();
        }

        // validate the request body first
        const valErr = UserService.validateUser(req.body)
        if (valErr)
            return res.status(400).send(valErr);

        //find an existing user
        let exUser = await UserService.getById(req.body.id);
        if (!exUser)
            return res.status(404).send("User does not exist");

        // only admin can edit other users
        if (exUser.id !== user.id && !user.isAdmin) {
            return res.status(403).send();
        }
        let newUser = await UserService.updateUser(exUser.id, req.body.username, req.body.password, user.isAdmin ? req.body.isAdmin : exUser.isAdmin); // only admins can change the admin flag

        const token = UserService.generateAuthToken(newUser);
        res.header("x-auth-token", token).send({
            _id: exUser.id,
            name: newUser.username,
        });
    } catch (e) {
        return res.status(400).send("Bad request");
    }
});


userController.delete("/", auth, async (req, res) => {
    try {
        // Only admin can delete users
        if (!UserService.isAdmin(req.user)) {
            return res.status(403).send();
        }
        if (await UserService.deleteUser(req.body.id))
            return res.status(200).send();
        else
            return res.status(404).send();
    } catch (e) {
        return res.status(400).send("Bad request");
    }
});


userController.get("/", auth, async (req, res) => {
    try {
        if (!UserService.isAdmin(req.user)) {
            return res.status(403).send();
        }
        let users = await UserService.readAll();
        if (!users || users.length === 0)
            return res.status(404).send();
        return res.status(200).send(users);
    } catch (e) {
        return res.status(400).send("Bad request");
    }
});