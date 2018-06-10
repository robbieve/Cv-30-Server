const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const validator = require('validator');
const uniqid = require('uniqid');
const uuid = require('uuidv4');

const createAccount = async (nickname, email, password, { models }) => {
    let response = {
        status: false,
        error: ''
    };

    nickname = nickname.trim();
    if (!nickname || nickname.trim().length < 1 || nickname.trim().length > 50) {
        response.error = 'Nickname should be between 1 and 50 characters';
        return response;
    }

    email = email.trim();
    if (email.length < 1 || email.length > 100) {
        response.error = 'Email should be between 1 and 30 characters';
        return response;
    } else if (!validator.isEmail(email)) {
        response.error = 'Invalid email address'
        return response;
    }

    if (password.length < 1 || password.length > 30) {
        response.error = 'Password should be between 1 and 30 characters';
        return response;
    }

    let user = await models.user.findOne({
        where: {
            email: email
        }
    });

    if (user) {
        response.error = 'Someone might have beat you to it :)';
        return response;
    }

    user = await models.user.create({
        uid: uniqid(),
        nickname,
        email,
        salt: await bcrypt.hash("" + new Date().getTime(), 12),
        status: 'pending',
        activationToken: uuid(),
        hash: await bcrypt.hash(password, 12)
    }, {});

    if (!user) {
        response.error = 'Sorry ... we could not create your account';
        return response;
    }

    const activationButton = `
    <table>
        <tr>
            <td style="background-color: #4ecdc4;border-color: #4c5764;border: 2px solid #45b7af;padding: 10px;text-align: center;">
                <a style="display: block;color: #ffffff;font-size: 12px;text-decoration: none;text-transform: uppercase;" href="${process.env.APP_HOST}/activate/${user.activationToken}">
                Activate Account
                </a>
            </td>
        </tr>
    </table>
    `;

    const mailParams = {
        from: process.env.SMTP_EMAIL,
        to: user.email,
        subject: 'Activation',
        text: `token: ${user.activationToken}`,
        html: activationButton
    };

    let emailHandle = await _sendEmail(
        /*from: */
        process.env.SMTP_EMAIL,
        /*to: */
        user.email,
        /*subject: */
        'Account Activation',
        /*text: */
        `token: ${user.activationToken}`,
        /*html: */
        activationButton
    );

    if (emailHandle.err) {
        response.error = emailHandle.err;
        return response;
    } else {
        response.status = true;
        response.error = '';
        return response;
    }
};

const activateAccount = async (token, { models }) => {
    let response = {
        status: false,
        error: null
    };

    if (!token) {
        response.error = 'No token provided.'
        return response;

    }

    const user = await models.user.findOne({
        where: {
            activationToken: token
        }
    });

    if (!user) {
        response.error = 'No user found for that activation code.'
        return response;
    }


    user.status = 'active';
    user.activationToken = null;

    if (await user.save()) {
        response.status = true;
    } else {
        response.error = 'Update failed.'
        return response;
    }
    return response;
};

const attemptLogin = async (email, password, { models }) => {
    let response = {
        token: '',
        refreshToken: '',
        error: ''
    }
    email = email.trim();
    if (email.length > 100) {
        response.error = 'Email address is longer than 100 characters';
        return response;

    } else if (!validator.isEmail(email)) {
        response.error = 'Invalid email address';
        return response;

    }
    console.log(email);

    if (password.length > 30) {
        response.error = 'Password is longer than 30 characters';
        return response;
    }

    const user = await models.user.findOne({
        where: {
            email: email,
            status: 'active'
        }
    });

    if (!user) {
        response.error = 'Invalid credentials';
        return response;
    }

    const valid = await bcrypt.compare(password, user.hash);
    if (!valid) {
        response.error = 'Invalid credentials';
        return response;
    }
    let tokens =
        _createTokens(user);
    return tokens;
}

const checkTokens = async (token, refreshToken, { models }) => {
    let decodedToken;
    let decodedRefreshToken;
    let user;
    let response = {
        status: false,
        token: null,
        refreshToken: null,
        error: null
    }
    try {
        decodedToken = await jwt.decode(token);
        decodedRefreshToken = await jwt.decode(refreshToken);
        decodedToken.data = JSON.parse(_decrypt(decodedToken.data));
        decodedRefreshToken.data = JSON.parse(_decrypt(decodedRefreshToken.data));
        user = await models.user.findOne({
            where: {
                id: decodedToken.data.id
            }
        });
        decodedToken = await jwt.verify(token, user.salt + process.env.JWT_SECRET);
        decodedRefreshToken = await jwt.verify(refreshToken, user.salt + process.env.JWT_REFRESH_SECRET);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            const { token, refreshToken } = _createTokens(user);
            response.token = token;
            response.refreshToken = refreshToken;
            response.status = false;
            return response;
        } else {
            response.error = err;
            return response;
        }
    }
    response.status = true;

    return response;
}

const forgotPasswordSendCode = async (email, { models }) => {
    let response = {
        status: false,
        error: null
    };
    let user = null;


    email = email.trim();
    if (email.length > 100) {
        response.error = 'Email is longer than 100 characters';
        return response;
    } else if (!validator.isEmail(email)) {
        response.error = 'Email is invalid'
        return response;
    }
    try {
        user = await models.user.findOne({
            where: {
                email: email
            }
        });
    } catch (err) {
        response.error = err;
        return response;
    }

    if (user) {
        user.passwordResetToken = uuidv4();
        if (await user.save()) {
            let emailHandle = await _sendEmail(
                /*from: */
                process.env.SMTP_EMAIL,
                /*to: */
                email,
                /*subject: */
                'Password recovery token',
                /*text: */
                `token: ${user.passwordResetToken}`,
                /*html: */
                `token: <b>${user.passwordResetToken}</b>`
            );

            if (emailHandle.err) {
                response.error = err;
                return response;
            } else {
                response.status = true;
            }
        }
    } else {
        response.error = 'No user with that email.'
        return response;
    }

    return response;
}

const forgotPasswordUpdate = async (token, password, { models }) => {
    let response = {
        status: false,
        error: null
    };
    let user = null;

    if (password.length > 30) {
        response.error = 'Password is longer than 30 characters';
        return response;
    }
    try {
        user = await models.user.findOne({
            where: {
                passwordResetToken: token
            }
        });
    } catch (err) {
        response.error = 'Invalid credentials';
        return response;
    }

    if (user) {
        user.passwordResetToken = null;
        user.salt = await bcrypt.hash("" + new Date().getTime(), 12);
        user.hash = await bcrypt.hash(password, 12);
        if (await user.save()) {
            response.status = true;
        }
    } else {
        response.error = 'Invalid credentials';
        return response;
    }
    return response;
}

const forgotPasswordCheckToken = async (token, { models }) => {
    let status = false;
    let user = null;
    let error = [];
    try {
        user = await models.user.findOne({
            where: {
                passwordResetToken: token
            }
        });
    } catch (err) {
        return {
            error: 'Invalid credentials'
        };
    }
    if (user) {
        status = true;
    } else {
        return {
            error: 'Invalid credentials'
        };
    }
    return {
        status,
        error
    }
}

const _createTokens = (user) => {
    const token = jwt.sign({
        data: _encrypt(JSON.stringify({
            id: user.id
        }))
    },
        user.salt + process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_LIFETIME
        }
    );
    const refreshToken = jwt.sign({
        data: _encrypt(JSON.stringify({
            id: user.id
        }))
    },
        user.salt + process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_LIFETIME
        }
    );
    return {
        token: token,
        refreshToken: refreshToken
    };
}

const _encrypt = (text) => {
    const cipher = crypto.createCipher(process.env.JWT_CRYPTO_ALGORITHM, process.env.JWT_CRYPTO_PASSWORD);
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

const _decrypt = (text) => {
    const decipher = crypto.createDecipher(process.env.JWT_CRYPTO_ALGORITHM, process.env.JWT_CRYPTO_PASSWORD)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

const _sendEmail = async (sender, destination, subject, text, html) => {
    const smtpConfig = {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD
        }
    };
    let transporter = nodemailer.createTransport(smtpConfig);
    return await transporter.sendMail({
        from: sender,
        to: destination,
        subject: subject,
        text: text,
        html: html
    });
}

module.exports = {
    createAccount,
    attemptLogin,
    checkTokens,
    forgotPasswordSendCode,
    forgotPasswordUpdate,
    forgotPasswordCheckToken,
    activateAccount
};