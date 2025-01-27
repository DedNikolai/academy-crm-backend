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
import ticket from './routes/ticket.js';
import lesson from './routes/lesson.js';
import payaccount from './routes/payAccount.js'
import salary from './routes/salary.js';
import expense from './routes/expense.js';
import studentTime from './routes/studentTime.js'
 
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

app.use('/api/auth', auth);
app.use('/api/roles', roles);
app.use('/api/subject', subject);
app.use('/api/teacher', teacher);
app.use('/api/worktime', worktime);
app.use('/api/student', student);
app.use('/api/ticket', ticket);
app.use('/api/lesson', lesson);
app.use('/api/payaccount', payaccount);
app.use('/api/salary', salary);
app.use('/api/expense', expense);
app.use('/api/student-time', studentTime);

app.listen(port, (err) => {
    if (err) {
        console.log(err)
    }
    console.log('Start Server Ok')
})