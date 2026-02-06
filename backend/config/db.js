import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://ashisswainofficial77_db_user:quizapp12@cluster0.129gul9.mongodb.net/QuizApp')
        .then(() => {console.log('DB Connected')});
}