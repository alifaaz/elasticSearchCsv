const APP = require('./config/app')
const conn = require('./config/DB')
// const parser = csv({ headers: true })

// connection to database
conn()
.then(()=> console.log("contected succssfully"))
.catch(err => console.log(err))


/**
 * @multerPlanForHandlingFileUpload
 */

 
// END multer plan for handling csv








// app.post("/api/csvUpload",(req,res)=>{
//     let rejectedList=[];
//     let partiallyRejected=[];
//     let added = []
//     let count = []
//     csv.fromPath("./cust.csv",{headers:true})
//         .on('data',async row => {
//             const newCustomer = new CUSTOMERS({
//                 name: row.CustomerName,
//             email:row.Email,
//                 phone1: row.Phone1,
//                 phone2: row.Phone2
//     })
//             count.push(row)
// // exact match
//    await CUSTOMERS.search({
//         "bool": {
//             "must": [
//                 {
//                     "term": {
//                         "name.keyword": newCustomer.name
//                     }
//                 },
//                 {
//                     "term": {
//                         "email.keyword": newCustomer.email
//                     }
//                 },
//                 {
//                     "terms": {
//                         "phone1.keyword": [newCustomer.phone1,newCustomer.phone2]
//                     }
//                 },
//                 {
//                     "terms": {
//                         "phone2.keyword": [newCustomer.phone2, newCustomer.phone2]
//                     }
//                 }
//             ]

//         }
//     },async (err,data)=>{

//         if(err) console.log(err.message)

//        if(data.hits.total.value >0){
//            rejectedList.push(newCustomer)
           
//             console.log("exact match rejected #rejecte ahahahaah")

//         }else{
//          await  CUSTOMERS.search({
            //    "bool": {
            //        "should": [
            //            {
            //                "bool": {
            //                    "must": [
            //                        {
            //                            "term": {
            //                                "name.keyword": newCustomer.name
            //                            }
            //                        },
            //                        {
            //                            "term": {
            //                                "email.keyword": newCustomer.email
            //                            }
            //                        },
            //                        {
            //                            "terms": {
            //                                "phone2": [
            //                                    newCustomer.phone1,
            //                                    newCustomer.phone2
            //                                ]
            //                            }
            //                        },
            //                        {
            //                            "terms": {
            //                                "phone1": [
            //                                    newCustomer.phone1,
            //                                    newCustomer.phone2
            //                                ]
            //                            }
            //                        }
            //                    ]
            //                }
            //            },
            //            {
            //                "bool": {
            //                    "must": [
            //                        {
            //                            "term": {
            //                                "email.keyword": newCustomer.email
            //                            }
            //                        },
            //                        {
            //                            "bool": {
            //                                "should": [
            //                                    {
            //                                        "terms": {
            //                                            "phone1": [
            //                                                newCustomer.phone1,
            //                                                newCustomer.phone2
            //                                            ]
            //                                        }
            //                                    },
            //                                    {
            //                                        "terms": {
            //                                            "phone2": [
            //                                                newCustomer.phone1,
            //                                                newCustomer.phone2
            //                                            ]
            //                                        }
            //                                    }
            //                                ]
            //                            }
            //                        }
            //                    ]

            //                }
            //            },
            //            {
            //                "bool": {
            //                    "must": [
            //                        {
            //                            "fuzzy": {
            //                                "name.keyword": {
            //                                    "value":  newCustomer.name,
            //                                    "fuzziness": 2

            //                                }
            //                            }
            //                        }
            //                    ]
            //                }
            //            }
            //        ]
            //    }
//             }, async (err,data)=>{
//                 if(err) console.log(err)
//                 if(data.hits.total.value > 0){
//                     console.log("this recored is partial exist")
//                     partiallyRejected.push(newCustomer)
//                 }else{
//                     added.push(newCustomer)
//                     await newCustomer.index(()=>console.log("rec is indexed hahah"))
//                    await newCustomer.save()
//                 }
//                 // res.json({data})
//             })

//         }
//     })


// //     console.log(newDAta)
//             console.log(count.length)

//         }).on("end",()=>{
//             return res.json({
//                 rejects: rejectedList,
//                 partial: partiallyRejected,
//                 added
//             })
//         })


// //     const newCustomer = new CUSTOMERS({
// //         name:"aliffsdfsfaaz",
// //         email:"alifaazafsdfli@gmail.com",
// //         phone1:"077183fs13123",
// //         phone2:"0770dsfsf12181281"
// //     })

// // // exact match
// //     CUSTOMERS.search({
// //         "bool": {
// //             "must": [
// //                 {
// //                     "term": {
// //                         "name.keyword": newDAta.name
// //                     }
// //                 },
// //                 {
// //                     "term": {
// //                         "email.keyword": newDAta.email
// //                     }
// //                 },
// //                 {
// //                     "term": {
// //                         "phone1.keyword": newDAta.phone1
// //                     }
// //                 },
// //                 {
// //                     "term": {
// //                         "phone2.keyword": newDAta.phone2
// //                     }
// //                 }
// //             ]
           
// //         }
// //     },(err,data)=>{

// //         if(err) console.log(err.message)

// //        if(data.hits.total.value >0){

// //             console.log("exact match rejected #rejecte ahahahaah")

// //         }else{
// //            CUSTOMERS.search({
// //                "bool": {
// //                    "should": [
// //                        {
// //                            "bool": {
// //                                "must": [
// //                                    {
// //                                        "term": {
// //                                            "name.keyword": newCustomer.name
// //                                        }
// //                                    },
// //                                    {
// //                                        "term": {
// //                                            "email.keyword": newCustomer.email
// //                                        }
// //                                    },
// //                                    {
// //                                        "terms": {
// //                                            "phone2": [
// //                                                newCustomer.phone1,
// //                                                newCustomer.phone2
// //                                            ]
// //                                        }
// //                                    },
// //                                    {
// //                                        "terms": {
// //                                            "phone1": [
// //                                                newCustomer.phone1,
// //                                                newCustomer.phone2
// //                                            ]
// //                                        }
// //                                    }
// //                                ]
// //                            }
// //                        },
// //                        {
// //                            "bool": {
// //                                "must": [
// //                                    {
// //                                        "term": {
// //                                            "email.keyword": newCustomer.email
// //                                        }
// //                                    },
// //                                    {
// //                                        "bool": {
// //                                            "should": [
// //                                                {
// //                                                    "terms": {
// //                                                        "phone1": [
// //                                                            newCustomer.phone1,
// //                                                            newCustomer.phone2
// //                                                        ]
// //                                                    }
// //                                                },
// //                                                {
// //                                                    "terms": {
// //                                                        "phone2": [
// //                                                            newCustomer.phone1,
// //                                                            newCustomer.phone2
// //                                                        ]
// //                                                    }
// //                                                }
// //                                            ]
// //                                        }
// //                                    }
// //                                ]

// //                            }
// //                        },
// //                        {
// //                            "bool": {
// //                                "must": [
// //                                    {
// //                                        "fuzzy": {
// //                                            "name.keyword": {
// //                                                "value":  newCustomer.name,
// //                                                "fuzziness": 2

// //                                            }
// //                                        }
// //                                    }
// //                                ]
// //                            }
// //                        }
// //                    ]
// //                }
// //             },(err,data)=>{
// //                 if(err) console.log(err)
// //                 if(data.hits.total.value ==0){
// //                     newDAta.save().then(doo => {
// //                         newDAta.on('es-indexed', function (err, res) {
// //                             if (err) {console.log(err)};
// //                             /* Document is indexed */
// //                             console.log("document indexed succssfully")
// //                         });

// //                     }).catch(err=> console.log(err````))
// //                 }
// //                 res.json({data})
// //             })
           
// //         }
// //     })
// //     console.log(newDAta)


// })

APP.listen(3030,()=> console.log('http://localhost:3030/'))