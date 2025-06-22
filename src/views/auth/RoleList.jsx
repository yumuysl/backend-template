import React, { useState, useEffect } from "react"
import { Table, Modal, Button, message, Tree, Form, Input } from "antd"
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import axios from "axios";

import SearchAdd from "../../components/table/SearchAdd";

const { confirm } = Modal;


const pageStyle = {
  totalStyle:{
    width: '100%',
    height: '89vh',
    overflow: 'auto',
    padding: '20px',
    backgroundColor: '#ffffff'
  },
  tableStyle: {
    width: '100%',
    height: '100%',
    padding: '20px'
  },
  searchAddEara: {
    width: '100%',
    padding: '20px  0'
  }
}

export default function RoleList() {
  const [dataSourceList, setDataSourceList] = useState([])
  const [showEditPop, setShowEditPop] = useState(false)
  const [showAddPop, setShowAddPop] = useState(false)
  const [currentItem, setCurrentItem] = useState({})
  const [treeData, setTreeData] = useState([])
  const [expandedKeys, setExpandedKeys] = useState(['/user', '/role', '/auth']);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();


  const getListData = ()=>{
    axios('/roles').then((res)=>{
      console.log('获取角色列表数据：',res)
      setDataSourceList(res.data)
    }).catch((err)=>{
      console.log('获取角色数据失败：',err)
    })
  }
  useEffect(() => {
    getListData()
    setTreeData([
      {
        title: '首页',
        key: '/home',
        children: [],
      },
      {
        title: '用户管理',
        key: '/user',
        children: [
          {
            title: '查看列表',
            key: '/user/list',
          },
          {
            title: '添加用户',
            key: '/user/add',
          },
          {
            title: '编辑用户',
            key: '/user/edit',
          },
          {
            title: '删除用户',
            key: '/user/delete',
          }
        ]
      },
      {
        title: '角色管理',
        key: '/role',
        children: [
          {
            title: '查看列表',
            key: '/role/list',
          }, 
          {
            title: '添加角色',
            key: '/role/add', 
          },
          {
            title: '编辑角色',
            key: '/role/edit',
          },
          {
            title: '删除角色',
            key: '/role/delete',
          }
        ]
      },
      {
        title: '权限管理',
        key: '/auth',
        children: [
          {
            title: '查看列表',
            key: '/auth/list',
          }, 
          {
            title: '添加权限',
            key: '/auth/add', 
          },
          {
            title: '编辑权限',
            key: '/auth/edit',
          },
          {
            title: '删除权限',
            key: '/auth/delete',
          }
        ]
      }
    ])
  }, [])

  useEffect(()=>{
    setCurrentItem({
      ...currentItem,
      rights: [...checkedKeys]
    })
  }, [checkedKeys])

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
        let url = `/roles/${item.id}`
        console.log('删除url', url)
        axios.delete(url).then( res=>{
          setDataSourceList(dataSourceList.filter((x)=>x.id !== item.id))
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
  const openEditPop = (item) => {
    console.log('编辑条目', item)
    if(item){
      setShowEditPop(true)
      setCurrentItem(item)
      setCheckedKeys(item.rights)
    }else{
      setShowEditPop(false)
      setCurrentItem({})
    }
  }

  const keepEditItem = (item) => {
    console.log('保存编辑条目', item)
    axios.patch('/roles/' + item.id, item).then((res)=>{
      console.log('更新条目成功', res)
      setShowEditPop(false)
      messageApi.open({
        type:'success',
        content: '更新成功',
        duration: 2,
      })
      getListData()
      setCurrentItem({})
    }).catch((err)=>{
      console.log('更新条目失败', err)
      messageApi.open({
        type: 'error',
        content: '更新条目失败',
        duration: 2,
      })
    })
  }

  //添加
  const openAddPop = () => {
    setCurrentItem({
      roleName: '',
      roleDesc: '',
      rights: []
    })
    setCheckedKeys([])
    setShowAddPop(true)
  }

  const cancleAddPop = () => {
    setShowAddPop(false)
    setCurrentItem({})
  }

  const keepEAddItem = () => {
    console.log("打印checkKeys", checkedKeys)
    console.log("打印更新前currentItem", currentItem)

    axios.post('/roles', currentItem).then((res)=>{
      console.log('添加条目成功', res)
      setShowAddPop(false)
      
      messageApi.open({
        type:'success',
        content: '添加成功',
        duration: 2,
        })
      getListData()
      setTimeout(()=>{
        console.log('清除churrentItem')
        setCurrentItem({})
        clearTimeout()
      }, 200)
      
    }).catch((err)=>{
      console.log('添加条目失败', err)
      messageApi.open({
        type: 'error',
        content: '添加条目失败',
        duration: 2,
      })
    })
  }

  //搜索过滤
  const handleSearch = (key, value) => {
    console.log('搜索', key, value)
    axios.get('/roles?' + key + '=' + value).then((res)=>{
      console.log('搜索成功', res)
      setDataSourceList(res.data)
    }).catch((err)=>{
      console.log('搜索失败', err)
    })
  }
  
  const filtersList = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      type: 'input',
      handle: (value)=>{
        handleSearch('id', value) 
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      type: 'input',
      handle: (value)=>{
        handleSearch('roleName', value)
      }
    }
  ]

  //列表设置
  const columnsList = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      sorter: (a, b) => a.id - b.id
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      key: 'roleDesc',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: ( _, item) =>{
        return (
          <>
            <Button color="primary" shape="circle" variant='dashed' icon={<EditOutlined />} onClick={()=>openEditPop(item)}></Button>
            <Button color="danger" shape="circle" variant='dashed' icon={<DeleteOutlined />} onClick={()=>showConfirm(item)}></Button>
          </>
        )
      }
    }
  ]

  //角色权限处理
  const onExpand = (expandedKeysValue) => {
    console.log('onExpand', expandedKeysValue)
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  }

  const onCheck = (checkedKeysValue)=>{
    console.log('onCheck', checkedKeysValue)
    setCheckedKeys(checkedKeysValue);
  }

  const onSelect = (selectedKeysValue, info)=>{
    console.log('onSelect', info)
    setSelectedKeys(selectedKeysValue);
  }

  return (
    <div style={pageStyle.totalStyle}>
      {contextHolder}
      <div style={pageStyle.searchAddEara}>
        <SearchAdd openAddPop={openAddPop} filtersList={filtersList}></SearchAdd>
      </div>
      <Table
        columns={ columnsList }
        dataSource={ dataSourceList }
        rowKey={ record => record.id }
        scroll={{
          x: 'max-content',
          y: 55 * 5,
        }}
      ></Table>
      <Modal
        title="编辑"  open={showEditPop} 
        onOk={()=>keepEditItem(currentItem)}  onCancel={()=>openEditPop()}
        okText="保存" cancelText="取消"
        width={500}   centered
      >
        <Tree
          checkable
          onExpand={onExpand}
          onCheck={onCheck}
          checkedKeys={checkedKeys}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          onSelect={onSelect}
          selectedKeys={selectedKeys}
          treeData={treeData}
        />
      </Modal>
      <Modal
        title="添加角色"  open={showAddPop} 
        onOk={()=>keepEAddItem()}  onCancel={()=>cancleAddPop()}
        okText="保存" cancelText="取消"
        width={500}   centered
      >  
        <Form form={form}  layout="Vertica" initialValues={{ layout: 'Vertical'}}  labelCol={{span:4}} labelAlign="left" style={{margin: '20px 0'}}
        >
          <Form.Item label="角色名称" required>
            <Input
              placeholder="请输入角色名称"
              value={currentItem.roleName}
              onChange={(e)=>setCurrentItem({...currentItem, roleName: e.target.value})}
            />
          </Form.Item>
          <Form.Item label="角色描述" required>
            <Input
              placeholder="请输入角色描述"
              value={currentItem.roleDesc}
              onChange={(e)=>setCurrentItem({...currentItem, roleDesc: e.target.value})}
            />
          </Form.Item>
          <Form.Item label="权限" required>
            <Tree
              checkable
              onExpand={onExpand}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeData}
            />
          </Form.Item>
        </Form>

      </Modal>
    </div>
  )

}