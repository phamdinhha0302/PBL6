var express = require('express');
var router = express.Router();
var connection = require('../lib/db');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcrypt'); // Sử dụng bcrypt cho việc mã hóa mật khẩu

// Display login page
router.get('/login', function (req, res, next) {
    res.render('auth/login', {
        title: 'Login',
        email: '',
        password: ''
    });
});

// Authenticate user
router.post('/authentication', async function (req, res, next) {
    try {
        var email = req.body.email;
        var password = req.body.password;

        // Kiểm tra người dùng trong database
        connection.query('SELECT * FROM users WHERE email = ?', [email], async function (err, rows) {
            if (err) {
                req.flash('error', 'Database error: ' + err.message);
                return res.redirect('/login');
            }

            // Nếu không tìm thấy người dùng hoặc mật khẩu không khớp
            if (rows.length <= 0 || !(await bcrypt.compare(password, rows[0].password))) {
                req.flash('error', 'Incorrect email or password!');
                return res.redirect('/login');
            } else { // Nếu tìm thấy người dùng và mật khẩu khớp
                req.session.loggedin = true;
                req.session.name = rows[0].name;
                return res.redirect('/home');
            }
        });
    } catch (error) {
        // Xử lý lỗi trong quá trình authentication
        req.flash('error', 'An error occurred during authentication.');
        return res.redirect('/login');
    }
});

// Display registration page
router.get('/register', function (req, res, next) {
    res.render('auth/register', {
        title: 'Registration Page',
        name: '',
        email: '',
        password: ''
    });
});

// User registration
router.post('/post-register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res, next) => {
    try {
        const errors = validationResult(req);

        // Nếu có lỗi xác thực, gửi lại thông báo lỗi cho người dùng
        if (!errors.isEmpty()) {
            let error_msg = errors.array().map(err => err.msg).join('<br>');
            req.flash('error', error_msg);
            return res.render('auth/register', {
                title: 'Registration Page',
                name: req.body.name,
                email: req.body.email,
                password: ''
            });
        }

        // Tạo đối tượng user và mã hóa mật khẩu
        const user = {
            name: req.body.name.trim(),
            email: req.body.email.trim(),
            password: await bcrypt.hash(req.body.password.trim(), 10) // Mã hóa mật khẩu
        };

        // Thêm người dùng mới vào database
        connection.query('INSERT INTO users SET ?', user, function (err) {
            if (err) {
                req.flash('error', 'Error registering user: ' + err.message);
                return res.render('auth/register', {
                    title: 'Registration Page',
                    name: req.body.name,
                    email: req.body.email,
                    password: ''
                });
            } else {
                req.flash('success', 'You have successfully signed up!');
                return res.redirect('/login');
            }
        });
    } catch (error) {
        // Xử lý lỗi trong quá trình đăng ký
        req.flash('error', 'An error occurred during registration.');
        return res.redirect('/register');
    }
});

// Display home page
router.get('/home', function (req, res, next) {
    if (req.session.loggedin) {
        res.render('auth/home', {
            title: "Dashboard",
            name: req.session.name,
        });
    } else {
        req.flash('error', 'Please login first!');
        res.redirect('/login');
    }
});

// Logout user
router.get('/logout', function (req, res) {
    req.session.destroy();
    res.clearCookie('session');
    res.redirect('/login');
});

module.exports = router;
