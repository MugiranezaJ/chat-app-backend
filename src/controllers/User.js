import { findUserByEmail, findUserByUsername, generateToken, getAllUsers, verifyToken } from '../utils/tools';
import { initialize } from '../models';
import bcrypt from 'bcrypt';

export class User{
    static register = async (req, res, next) => {
        try{
            const db = await initialize();
            const t = await db.sequelize.transaction();
            try{
                let { name, username, email, password } = req.body;
                const payload = {user: {email: email}};
                if(await findUserByEmail(email)) return res.status(409).json({status:409, error: `User with this email already exist`})
                if(await findUserByUsername(username)) return res.status(409).json({status:409, error: `Username already taken`})
                const salt = await bcrypt.genSalt(Number(process.env.SALT));
                password = await bcrypt.hash(password, salt);
                const token = await generateToken(payload);
                await db.users.create({name, username, email, password},{transaction: t});
                await t.commit();
                return res.status(200).json({status: 200, message:`User ${name}, created successfully`});
            }catch(error){
                await t.rollback();
                if('parent' in error){
                return res.status(400).json({status: 400, message:error.parent.sqlMessage});
                }else{
                    next(error);
                }
            }
        }catch(err){
            return res.status(500).json({error: err.message})
        }
    }

    static login = async (req, res) =>{
        const { email, password } = req.body;
        try {
            const user = await findUserByEmail(email)
            if(!user) return res.status(404).json({status:404, error: `You don't have account!`})
            const comperedPassword = bcrypt.compareSync(password, user.password);
            if(!comperedPassword) return res.status(400).json({status:400, error: "Email or Password is incorrect!"});
            const payload = {
                role:user.role,
                email: user.email,
                username: user.username,
                name: user.name,
                profile_picture: user.profile_picture
            }
            const token = await generateToken(payload);
            res.cookie('accessToken', token, { httpOnly: false});
            return res.status(200).json({status:200,message:"login successful!", token, user})
        } catch (error) {
            return res.status(500).json({status:500, error: error.message})
        }
    }

    static logout = (req, res) => {
        try {
          if(!req.cookies.accessToken)  return res.status(400).json({ status: 400, error: 'You already Loged out!' });
          res.clearCookie('accessToken','/');
      
         return res.status(200).json({ status: 200, message: 'Logout successful!' });
        } catch (error) {
          res.status(400).json(error.message);
        }
    };

    static getUserInfo = async (req, res) => {
        try {
            const { email } = req.body
            const user = await findUserByEmail(email)
            if(!user) return res.status(404).json({status:404, error: `User not found`})
            res.status(200).json({status: 200, data: user})

        }catch(error){
            return res.status.json({status:500, error: error.message})
        }
    }

    static verifyUserToken = async (req, res, next) => {
        try{
            // if(!bearerToken) return res.status(401).json({status: 401, error: 'Please login'});
            // console.log("Token: " +req.body.token)
            const token = req.body.token

            const user = await verifyToken(token)
            if(!user) return res.status(404).json({status: 404, error: 'Invalid token'})
            return res.status(200).json({status: 200, user})
        }catch(error){
            next(error)
        }
    }
    static getAllUsersList = async (req, res, next) => {
        try{
            const users = await getAllUsers()
            if(users.length === 0) return res.status(404).json({status: 404, error: 'No users available'})
            res.status(200).json({status: 200, data: users})
        }catch(error){
            next(error)
        }
    }
}