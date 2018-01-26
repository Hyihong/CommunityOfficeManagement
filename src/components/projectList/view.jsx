
import React from 'react';
import { connect } from 'react-redux';
import { withRouter,Link } from 'react-router-dom'
import { fetchAllProjects,setCurrentPage } from './actions'
import { Card,Row,Col,Spin,Form,Pagination,Tooltip  } from 'antd';
import QueueAnim from 'rc-queue-anim';
import { view as Organizations,actions as OrzActions } from '../organizations'
import { Error,Return} from '../shared'
import './style.less'
import {setPlaceholder} from '../../tools/baseTools'
const Item = Form.Item;
const  { fetchORZsWithProject,setOrzWithProjectSelected } = OrzActions ;


class List extends React.Component {
    componentDidMount(){
        document.title="项目列表";
        if( !this.props.data){
            this.props.fetchAllProjects();//获取项目列表
        }
        if( !this.props.orzWithProject.Data){
            this.props.fetchORZsWithProject() //获取项目所属组织机构
        }
        if( this.props.history.action.toLowerCase() === 'push'){
            this.props.setCurrentPage(1)
            this.props.setOrzWithProjectSelected( [] )
        }
        setPlaceholder()
    }

    handleOrganizationChange = ( value, selectedOptions ) =>{
        this.props.setOrzWithProjectSelected( value )
        this.props.setCurrentPage(1)
    }

    paginationChange =(page, pageSize) =>{
        this.props.setCurrentPage(page)
    }


    onOrganizationDisplayRender = (label, selectedOptions) =>{
        return label.join("/")
    }
    render(){
        //filterData：据筛选条件所展示的数据
        //data : 原始数据，用于数据检索
        let { status ,data,currentPage } = this.props;
        let renderContent;
        let filterData ;
        let pageData  ;
        if(status === 'success'){
            if( data ){
                //根据筛选ID: 筛选所得数据
                const selectOrzID =  ( () => {
                    const arr = this.props.orzWithProject.selectArr ;
                    if( arr === undefined){
                        return undefined;
                    }else{
                        return arr[arr.length -1 ]
                    }
                })()


                //全部显示
                if(  selectOrzID === 'all' || selectOrzID === undefined){
                    filterData = [...data]
                }else{
                    filterData = data.filter( item =>  item.OrganizationID  ===  selectOrzID)
                }

                //当前页显示数据
                if( filterData.length > 0 ){
                    pageData = filterData.slice( (4*currentPage -4 ),4*currentPage )
                    renderContent = (
                        <Row type="flex" className="lee-project-list">
                            {
                                pageData.map( (item,i) => {
                                    return(
                                        <Col lg={12} md={12} sm={12} xs={24} key={item.ID}>
                                            <QueueAnim type="scaleX" duration={[600,0]} >
                                                <div key={{i}}>
                                                    <Card  className= {item.Status ? "audited" :"auditing" } noHovering={true}
                                                           bodyStyle={{ padding: 0 }} style={{height:"252px"}}>
                                                        <Col lg={{span:10}} md={9} sm={1} xs={9}>{
                                                            item.Status ? <div className="tag" ></div> : <div
                                                                className="tag"></div>
                                                        }
                                                        </Col>
                                                        <Col lg={{span:14}} md={15} sm={24} xs={15} style={{height:"266px"}}>
                                                            <div>
                                                                <Tooltip placement="topLeft" title={item.Name}>
                                                                    <div className="project-name">
                                                                        <span></span><b>{item.Name}</b>
                                                                    </div>
                                                                </Tooltip>
                                                                <ul className="info">
                                                                    <li><b>ID:</b><span>{ item.ID }</span></li>
                                                                    <li><b>负责人:</b><span>{ item.Master }</span></li>
                                                                    <li><b>联系人:</b><span>{item.Contactor}</span></li>
                                                                    <li> <b>联系方式:</b><span>{item.Contact}</span></li>
                                                                    <li> <b>项目地址:</b><span>{item.Address || "暂无数据"}</span></li>
                                                                    <li><b>设备数量:</b><span>{item.DeviceCount}</span></li>
                                                                </ul>
                                                                 <div className="operate">

                                                            {item.Status ?
                                                                <Row type="flex">
                                                                    <Col span={8}>
                                                                        <div className="import">
                                                                            <Link to={{
                                                                                pathname:"/home/project/import",
                                                                                search: `?id=${item.ID}`,
                                                                            }}>
                                                                                <p>导入数据</p>
                                                                            </Link>
                                                                        </div>
                                                                    </Col>
                                                                    <Col span={8}>
                                                                        <div className="building">
                                                                            <Link to={{
                                                                                pathname:"/home/project/building",
                                                                                search: `?id=${item.ID}`,
                                                                            }}>
                                                                                <p>楼栋管理</p>
                                                                            </Link>
                                                                        </div>
                                                                    </Col>
                                                                    <Col span={8}>
                                                                        <div className="detail">
                                                                            <Link to={{
                                                                                pathname:"/home/project/detail",
                                                                                search: `?id=${item.ID}`,
                                                                            }}>
                                                                                <p>详细信息</p>
                                                                            </Link>
                                                                        </div>
                                                                    </Col>
                                                                </Row>:
                                                                <Row type="flex">
                                                                    <Col span={24}>
                                                                        <div className="modify">
                                                                            <Link to={{
                                                                                pathname:"/home/apply/modify",
                                                                                search: `?id=${item.ID}`,
                                                                            }}>
                                                                                <p>修改申请信息</p>
                                                                            </Link>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            }
                                                        </div>
                                                            </div>
                                                        </Col>
                                                    </Card>
                                                </div>
                                            </QueueAnim>
                                        </Col>

                                    )
                                })
                            }
                            <div style={{clear:"both"}}></div>
                            <div style={{width:"100%",textAlign:"center"}}>
                                {
                                    filterData.length > 4 ?  <Pagination
                                        defaultCurrent={1} defaultPageSize={4} total={filterData.length}
                                        onChange = { this.paginationChange}
                                        current = { currentPage }
                                    ></Pagination> : null
                                }

                            </div>

                        </Row> )
                }else{
                    renderContent = (<div style={{marginLeft:"20%",marginTop:"180px",color:"red"}}>该组织机构下还没有项目!</div>)
                }
            }else{
                renderContent = ( <div style={{width:"100%","textAlign":"center"}}>目前您还没有项目,您可以去 <Link to="/home/apply">申请项目>></Link></div>)
            }
        }else if( status === 'failure'){
            renderContent=( <Error onClick={ () => this.props.fetchAllProjects()}/> )
        }

        return (
            <div>
                <Return>项目列表</Return>
                {/* select section */}
                <div className="lee-filter">
                    <Row type="flex" justify="center" >
                        <Col lg={{span:9}} md={{span:10}} sm={{span:11}} xs={{span:18}} >
                            <Form>
                                <Item label="组织机构：" labelCol={{ lg:{span:4}, md:{span:5} , sm:{span:5} ,xs:{span:5} } }
                                      wrapperCol={{ lg:{span:20}, md:{span:19} , sm:{span:19},xs:{span:19} } }>
                                    <Organizations
                                        allOption={true}  //增加[全部]选项
                                        onChange={this.handleOrganizationChange}
                                        orzOptions = { !!this.props.orzWithProject.Data ? JSON.parse(this.props.orzWithProject.Data ):[]}
                                        status = { this.props.orzWithProject.status}
                                        value={ this.props.orzWithProject.selectArr}
                                    ></Organizations>
                                </Item>
                            </Form>
                        </Col>
                    </Row>
                </div>

                {/* list section */}
                <Spin size="large"  tip="正在加载项目数据 ..." spinning={ status === "loading" } wrapperClassName="">
                    {/* status === "loading" */}
                    {
                        renderContent
                    }

                </Spin>

            </div>
        );
    }
};



const mapStateToProps = (state) => {
    const projects = state.projectList;
    const organizations = state.organizations;
    return{
        status: projects.status,
        data: projects.Data,
        currentPage:projects.currentPage,
        orzWithProject:organizations.orzWithProject
    }
}
const mapDispatchToProps = (dispatch) => ({
    fetchAllProjects: () => {
        dispatch( fetchAllProjects());
    },
    fetchORZsWithProject:() =>{
        dispatch( fetchORZsWithProject());
    },
    setCurrentPage:(p) =>{
        dispatch( setCurrentPage(p));
    },
    setOrzWithProjectSelected :( arr) =>{
        dispatch( setOrzWithProjectSelected(arr));
    }
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(List));
