const CUSTOMER = require("./cust.model")
const custo = require('./customer')
const csv = require('fast-csv')
const fs = require('fs')




// contorller to add single user to database
const addCustomer = async (req,res,next) => {

    // extract data from the body
    const {data,addPartialyHappen} = req.body
    const newData = new CUSTOMER({
        name:data.name,
        email:data.email,
        phone1:data.phone1,
        phone2:data.phone2
    })
    // array to hold partial match
    let docs=[];
    


    // costumer initate 
    const cust = new custo(newData)
   
    // customer search agnist the search engine
    await cust.search()
   

    // cheack the status of search
    
    if (cust.isNone()){
        // in case of none customer
        console.log("there is no recored")
        try {

            await cust.saveTodataBase()
            await cust.indexing()
            // success status for insert and index
            return res.status(200).json({ 
                    code:"ES200",
                     msg:"successfully added"
                    })
        } catch (error) {
            // error handling
            return res.status(500).json({
                msg:"somthin went wrong",
                code:"ES500",
                err:error.message
            })
        }

    } else if (cust.isExact()){
        // in case of exact customer
        console.log("exact match thu will not inserted to database")

        // return 400 response for exact match
        return res.status(400).json({
            "msg": "user is alredy existied and exatly match ",
            "code":"Es400"
        })
    } else if(cust.isPartial()){

        // in case of partial 

        console.log(cust.es.hits.hits)
        // check the result  want to choose the best score witch match with max score
            if (cust.es.hits.total.value > 1){
                docs = cust.es.hits.hits.filter(val => val._score == cust.es.hits.max_score )
        }else{
                docs = [...cust.es.hits.hits]
        }

        console.log("partial match")
        // return response with 300 error and data beacuase thereis more job to do 
        return res.status(300).json({
            code:"ES300",
            msg:"partial happen",
            docs:[docs[0]]
        })
    }
    

   
  
}



// handling csv file
const addCsvCustomer = async (req,res,next) =>{
    
    // exstract file from file came form multer
    const file = req.file
    let partialMatch =[]
    let myDocs=[]
    let data=[]

    // parsing csv files
    csv.parseFile(file.path,{headers:true})
    .on('data',function(dat){
        // reading csv record
        data.push(dat)
    })
    .on('end',async ()=>{
        // delete the file from the server after reading the content
        fs.unlinkSync(file.path)
        
        // looping through the record
        for (let i = 0; i < data.length; i++) {

            // checking the right csv file is uploaddeed
            if (data[i].CustomerName == undefined || data[i].Email == undefined || data[i].Phone1 == undefined ){
                return res.status(500).json({
                    code:"ES500CSV",
                    msg:"csv not valida collumn",
                    
                })
            }
            // init customer model object
            const newData = new CUSTOMER({
                name: data[i].CustomerName,
                email: data[i].Email,
                phone1: data[i].Phone1,
                phone2: data[i].Phone2
            })

            const cust = new custo(newData)
            try {
                
                // search agnist es search engine
                await cust.search()
                
            } catch (error) {
                console.log(error)

                // handling error
                return res.status(500).json({
                    code:"ES500ES",
                    msg:"somthinwent wrong at elasticsearch engin call the developer"
                })
            }

            if (cust.isNone()) {

                console.log("there is no recored")
                try {
                    console.log("added new recored to database & indexing")
                    // reading indexing status
                   let status = await cust.indexing()
                   if(status){
                       console.log("before database ")
                       // inserting to database after indexing
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
                
                // handling partial match

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

            // checking wether ther is partial match
            
            return res.status(300).json({
                msg:"successfully uploaded",
                docs:myDocs
            })
        }else{
            // return success status after all done and no partial match
            return res.status(200).json({
                msg: "successfully uploaded",
                
            })
        }
    }).on('error',(err)=>{
        console.log(err)

        // handling error 
        return res.status(500).json({
            code:"ES500CSV",
            msg:"somthin went wrong at parsing csv",
            err:err.message
        })
    })

}


// add partial record to database
const addPartialRecords = async (req,res,next)=>{
    // extract data from body request
    const {data} = req.body


    // arary will be proccee here 
    for (let i = 0; i < data.length; i++) {
        // init customer model object
        const newData = new CUSTOMER({
            name: data[i].name,
            email: data[i].email,
            phone1: data[i].phone1,
            phone2: data[i].phone2
        })

        
        const cust = new custo(newData)

        try {
            // searching aginst es search engin to get rid of exactly match
            await cust.search()
            

            if(cust.isExact()){
                // no exact record will added
                return res.status(500).json({
                    code:"ES500",
                    msg:"this recored is exist"
                })
            }
            

            // indexing 
            await cust.indexing(()=> console.log("indexing"))
         

            // store to database
            await cust.saveTodataBase()
            
        } catch (error) {
            console.log(error)

            //error handling
            return res.status(500).json({
                code:"ES500PR",
                msg:"there is erro check the backend",
                err:error.message
            })
        }
        
    }

    // return succesfully records
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