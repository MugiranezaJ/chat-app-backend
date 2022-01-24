import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { initialize } from "../models";
import { v4 } from 'uuid'
// import c from 'uuid/dist/v4'
import roles from './roles'

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
    const user = await db.users.findOne({where: {email:email}, exclude:['id', 'password', 'created_date', 'updated_at']})
    return user
}

export const findUserByUsername = async (username) => {
    const db = await initialize()
    const user = await db.users.findOne({where: {username}})
    return user
}

export const getAllUsers = async () => {
    const db = await initialize()
    const users = await db.users.findAndCountAll({attributes: {exclude: ['id', 'password', 'created_date', 'updated_at']}})
    return users
}
export const hashPassword = (password) => bcrypt.hashSync(password, salt);


export const deleteUser = ( users, username ) => {
    delete users[ username ]
    return users   
}

export const addUsers = ( users, user ) => {
    console.log(user)
    users[ user.username ] = user
    return users
}
