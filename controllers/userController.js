import userModel from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import transporter from "../config/emailConfig.js";


class userController {

    static userRegisteration = async (req, res) => {
        const { name, email, password, password_confirmation, tc } = req.body;

        const user = await userModel.findOne({ email })
        console.log("user", user)
        if (user) {
            res.send({ "status": "failed", "message": "User already exist" })
        } else {
            if (name && email && password && password_confirmation && tc) {
                if (password === password_confirmation) {
                    try {
                        const salt = await bcrypt.genSalt(10);
                        const hassedPassword = await bcrypt.hash(password, salt)
                        const doc = new userModel({
                            name,
                            email,
                            password: hassedPassword,
                            tc
                        })

                        await doc.save();

                        const saved_user = await userModel.findOne({ email });

                        const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' })

                        res.send({ "status": "success", "message": "user registered successfully", "token": token })
                    } catch (err) {
                        res.send({ "status": "failed", "message": "Unable to register" })
                    }

                } else {
                    res.send({ "status": "failed", "message": "passwor and confirm password dosen't match" })
                }
            } else {
                res.send({ "status": "failed", "message": "All fields are required" })
            }
        }
    }


    static userLogin = async (req, res) => {
        const { email, password } = req.body;
        if (email && password) {
            const user = await userModel.findOne({ email });
            if (user != null) {

                const isMatch = await bcrypt.compare(password, user.password);

                if ((user.email === email) && isMatch) {
                    const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' })

                    res.send({ "status": "Success", "message": "login success", token })
                } else {
                    res.send({ "status": "failed", "message": "Wrong email or password" })
                }

            } else {
                res.send({ "status": "failed", "message": "You are not a registered User" })
            }
        } else {
            res.send({ "status": "failed", "message": "All fields are required" })
        }


    }


    static changeUserPassword = async (req, res) => {
        const { password, password_confirmation } = req.body;
        if (password && password_confirmation) {
            if (password !== password_confirmation) {
                res.send({ "status": "failed", "message": "new password and new password confirm dosen't match" })
            } else {
                const salt = await bcrypt.genSalt(10);
                const newHashPassword = await bcrypt.hash(password, salt)
                console.log("req.user", req.user)

                await userModel.findByIdAndUpdate(req.user._id, { $set: { password: newHashPassword } })
                res.send({ "status": "success", "message": "password changed successfully" })

            }
        } else {
            res.send({ "status": "failed", "message": "All fields are required" })
        }
    }

    static loggedUser = async (req, res) => {
        res.send({ "user": req.user })
    }

    static sendUserPasswordResetEmail = async (req, res) => {
        const { email } = req.body;

        if (email) {

            const user = await userModel.findOne({ email })
            if (user) {

                const secret = user._id + process.env.JWT_SECRET_KEY;

                const token = jwt.sign({ userID: user._id }, secret, { expiresIn: "15m" });

                const link = `http://localhost:3000/reset/${user._id}/${token}`
                console.log(link);

                let info = await transporter.sendMail({
                    from: process.env.EMAIL_FROM,
                    to:user.email,
                    subject:"reset password......",
                    html:`<a href=${link}>CLICK HERE</a> to reset your password`
                })

                res.send({ "status": "success", "message": "reset link sent , check ypur email ", info })


            } else {
                res.send({ "status": "failed", "message": "Email dosen't exist " })
            }
        } else {
            res.send({ "status": "failed", "message": "All fields are required" })
        }
    }

    static userPasswordReset = async (req, res) => {

        const { password, password_confirmation } = req.body;
        const { id, token } = req.params;

        const user = await userModel.findById(id);

        const new_secret = user._id + process.env.JWT_SECRET_KEY;

        try {
            jwt.verify(token, new_secret)
            if (password && password_confirmation) {
                if (password === password_confirmation) {
                    const salt = await bcrypt.genSalt(10);
                    const hashNewPassword = await bcrypt.hash(password, salt)

                    await userModel.findByIdAndUpdate(user._id, {$set:{password:hashNewPassword}})

                    res.send({ "status": "success", "message": "password reset successfully" })
                } else {
                    res.send({ "status": "failed", "message": "password and confirm password should be same" })
                }
            } else {
                res.send({ "status": "failed", "message": "All fields are required" })
            }
        } catch (err) {
            res.send({ "status": "failed", "message": "Invalid Token" })
        }

    }
}


export default userController