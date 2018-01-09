import {FETCH_STARTED, FETCH_SUCCESS, FETCH_FAILURE,Filter_Status,Set_Current_Page,SWITCH_OPERATE_PANEL,SAVE_VIEW_SIZE} from './actionTypes.js';

function pareseListData( data ){
    if( data === undefined || data === null){
        return data;
    }
    let newFamateData=[];
    Object.keys(data).map((key) =>{
        let wrapperData = [ data[key] ] ;
        wrapperData[0].operatePanelAwake = false;
        newFamateData.push( wrapperData )
    })
    return newFamateData;
}

export default (state = {status:'',filter:{},viewSize:{}} , action) =>{
    switch(action.type){
        case FETCH_STARTED:
          return {
            ...state,
              status:'loading'
            }
        case FETCH_SUCCESS:{
            return {
                ...state,
                status:'success',
                ...action.result,
                Data:pareseListData(action.result.Data ),
                filterData:action.result.Data,
            }
        }
        case FETCH_FAILURE:{
            return {
                ...state,
                status:'failure',
                error: action.error
            }
        }
        case SWITCH_OPERATE_PANEL:{
            const { id, isWake } = action;
            state.Data.map( (item,index) =>{
                if( index.toString() !== id ){
                    item[0].operatePanelAwake = false;
                }else{
                    item[0].operatePanelAwake = !!isWake ?  false : !item[0].operatePanelAwake ;
                }
                return null;
            })
            let newData = state.Data.slice(0);
             return{
                 ...state,
                 Data:newData
             }
        }
        case SAVE_VIEW_SIZE:{
            return{
                ...state,
                viewSize:{
                    ...state.viewSize,
                    ...action.option
                }
            }
        }
        case Filter_Status:{
            return{
                ...state,
            }
        }
        case Set_Current_Page:{
            return{
                ...state,
                currentPage:action.currentPage
            }
        }
        default:{
            return state;
        }
    }
}
