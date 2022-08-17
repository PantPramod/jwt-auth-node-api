import userModel from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


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
}


export default userController