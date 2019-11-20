const CUSTOMER = require("./cust.model")
const custo = require('./customer')
const csv = require('fast-csv')
const fs = require('fs')

const addCustomer = async (req,res,next) => {

    // extract data from the body
    const {data,addPartialyHappen} = req.body
    const newData = new CUSTOMER({
        name:data.name,
        email:data.email,
        phone1:data.phone1,
        phone2:data.phone2
    })
    let docs=[];
    const cust = new custo(newData)
   
    await cust.search()
   
    if (cust.isNone()){
        console.log("there is no recored")
        try {

            await cust.saveTodataBase()
            await cust.indexing()
            return res.status(200).json({ 
                    code:"ES200",
                     msg:"successfully added"
                    })
        } catch (error) {
            return res.status(500).json({
                msg:"somthin went wrong",
                code:"ES500",
                err:error.message
            })
        }

    } else if (cust.isExact()){

        console.log("exact match thu will not inserted to database")
        return res.status(400).json({
            "msg": "user is alredy existied and exatly match ",
            "code":"Es400"
        })
    } else if(cust.isPartial()){
        console.log(cust.es.hits.hits)
            if (cust.es.hits.total.value > 1){
                docs = cust.es.hits.hits.filter(val => val._score == cust.es.hits.max_score )
        }else{
                docs = [...cust.es.hits.hits]
        }

        console.log("partial match")
        return res.status(300).json({
            code:"ES300",
            msg:"partial happen",
            docs
        })
    }
    // console.log(addPartialyHappen)
    // const es = await CUSTOMER.exactOrPartial(newData)

    // if (!es.hits.max_score || addPartialyHappen){

    //     try {
    //          await newData.mIndexing(()=>console.log("indexing"))
        
    //     } catch (err) {
    //         console.log(err)
    //         return res.status(500).json({
    //             "msg": "somthinWentWrong Check Indexing functionality",
    //             err: err.message
    //         })
    //     }

    // try {
   
    // let result = await newData.save()
   
    // if (result) {
    //     return res.status(200).json({
    //         "msg": "successfully added new recored and indexed it",
    //         "code":"ES200"
    //     })
    // }
    // } catch (error) {
    //     console.log(err)
    
    // }



    // } else if (es.hits.max_score>10){

    //     console.log("exact match thu will not inserted to database")
    //     return res.status(400).json({
    //         "msg": "user is alredy existied and exatly match ",
    //         "code":"Es400"
    //     })

    // }else{

    //     if (es.hits.total.value > 1){
    //         docs = es.hits.hits.filter(val => val._score == es.hits.max_score )
    //     }else{
    //         docs = [...es.hits.hits]
    //     }
       
    //     console.log("partial match")
    //     return res.status(300).json({
    //         code:"ES300",
    //         msg:"partial happen",
    //         docs
    //     })

    // }

   
  
}

const addCsvCustomer = (req,res,next) =>{
    
    const file = req.file

    csv.fromPath(file.path,{headers:true})
    .on('data',(row) => console.log(row))
    .on('end',()=>{
        fs.unlinkSync(file.path)
    })

}



module.exports = {
    addCustomer,
    addCsvCustomer
}