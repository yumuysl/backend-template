import React, {useState, useEffect} from "react";
import { Table, Tag, Button, Flex, Modal, message, Input } from "antd";
import { EditFilled, DeleteFilled, ExclamationCircleFilled } from '@ant-design/icons';
import axios from "axios";

const { confirm } = Modal;
const { TextArea } = Input;

const pageStyle = {
  totalStyle: {
    width: '100%',
    height: '89vh',
    color: '#000',
    backgroundColor: '#fff',
    overflow: 'auto'
  },
  inputStyle:{
    margin: '10px 0',
  }
}


export default function AuthList() {
  const [showEditPop, setShowEditPop] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();
  const [currentItem, setCurrentItem] = useState({})
  const [dataSource, setDataSource] = useState([])

  useEffect(()=>{
    axios.get("/auth-list").then((res)=>{
      console.log("获取数据", res.data);
      setDataSource(res.data)
    })
  }, [])

  //删除
  const showConfirm = (item) => {
    confirm({
      title: '确认删除该条目?',
      icon: <ExclamationCircleFilled />,
      content: '删除后不可恢复',
      okText: '确认删除',
      cancelText: '取消',
      centered: true,
      onOk() {
        console.log('删除条目', item)
        let url = `/auth-list/${item.id}`
        console.log('删除url', url)
        axios.delete(url).then( res=>{
          setDataSource(dataSource.filter((x)=>x.id !== item.id))
          messageApi.open({
            type: 'success',
            content: '删除成功',
            duration: 2, 
          })
        }).catch( err=>{
          console.log('删除失败', err.message)
          messageApi.open({
            type:'error',
            content: '删除失败',
            duration: 2,
          }) 
        })
      },
      onCancel() {
        console.log('取消');
      },
    });
  };
  
  //编辑
  const editPop = (item) => {
    console.log('编辑条目', item)
    if(item){
      setShowEditPop(true)
      setCurrentItem(item)
    }else{
      setShowEditPop(false)
      setCurrentItem({})
    }
  }

  function keepEditItem(item){
    console.log('保存编辑条目', item)
    try{
      //其他业务代码
      axios.patch( '/auth-list/' + item.id, item).then((res)=>{
        console.log("更新数据", res.data);
        setDataSource(dataSource.map((x)=>{
          if(x.id === item.id){
            return item
          }
          return x
        }))
        //关闭弹窗并提示
        setShowEditPop(false)
        setCurrentItem({})
        messageApi.open({
          type:'success',
          content: '保存成功',
          duration: 2,
        })
      }).catch((err)=>{
        console.log("保存失败失败", err);
        messageApi.open({
          type:'error',
          content: '保存失败',
          duration: 2,
        })
      })

    }catch(e){
      console.log('保存失败', e)
      messageApi.open({
        type:'error',
        content: '保存失败',
        duration: 2,
      })
    }
  }

  function handleInputChange(key, e){
    console.log('currentItem', key, e)
    setCurrentItem({
      ...currentItem,
      [key]: e.target.value
    })
  }
  

  //表格数据
  const columns = [
    {
      title: 'ID',
      width: '40px',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      fixed: 'left',
      render: (id)=>{
        return <b>{id}</b>
      }
    }, 
    {
      title: '权限名称',
      width: '120px',
      dataIndex: 'authName',
      key: 'authName',
    },
    {
      title: '权限路径',
      width: '120px',
      dataIndex: 'authPath',
      key: 'authPath',
      render: (authPath)=>{
        return (<Tag color="red">{authPath}</Tag> )
      }
    },
    {
      title: '权限描述',
      width: '120px',
      dataIndex: 'authDesc',
      key: 'authDesc',
    },
    {
      title: '操作',
      width: '120px',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      render: ( _, item) => {
        return (
          <Flex gap="small">
            <Button color="primary" variant="outlined" shape="circle" icon={<EditFilled />} onClick={()=>editPop(item)} />
            <Button color="danger" shape="circle" variant="outlined" icon={<DeleteFilled />}  onClick={()=>showConfirm(item)} />
          </Flex>
        )
      },
    }
  ]

  return (
    <div>
      {contextHolder}
      <Table 
        rowKey={(record)=>record.id}
        style={pageStyle.totalStyle}
        columns={columns}
        dataSource={dataSource}
      />
      <Modal 
        title="编辑"  open={showEditPop} 
        onOk={()=>keepEditItem(currentItem)}  onCancel={()=>editPop()}
        okText="确认修改" cancelText="取消"
        width={400}   centered
      >
        <div style={pageStyle.inputStyle}>
          <Input placeholder="请输入权限名称" allowClear onChange={(e)=>handleInputChange('authName',e)} value={currentItem.authName} />
        </div>
        <div style={pageStyle.inputStyle}>
          <Input placeholder="请输入权限路径" allowClear onChange={(e)=>handleInputChange('authPath',e)} value={currentItem.authPath} />
        </div>
        <div style={pageStyle.inputStyle}>
          <TextArea placeholder="请输入权限描述" allowClear onChange={(e)=>handleInputChange('authDesc',e)} value={currentItem.authDesc} />
        </div>
      </Modal>
    </div>
  )

}