const express = require('express');
const Router = express.Router;
const router = Router()
const Controller= require('./cust.controller')
const upload  =require("../config/multer");
const multer =require("multer");

router.route('/addCustomer').post(Controller.addCustomer)



router.route('/addCustomer/csv').post((req,res,next)=>{

        console.log("upload start #uploading")
        upload(req, res, function (err) {
            console.log("upload starting invokin")
            if (err instanceof multer.MulterError) {
                return res.status(504).json({
                    code: "M504",
                    err: err.message,
                    msg: "somthin went wrong at iage uplad call thedeveloper"
                })

            } else if (err) {
                return res.status(504).json({
                    code: "M504",
                    err: err.message,
                    msg: "somthin went wrong at iage uplad call thedeveloper"
                })
            }
            console.log("upload end #next")
            next()
        })
    
},Controller.addCsvCustomer)



module.exports = router