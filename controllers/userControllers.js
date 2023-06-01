import jwt  from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import User from "../models/userModels.js";
import mongoose from "mongoose";
export const loginController = async (req,res,next) =>{
    const {email,password} = req.body;
    let userExists;
    try{
        userExists = await User.findOne({email:email})
    }catch(err){
        console.log(`An error occurred`);
        return next(err);
    }
    if(!userExists){
        return next(()=>{
            console.log('The email provided is not registered');
        })
    }
    let isValidPassword = false;
    try{
        isValidPassword = await bcrypt.compare(password,userExists.password);
    }catch(err){
        console.log(`There' been an error validating the password`);
        return next(err);
    }
    if(!isValidPassword){
        return next(()=>{
            console.log('The password does not match')
        })
    }
    let token;
    try{
        token = jwt.sign({
            userId:userExists.id,
            email: userExists.email
        },'SUPERSECRET-DONT-SHAREWITHANYONEGGEZ', {expiresIn:'1h'});

    }catch(err){
        console.log(`An error occurred creating the token`);
        return next(err);
    }
    res
    .status(201)
    .json({ userId: userExists.id, email: userExists.email, token: token });
}
export const signinController = async (req,res,next) =>{
    const {name, email,password} = req.body;
    let userExists;
    try{
        userExists = await User.findOne({email:email});
    }catch(err){
        console.log('An error occurred identifying if user already exists')
        return next(err)
    }
    if(userExists){
        console.log(`This email's already used`)
        return next(()=>{
            console.log('try using another email')
        })
    }
    let hashPassword;
    try{
        const salt = bcrypt.genSaltSync(10);
        hashPassword = await bcrypt.hash(password,salt);
        
    }catch(err){
        console.log(`There's been an error hashing the password\n ${err}`)
        return next(err);
    }
    const createdUser = new User({
        name: name,
        email:email,
        password:hashPassword
    })
    try{
        await createdUser.save();
    }catch(err){
        console.log(createdUser)
        console.log(`An error occurred saving the created user`)
        return next(err);
    }
    let token;
    try{
        token = jwt.sign({
            userId:new mongoose.Types.ObjectId(createdUser._id),
            email: createdUser.email
        },'SUPERSECRET-DONT-SHAREWITHANYONEGGEZ', {expiresIn:'1h'});

    }catch(err){
        console.log(`An error occurred creating the token`);
        return next(err);
    }
    res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
}
export const getUserController = async (req,res,next) =>{
    let users;
    try {
      users = await User.find({}, '-password');
    } catch (err) {
      const error = new HttpError(
        'Fetching users failed, please try again later.',
        500
      );
      return next(error);
    }
    res.json({ users: users.map(user => user.toObject({ getters: true })) });
}
