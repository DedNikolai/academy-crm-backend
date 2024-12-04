import express from 'express';
// import path from 'path';
import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import auth from './routes/auth.js';
import roles from './routes/role.js';
import subject from './routes/subject.js';
import teacher from './routes/teacher.js';
import worktime from './routes/worktime.js';
import student from './routes/student.js';
 
mongoose.connect(process.env.DB_URL)
    .then(() =>console.log("DB OK"))
    .catch((error) => console.log("DB Error", error))

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
    // const __dirname = path.resolve();
    // resp.sendFile(path.join(__dirname, 'public/index.html'))
    res.send('Hello CRM')
})

app.use('/auth', auth);
app.use('/roles', roles);
app.use('/subject', subject);
app.use('/teacher', teacher);
app.use('/worktime', worktime);
app.use('/student', student);


app.listen(port, (err) => {
    if (err) {
        console.log(err)
    }
    console.log('Start Server Ok')
})