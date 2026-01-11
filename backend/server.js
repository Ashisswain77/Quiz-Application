import express from 'express';
import cors from 'cors';
import 'dotenv/config.js'
import {ConnectDB} from "./config/db.js";
import userRouter from "./routes/userRoutes.js";


const app = express();
const port = 4000;

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// DB
ConnectDB();

// ROUTES
app.use('/api/auth', userRouter);

app.get('/', (req, res) => {
    res.send('API Working');
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));