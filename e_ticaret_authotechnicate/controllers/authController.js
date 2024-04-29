const passport = require('passport');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
const JWT_KEY = "jwtactive987";
const JWT_RESET_KEY = "jwtreset987";
const { Pool }= require('pg');
const User=require('../models/User');

//------------ User Model ------------//
const pool=new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres123',
    port: 5432,   
});

//------------ Register Handle ------------//
exports.registerHandle = (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //------------ Checking required fields ------------//
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    //------------ Checking password mismatch ------------//
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    //------------ Checking password length ------------//
    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
        async function addData(name,email,password) {
            try {
                const client = await pool.connect();
                const query = 'INSERT INTO Users (UserNameSurname, userMail, userPassword) VALUES ($1, $2,$3) RETURNING *';
                const values = [name, email,password]; // values to be added
                const result = await client.query(query, values);
                console.log('Data Added', result.rows[0]);
                client.release();
              } catch (err) {
                console.error('Error:', err);
              }
            
        }
        addData(name,email,password);
    } else {
        //------------ Validation passed ------------//
        User.findOne({
            where: {
                userMail: email
            }
        }
            
        ).then(user => {
            if (user) {
                //------------ User already exists ------------//
                errors.push({ msg: 'Email ID already registered' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {

                const oauth2Client = new OAuth2(
                    "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com", // ClientID
                    "OKXIYR14wBB_zumf30EC__iJ", // Client Secret
                    "https://developers.google.com/oauthplayground" // Redirect URL
                );

                oauth2Client.setCredentials({
                    refresh_token: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w"
                });
                const accessToken = oauth2Client.getAccessToken()

                const token = jwt.sign({ name, email, password }, JWT_KEY, { expiresIn: '30m' });
                const CLIENT_URL = 'http://' + req.headers.host;

                const output = `
                <h2>Please click on below link to activate your account</h2>
                <p>${CLIENT_URL}/auth/activate/${token}</p>
                <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>
                `;

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: "OAuth2",
                        user: "tolgaolgun47@gmail.com",
                        clientId: "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com",
                        clientSecret: "OKXIYR14wBB_zumf30EC__iJ",
                        refreshToken: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w",
                        accessToken: accessToken
                    },
                });

                // send mail with defined transport object
                const mailOptions = {
                    from: '"Auth Admin" <tolgaolgun47@gmail.com>', // sender address
                    to: userMail, // list of receivers
                    subject: "Account Verification: NodeJS Auth ✔", // Subject line
                    generateTextFromHTML: true,
                    html: output, // html body
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                        req.flash(
                            'error_msg',
                            'Something went wrong on our end. Please register again.'
                        );
                        res.redirect('/auth/login');
                    }
                    else {
                        console.log('Mail sent : %s', info.response);
                        req.flash(
                            'success_msg',
                            'Activation link sent to email ID. Please activate to log in.'
                        );
                        res.redirect('/auth/login');
                    }
                })

            }
        });
    }
}

//------------ Activate Account Handle ------------//
exports.activateHandle = (req, res) => {
    const token = req.params.token;
    let errors = [];
    if (token) {
        jwt.verify(token, JWT_KEY, (err, decodedToken) => {
            if (err) {
                req.flash(
                    'error_msg',
                    'Incorrect or expired link! Please register again.'
                );
                return res.redirect('/auth/register');
            }
            const { name, email, password } = decodedToken;
            User.findOne({ 
                where: {
                    userMail: email
                }
            }).then(user => {
                if (user) {
                    // User already exists
                    req.flash(
                        'error_msg',
                        'Email ID already registered! Please log in.'
                    );
                    return res.redirect('/auth/login');
                } else {
                    bcryptjs.genSalt(10, (err, salt) => {
                        bcryptjs.hash(userPassword, salt, (err, hash) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).send('Server Error');
                            }
                            User.create({
                                UserNameSurname:name,
                                userMail: email,
                                userPassword: hash
                            }).then(() => {
                                req.flash(
                                    'success_msg',
                                    'Account activated. You can now log in.'
                                );
                                res.redirect('/auth/login');
                            }).catch(err => {
                                console.error(err);
                                return res.status(500).send('Server Error');
                            });
                        });
                    });
                }
            }).catch(err => {
                console.error(err);
                return res.status(500).send('Server Error');
            });
        });
    } else {
        console.log("Account activation error!");
        return res.status(400).send('Bad Request');
    }
};


//------------ Forgot Password Handle ------------//
exports.forgotPassword = (req, res) => {
    const { email } = req.body;
    let errors = [];

    //------------ Checking required fields ------------//
    if (!email) {
        errors.push({ msg: 'Please enter an email ID' });
    }

    if (errors.length > 0) {
        res.render('forgot', {
            errors,
            email
        });
    } else {
        User.findOne({
            where: {
                userMail: email
            }
        }).then(user => {
            if (!user) {
                //------------ User does not exist ------------//
                errors.push({ msg: 'User with Email ID does not exist!' });
                res.render('forgot', {
                    errors,
                    email
                });
            } else {
                const token = jwt.sign({ _id: user._id }, JWT_RESET_KEY, { expiresIn: '30m' });
                const CLIENT_URL = 'http://' + req.headers.host;
                const output = `
                <h2>Please click on below link to reset your account password</h2>
                <p>${CLIENT_URL}/auth/forgot/${token}</p>
                <p><b>NOTE: </b> The activation link expires in 30 minutes.</p>
                `;

                User.update(
                    { resetLink: token }, // Areas to be updated
                    { where: { userMail: email } } // Condition
                ).then((result) => {
                    if (result[0] === 0) {
                        errors.push({ msg: 'Error resetting password!' });
                        res.render('forgot', {
                            errors,
                            email
                        });
                    } else {
                        const oauth2Client = new OAuth2(
                            "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com", // ClientID
                            "OKXIYR14wBB_zumf30EC__iJ", // Client Secret
                            "https://developers.google.com/oauthplayground" // Redirect URL
                        );
                
                        oauth2Client.setCredentials({
                            refresh_token: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w"
                        });
                        const accessToken = oauth2Client.getAccessToken()
                
                        const CLIENT_URL = 'http://' + req.headers.host;
                        const output = `
                        <h2>Please click on below link to reset your account password</h2>
                        <p>${CLIENT_URL}/auth/forgot/${token}</p>
                        <p><b>NOTE: </b> The activation link expires in 30 minutes.</p>
                        `;
                
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                type: "OAuth2",
                                user: "tolgaolgun47@gmail.com",
                                clientId: "173872994719-pvsnau5mbj47h0c6ea6ojrl7gjqq1908.apps.googleusercontent.com",
                                clientSecret: "OKXIYR14wBB_zumf30EC__iJ",
                                refreshToken: "1//04T_nqlj9UVrVCgYIARAAGAQSNwF-L9IrGm-NOdEKBOakzMn1cbbCHgg2ivkad3Q_hMyBkSQen0b5ABfR8kPR18aOoqhRrSlPm9w",
                                accessToken: accessToken
                            },
                        });
                
                        const mailOptions = {
                            from: '"Auth Admin" <tolgaolgun47@gmail.com>',
                            to: email,
                            subject: "Account Password Reset: NodeJS Auth ✔",
                            html: output,
                        };
                
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log(error);
                                req.flash(
                                    'error_msg',
                                    'Something went wrong on our end. Please try again later.'
                                );
                                res.redirect('/auth/forgot');
                            } else {
                                console.log('Mail sent : %s', info.response);
                                req.flash(
                                    'success_msg',
                                    'Password reset link sent to email ID. Please follow the instructions.'
                                );
                                res.redirect('/auth/login');
                            }
                        });
                    }
                }).catch(err => {
                    console.error(err);
                    errors.push({ msg: 'Error resetting password!' });
                    res.render('forgot', {
                        errors,
                        email
                    });
                });
                
                
            }
        });
    }
};


//------------ Redirect to Reset Handle ------------//
exports.gotoReset = (req, res) => {
    const { token } = req.params;

    if (token) {
        jwt.verify(token, JWT_RESET_KEY, (err, decodedToken) => {
            if (err) {
                req.flash(
                    'error_msg',
                    'Incorrect or expired link! Please try again.'
                );
                return res.redirect('/auth/login');
            }
            const userId = decodedToken._id;
            User.findOne({
                where: {
                    id: userId
                }
            }).then(user => {
                if (!user) {
                    req.flash(
                        'error_msg',
                        'User with email ID does not exist! Please try again.'
                    );
                    return res.redirect('/auth/login');
                } else {
                    return res.render('reset', { userId: userId });
                }
            }).catch(err => {
                console.error(err);
                req.flash(
                    'error_msg',
                    'An error occurred! Please try again.'
                );
                return res.redirect('/auth/login');
            });
        });
    } else {
        console.log("Password reset error!");
        
    }
}



exports.resetPassword = (req, res) => {
    const { password, password2 } = req.body;
    const id = req.params.id;
    let errors = [];

    //------------ Checking required fields ------------//
    if (!password || !password2) {
        req.flash(
            'error_msg',
            'Please enter all fields.'
        );
        return res.redirect(`/auth/reset/${id}`);
    }

    //------------ Checking password length ------------//
    else if (password.length < 8) {
        req.flash(
            'error_msg',
            'Password must be at least 8 characters.'
        );
        return res.redirect(`/auth/reset/${id}`);
    }

    //------------ Checking password mismatch ------------//
    else if (password !== password2) {
        req.flash(
            'error_msg',
            'Passwords do not match.'
        );
        return res.redirect(`/auth/reset/${id}`);
    }

    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(password, salt, (err, hash) => {
            if (err) {
                console.error(err);
                req.flash(
                    'error_msg',
                    'Error hashing password!'
                );
                return res.redirect(`/auth/reset/${id}`);
            }

            const newPassword = hash;

            User.update(
                { userPassword: newPassword },
                { where: { id: id } }
            ).then(result => {
                if (result[0] === 0) {
                    req.flash(
                        'error_msg',
                        'User not found or password not updated!'
                    );
                    return res.redirect(`/auth/reset/${id}`);
                }
                req.flash(
                    'success_msg',
                    'Password reset successfully!'
                );
                return res.redirect('/auth/login');
            }).catch(err => {
                console.error(err);
                req.flash(
                    'error_msg',
                    'Error resetting password!'
                );
                return res.redirect(`/auth/reset/${id}`);
            });
        });
    });
}

//------------ Login Handle ------------//
exports.loginHandle = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
}

//------------ Logout Handle ------------//
exports.logoutHandle = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/auth/login');
}