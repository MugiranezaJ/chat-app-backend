import { findUserByEmail, findUserByUsername, generateToken, verifyToken } from '../utils/tools';
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
                email: user.email
            }
            const token = await generateToken(payload);
            res.cookie('accessToken', token, { httpOnly: false});
            return res.status(200).json({status:200,message:"login successful!", token})
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
}