import express from 'express';
const app = express();
import 'dotenv'
const PORT = process.env.PORT || 3000;
import { userRoutes } from './routes/userRoutes.js';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

app.use(bodyParser.json())
app.use('/user',userRoutes);

mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.5rsxkjh.mongodb.net/${process.env.DB_NM}?retryWrites=true&w=majority`
).then(()=>{
    app.listen(PORT, ()=>{
         console.log(`Running on port ${PORT}`)
    });
    console.log('connected')
}).catch(err=>{
    console.log(`An error has occurred\n ${err}`)
})
