import express from 'express'
import checkUserAuth from '../middlewares/auth-middleware.js';
import employee from '../models/Employee.js';
const router = express.Router();

router.get('/', checkUserAuth, async (req, res) => {
    try {
        const employees = await employee.find({})
        console.log(employees)
        res.send({ data:  employees})
    } catch (err) {
        res.status(404).send({ "msg": err.message })
    }
})


router.post('/', checkUserAuth, async (req, res) => {
    const { username, email, phoneno, company } = req.body;

    try {
        const isemployeeExist = await employee.findOne({ email })

        if (isemployeeExist) {
            res.send({ "status": "failed", "message": "Employee with same email already exist" })
        } else {
            const createdEmployee =  new employee({ username, email, phoneno, company })
            const savedEmployee= await createdEmployee.save();
            res.send({ savedEmployee})
        }
    } catch (err) {
        res.status(404).send({ "msg": err.message })
    }
})

router.patch('/:id',checkUserAuth, async (req, res) => {
    try {
        const {username, email, phoneno, company} = req.body
        const employeeToUpdate = await employee.findById(req.params.id)
        if(username) employeeToUpdate.username = username
        if(email) employeeToUpdate.email = email
        if(phoneno) employeeToUpdate.phoneno = phoneno
        if(company) employeeToUpdate.company = company

        const a1 = await employeeToUpdate.save()
        
        res.status(204).send({"msg":"updated successfully"})
    
    } catch (err) {
        res.send('Error' + err)
    }

})

router.delete('/:id',checkUserAuth, async (req, res) => {
    try {
        const removedEmployee = await employee.remove({ _id: req.params.id });
        res.json(removedEmployee);
    }
    catch (err) {
        res.send("Error" + err);
    }
})

export default router