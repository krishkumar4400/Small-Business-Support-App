import { User } from "../Model/Auth.js";
import { argon2id } from "argon2";
import jwt from 'jsonwebtoken';


// user register function
export const register = async (req,res) => {
    const {name, email, password} = req.body;

    try {
        if(!name || !email || !password) {
            return res.json({
              message: "Missing Details",
              success: false,
            });
        }
        let user = await User.findOne({email});
        if(user) {
            return res.json({
                message: 'User already exists',
                success: false 
            });
        }

        const hashedPassword = await argon2id.hash(password, 10);

        user = await User.create({
          name,
          email,
          password: hashedPassword,
        });

        user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.cookie('token', token, {
            httpOnly:true,
            sameSite: process.env.NODE_ENV==='production' ? 'none' : 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            message: 'you are registered successfully',
            success: true 
        });

    } catch (error) {
        console.log(error.message);
        return res.json({
            message: 'server is not responding ! Try again',
            success: false 
        });
    }
}

// user login function
const login = async (req,res) => {
    const {email, password} = req.body;

    try {
        if(!email || !password) {
            return res.json({
              message: "Email and Password are required",
              success: false,
            });
        }

        let user = await User.findOne({email});
        if(!user) {
            return res.json({
                message: 'Incorrect email or password',
                success: false
            });
        }
        const validPassword = await argon2id.compare(password, user.password);
        if(!validPassword) {
            return res.json({
                message: 'incorrect email or password',
                success: false 
            });
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '7d' 
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000  
        });

        res.json({
          message: `Welcome back ${user.name}`,
          success: true,
        });

    } catch (error) {
        console.log(error.message);
        return res.json({
            message: 'server is not responding',
            success: false 
        });
    }
}