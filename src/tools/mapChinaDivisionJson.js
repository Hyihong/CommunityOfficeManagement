import { isArray } from './baseTools'
// 深度遍历中国省市区数据
export class mapChinaDivisionJson {
    constructor( data ) {
        this._options = []
        this.doMap( data ,this._options );
        return this._options ;
    }

    // ***
    // param d : 数据[Array,Object]
    // param opt : 挂载节点
    // *** 
    doMap( d , opt ){ 
        //pure object => have childrenNode
        if(  !isArray( d ) ){
                   let _isAlone = Object.keys( d ).length === 1;
                   //console.log( "是否只有一个子节点",_isAlone )
                   if( !_isAlone){
                        Object.keys( d ).map( item => {
                                return opt.push({
                                    value:item,
                                    label:item,
                                    children: [],
                                    isLeaf: false
                                })
                        })
                    }else{
                        this.doMap( d[ Object.keys(d)[0]] , opt  )
                        return ;
                    }

                    
                    Object.keys( opt ).map( item =>{
                            return this.doMap( d[ opt[item].value ] , opt[item].children  )
                    })

        }else{
              Object.keys( d ).map( item => (
                      opt.push({
                          value:d[item],
                          label:d[item],
                          isLeaf: true
                      })
             ))
        }
    }
}