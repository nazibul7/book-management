import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller";
import { verifyJwt } from "../middlewares/authMiddleware";

const routes = express.Router()

routes.route('/register').post(registerUser)
routes.route("/login").post(loginUser)
routes.route('/logout').post(verifyJwt,logoutUser)


export default routes