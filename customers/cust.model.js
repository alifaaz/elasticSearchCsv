
// mongoose ORM for mongodb database
const mongoose = require("mongoose");


// comongstic plugin to connect mongoose with elasticsearch
const mongoosastic = require('mongoosastic')


/**
 * @name -----    customername
 * 
 * @email custometer email 
 * 
 * @phones {Arrays of phones}
 */
// CustomerName, Email, Phone1, Phone2
// schema for mapping my data
const custschema = new mongoose.Schema({
        name   : { type: String, es_type: "keyword", es_indexed: true},
        email  : { type: String, es_type: "keyword", es_indexed: true},
        phone1 : { type: String, es_type: "keyword", es_indexed: true},
        phone2 : { type: String, es_type: "keyword", es_indexed: true}
})


custschema.statics.exactOrPartial = function exactSearch(thisData){
    const thisCoco = this
    return new Promise((resolve,reject) => {
        thisCoco.search({
            "bool": {
                "should": [
                    {
                        "bool": {
                            "boost": 10,
                            "must": [
                                {
                                    "term":{
                                        "name.keyword":thisData.name
                                    }
                                },
                                {
                                    "term": {
                                        "email.keyword": thisData.email
                                    }
                                },
                                {
                                    "terms": {
                                        "phone1.keyword": [thisData.phone1, thisData.phone2]
                                    }
                                },
                                {
                                    "terms": {
                                        "phone2.keyword": [thisData.phone1, thisData.phone2]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "bool": {
                            "should": [
                                {
                                    "bool": {
                                        "must": [
                                            {
                                                "match": {
                                                    "name": {
                                                        "query": thisData.name,
                                                        "operator": "and",
                                                        "fuzziness": 0,
                                                        "fuzzy_transpositions": "false",
                                                        "auto_generate_synonyms_phrase_query": "false"
                                                    }
                                                }
                                            },
                                            {
                                                "term": {
                                                    "email.keyword": thisData.email
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "bool": {
                                        "must": [
                                            {
                                                "term": {
                                                    "email.keyword":thisData.email
                                                }
                                            },
                                            {
                                                "bool": {
                                                    "should": [
                                                        {
                                                            "terms": {
                                                                "phone1": [thisData.phone1, thisData.phone2]
                                                            }
                                                        },
                                                        {
                                                            "terms": {
                                                                "phone2": [thisData.phone1, thisData.phone2]
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]

                                    }
                                },
                                {
                                    "bool": {
                                        "must": [
                                            {
                                                "match": {
                                                    "name": {
                                                        "query": thisData.name,
                                                        "operator": "and",
                                                        "fuzziness": 1,
                                                        "fuzzy_transpositions": "false",
                                                        "auto_generate_synonyms_phrase_query": "false"
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ],
                "boost": 0.10000
            }
        
            }, function(err,data){
                if(err){
                    reject(err)
                }else{
                    resolve(data)
                }
            })
    })
    

}   

custschema.methods.mIndexing = function mIndexing(cb){
    const thisCoco = this
    return new Promise((resolve, reject) => {
        this.index((err,data)=>{
            if(err){
                reject(err)
            }else{
                cb()
                resolve(data)
            }
        })
    })

}
custschema.plugin(mongoosastic,{
    hosts:[
        "localhost:9200",
        "127.0.0.1:9200",
    ],
    indexAutomatically:false
})




module.exports = mongoose.model('customer', custschema)