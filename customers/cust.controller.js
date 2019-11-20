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
            docs:[docs[0]]
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

const addCsvCustomer = async (req,res,next) =>{``
    
    const file = req.file
    let partialMatch =[]
    let myDocs=[]
    let data=[]
    csv.parseFile(file.path,{headers:true})
    .on('data',function(dat){
        data.push(dat)
    })
    .on('end',async ()=>{
        fs.unlinkSync(file.path)
        
        for (let i = 0; i < data.length; i++) {

            if (data[i].CustomerName == undefined || data[i].Email == undefined || data[i].Phone1 == undefined ){
                return res.status(500).json({
                    code:"ES500CSV",
                    msg:"csv not valida collumn",
                    
                })
            }
            const newData = new CUSTOMER({
                name: data[i].CustomerName,
                email: data[i].Email,
                phone1: data[i].Phone1,
                phone2: data[i].Phone2
            })

            const cust = new custo(newData)
            try {
                await cust.search()
                
            } catch (error) {
                console.log(error)
                return res.status(500).json({
                    code:"ES500ES",
                    msg:"somthinwent wrong at elasticsearch engin call the developer"
                })
            }

            if (cust.isNone()) {
                console.log("there is no recored")
                try {
                    console.log("added new recored to database & indexing")
                   let status = await cust.indexing()
                   if(status){
                       console.log("before database ")
                       await cust.saveTodataBase()
                       console.log("afetre database ")

                   }
                    
                    console.log("end added new recored to database & indexing")
                } catch (error) {
                    // throw error

                    return res.status(500).json({
                        code:"ES500",
                        err:error.message,
                        msg:"sothin went wrong at indexing check the server"
                    })
                }

            } else if (cust.isExact()) {

                console.log("exact match thu will not inserted to database")

            } else if (cust.isPartial()) {
                // console.log(cust.es.hits.hits)
                if (cust.es.hits.total.value > 1) {
                    partialMatch = cust.es.hits.hits.filter(val => val._score == cust.es.hits.max_score)
                } else {
                    partialMatch = [...cust.es.hits.hits]
                }
                myDocs.push({
                    real: newData,
                    partia: partialMatch[0]
                })

                console.log("partial match")

            }
            
        }

        if(myDocs.length>0){

            
            return res.status(300).json({
                msg:"successfully uploaded",
                docs:myDocs
            })
        }else{
            return res.status(200).json({
                msg: "successfully uploaded",
                
            })
        }
    }).on('error',(err)=>{
        console.log(err)
        return res.status(500).json({
            code:"ES500CSV",
            msg:"somthin went wrong at parsing csv",
            err:err.message
        })
    })

}

const addPartialRecords = async (req,res,next)=>{
    const {data} = req.body
    console.log(data)
    for (let i = 0; i < data.length; i++) {
        const newData = new CUSTOMER({
            name: data[i].name,
            email: data[i].email,
            phone1: data[i].phone1,
            phone2: data[i].phone2
        })

        const cust = new custo(newData)

        try {
            console.log("before search")
            await cust.search()
            console.log("after search")

            if(cust.isExact()){
                return res.status(500).json({
                    code:"ES500",
                    msg:"this recored is exist"
                })
            }
            
            await cust.indexing(()=> console.log("indexing"))
         
            await cust.saveTodataBase()
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                code:"ES500PR",
                msg:"there is erro check the backend",
                err:error.message
            })
        }
        
    }

    return res.status(200).json({
    code:"ES200PR",
    msg:"sccessflly added new records"
    })
    


}



module.exports = {
    addCustomer,
    addCsvCustomer,
    addPartialRecords
}