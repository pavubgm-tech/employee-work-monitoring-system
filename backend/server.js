const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

app.use(cors());
app.use(bodyParser.json());


// HOME ROUTE
app.get('/', (req, res) => {
    res.send('Cybersecurity Audit System Running');
});


// REGISTER API
app.post('/register', (req, res) => {

    const { username, password } = req.body;

    const sql = 'INSERT INTO users(username, password, role) VALUES (?, ?, ?)';

    db.query(sql, [username, password, 'user'], (err, result) => {

        if(err){
            console.log(err);
            res.send('Registration Failed');
        } 
        else {
            res.send('User Registered Successfully');
        }

    });

});


// LOGIN API
app.post('/login', (req, res) => {

    const { username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';

    db.query(sql, [username, password], (err, result) => {

        if(err){

            console.log(err);

            res.send('Login Failed');

        } 
        
        else {

            if(result.length > 0){

                const role = result[0].role;

                const logSql = `
                    INSERT INTO activity_logs(username, activity)
                    VALUES (?, ?)
                `;

                db.query(logSql, [username, 'Login Successful']);

                if(role === 'host'){

                    res.json({
                        message: 'Host Login Successful',
                        role: 'host'
                    });

                } 
                
                else {

                    res.json({
                        message: 'User Login Successful',
                        role: 'user'
                    });

                }

            }

            else {

                const logSql = `
                    INSERT INTO activity_logs(username, activity)
                    VALUES (?, ?)
                `;

                db.query(logSql, [username, 'Failed Login Attempt']);

                res.send('Invalid Username or Password');

            }

        }

    });

});

app.get('/logs', (req, res) => {

    const sql = 'SELECT * FROM activity_logs ORDER BY created_at DESC';

    db.query(sql, (err, result) => {

        if(err){
            console.log(err);
            res.send('Failed To Fetch Logs');
        } else {
            res.json(result);
        }

    });

});

app.delete('/delete-log/:id', (req, res) => {

    const id = req.params.id;

    const sql = 'DELETE FROM activity_logs WHERE id = ?';

    db.query(sql, [id], (err, result) => {

        if(err){
            console.log(err);
            res.send('Failed To Delete Log');
        } else {
            res.send('Log Deleted Successfully');
        }

    });

});

app.get('/search-logs/:username', (req, res) => {

    const username = req.params.username;

    const sql = 'SELECT * FROM activity_logs WHERE username = ?';

    db.query(sql, [username], (err, result) => {

        if(err){
            console.log(err);
            res.send('Search Failed');
        } else {
            res.json(result);
        }

    });

});

app.get('/stats', (req, res) => {

    const stats = {};

    // TOTAL LOGS
    db.query(
        'SELECT COUNT(*) AS totalLogs FROM activity_logs',
        (err, result1) => {

            if(err){
                console.log(err);
            } else {

                stats.totalLogs = result1[0].totalLogs;

                // FAILED LOGINS
                db.query(
                    "SELECT COUNT(*) AS failedLogins FROM activity_logs WHERE activity = 'Failed Login Attempt'",
                    (err, result2) => {

                        if(err){
                            console.log(err);
                        } else {

                            stats.failedLogins = result2[0].failedLogins;

                            // TOTAL USERS
                            db.query(
                                'SELECT COUNT(*) AS totalUsers FROM users',
                                (err, result3) => {

                                    if(err){
                                        console.log(err);
                                    } else {

                                        stats.totalUsers = result3[0].totalUsers;

                                        res.json(stats);
                                    }

                                }
                            );

                        }

                    }
                );

            }

        }
    );

});


app.post('/save-note', (req, res) => {

    const { username, note } = req.body;

    const sql = `
        INSERT INTO notes(username, note)
        VALUES (?, ?)
    `;

    db.query(sql, [username, note], (err, result) => {

        if(err){

            console.log(err);

            res.send('Failed To Save Note');

        } 
        
        else {

            res.send('Note Saved Successfully');

        }

    });

});

app.get('/notes/:username', (req, res) => {

    const username = req.params.username;

    const sql = `
        SELECT * FROM notes
        WHERE username = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [username], (err, result) => {

        if(err){

            console.log(err);

            res.send('Failed To Fetch Notes');

        } 
        
        else {

            res.json(result);

        }

    });

});

app.get('/all-notes', (req, res) => {

    const sql = `
        SELECT * FROM notes
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, result) => {

        if(err){

            console.log(err);

            res.send('Failed To Fetch Notes');

        } 
        
        else {

            res.json(result);

        }

    });

});
app.listen(5000, () => {
    console.log('Server Started On Port 5000');
});