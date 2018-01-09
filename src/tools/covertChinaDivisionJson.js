//转化三级城市数据为二级数据
const fs = require('fs');
fs.readFile('../DB/address3.json', {encoding:'utf8'},(err, data) => {
    if (err) throw err;
    //covert data
    fs.writeFile('./省份数据.json', JSON.stringify( covert( JSON.parse(data) ) ), (err) => {
        if (err) throw err;
        //JSON.parse(data)
        console.log("done!")
        
      });
  });

  function covert( data ){
        let targetO ={};
        Object.keys(data).map( item_1 =>{
            let _o={};
            _o[item_1]=[];
            if( Object.keys(data[item_1]).length > 1 ){
                Object.keys(data[item_1]).map( item_2=>{
                    _o[item_1].push(item_2)
                })
            }else{
                //_o[item_1] = data[item_1]
                _o[item_1] = data[item_1]['市辖区'] ;
            }
            Object.assign(targetO,_o);
        })
        return targetO;
  }