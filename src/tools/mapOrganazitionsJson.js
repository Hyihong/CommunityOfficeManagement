import { isArray } from './baseTools'

// 深度遍历组织机构JSON数据
export default class mapOrganazitionsJson {
    constructor( data,isForMobile ) {
        this._options = []
        this.doMap( data ,this._options );
        //解决移动版无法选择非叶子选项的问题
        if(isForMobile === 'mobile' && true) {
            this._options[0].children.unshift({label:"",value:""});
            this._options[0].children.map( item =>{
                if( item.children !== undefined ){
                     item.children.unshift({label:"",value:""})
                }
                return null;
            })
        }
        return this._options ;
    }

    // ***
    // param d : 数据[Array,Object]
    // param opt : 挂载节点
    // *** 
    doMap( d , opt ){ 
        if(  isArray( d ) ){
             Object.keys( d ).map( item => {
                    
                    if( d[item].ChildOrganizations.length > 0 ){
                        opt.push({　
                            value:d[item].id,
                            label:d[item].name,
                            children:[],
                        })
                        this.doMap( d[item].ChildOrganizations, opt[item].children )
                    }else{
                        opt.push({
                            value:d[item].id,
                            label:d[item].name,
                        })
                    }  

                    return null ;                 
             })
        }else{
            new Error ("数据出错")
        }
    }
}