// base - Product.find()
// bigQ - //search=coder&page=2&category&=shortsleeves&rating[gte]=4&price[lte]=999&price[gte]=199


class WhereClause{
    constructor(base,bigQ){
        this.base = base;
        this.bigQ = bigQ
    }

    search(){
        const searchword = this.bigQ.search ? {
            name: {
                $regex: this.bigQ.search,
                $option: 'i'
            }
        } : {};

        this.base = this.base.find({...searchword})
        return this
    }

    pager(resultperPage){
        let currentPage = 1;
        if(this.bigQ.page){
            currentPage = this.bigQ.page
        }

        const skipVal = resultperPage * (currentPage - 1)

        this.base = this.base.limit(resultperPage).skip(skipVal)
        return this;

    }

    filter(){
        const copyBigQ = {...this.bigQ}

        delete copyBigQ["search"]
        delete copyBigQ["limit"]
        delete copyBigQ["page"]

        let strCopyBigQ = JSON.stringify(copyBigQ)

        strCopyBigQ = strCopyBigQ.replace(/\b(gte|lte|gt|lt)\b/g, m => `$${m}`)
       const jsonCopyBigQ = JSON.parse(strCopyBigQ)

       this.base = this.base.find(jsonCopyBigQ)
       return this

    }


}

module.exports = WhereClause