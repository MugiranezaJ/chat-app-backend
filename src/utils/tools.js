import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { initialize } from "../models";

const secret = process.env.TOKEN_SECRET;
const salt = bcrypt.genSaltSync(10);

export const generateToken = async (payload, expiresIn = '7d') => {
    const token = jwt.sign({ ...payload }, secret, { expiresIn });
    return token;
};

export const verifyToken = async (token) => {
    const decoded = await jwt.verify(token, secret);
    return decoded;
};

export const findUserByEmail = async (email) => {
    const db = await initialize()
    const user = await db.users.findOne({where: {email:email}})
    return user
}

export const findUserByUsername = async (username) => {
    const db = await initialize()
    const user = await db.users.findOne({where: {username}})
    return user
}

export const hashPassword = (password) => bcrypt.hashSync(password, salt);