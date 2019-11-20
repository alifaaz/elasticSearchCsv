const CUSTOMER = require('./cust.model')
module.exports=class customemr{
    constructor(data, addPartialyHappen = false, partial = false, exact = false,none=false){
        this.data=data
        this.name=data.name
        this.email=data.email
        this.phone1=data.phone1
        this.phone2=data.phone2
        this.partial = partial
        this.exact = exact
        this.none = none
        this.error=null
        this.indexed= false
        this.addPartialyHappen = addPartialyHappen
        this.dataBaseResult=null
        this.es=null
    }


    async saveTodataBase(){

        try {

            let result = await this.data.save()

            if (result) {
                console.log(result)
                this.dataBaseResult=result
            }
        } catch (error) {
            console.log(error)
            this.error=error
            throw error

        }
    }

    async indexing(){
        try {
            await this.data.mIndexing(() => console.log("indexing"))
            this.indexed=true
        } catch (err) {
            console.log(err)
           this.error=err
           throw err
        }
        return;

    }
    async search(){
        try {
            
            const es = await CUSTOMER.exactOrPartial(this.data)
            this.es = es
            // console.log(this.hits)
            if (!es.hits.max_score || this.addPartialyHappen) {
    
                    this.none=true
    
    
            } else if (es.hits.max_score > 10) {
    
                console.log("exact match thu will not inserted to database")
                this.exact=true
                
            } else {
                console.log("Partial shit to database")
    
                this.partial=true
               
    
            }
        } catch (error) {
                console.log(error)
                throw error
        }
        // return;

    }

    isNone(){
        return this.none
    }

    isExact(){
       return  this.exact
    }

    isPartial(){
        return this.partial
    }
}