import { useState, useEffect } from 'react'
import {
  ConfigProvider,
  Table,
  Dropdown,
  Modal,
  Form,
  message,
  Input,
  Select,
} from 'antd'
import { DownOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import zhCN from 'antd/locale/zh_CN'
import axios from 'axios'

import SearchAdd from '../../components/table/SearchAdd'
import { useCallback } from 'react'

const { confirm } = Modal

const pageStyle = {
  totalStyle: {
    width: '100%',
    height: '89vh',

    color: '#000',
    backgroundColor: '#fff',
    overflow: 'auto',
  },
  tableStyle: {
    padding: '0 8px',
    textAlign: 'center',
    fontSize: '10px',
  },
  allButtonStyle: {
    width: '100%',
    height: '80px',
    padding: '20px 8px',
  },
}

//ID、标题、作者、标签、内容、创建时间、更新时间、操作
const menuItems = [
  {
    label: '编辑',
    key: 'editItem',
  },
]

export default function NoteList() {
  const [noteList, setUserList] = useState([])
  const [currentItem, setCurrentItem] = useState({})
  const [editPopFlag, setEditPopFlag] = useState(false)
  const [roleList, setRoleList] = useState([]) //TODO:待替换或删除
  const [addPopFlag, setAddPopFlag] = useState(false)
  const [filters, setFilters] = useState({
    username: '',
    roleId: '',
    status: '',
    email: '',
  })
  const [pagination, setPagination] = useState({
    offset: 1,
    limit: 10,
    total: 0,
    showQuickJumper: false,
  })
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm()

  const getListData = useCallback(() => {
    console.log('过滤筛选', filters)
    //过滤筛选
    let params = ''
    for (let key in filters) {
      if (filters[key]) {
        params += '&' + key + '=' + filters[key]
      }
    }

    let url = `/admin/notes?currentPage=${pagination.offset}&limit=${pagination.limit}+${params}`
    axios
      .get(url)
      .then((res) => {
        let resData = res.data
        console.log('列表：', resData)
        console.log('分页：', pagination)
        setUserList(resData.data.data)
        if (resData.data.total !== pagination.total) {
          setPagination({
            ...pagination,
            offset: resData.data.currentPage,
            total: resData.data.total,
            showQuickJumper:
              parseInt(resData.data.total / pagination.limit) + 1 > 5
                ? true
                : false,
          })
        }
      })
      .catch((err) => {
        console.log('笔记数据异常，原因：', err)
      })
  }, [filters, pagination])

  //TODO:待替换或删除
  const getRoleList = useCallback(() => {
    axios
      .get('/admin/roles')
      .then((res) => {
        console.log('角色数据', res.data)
        setRoleList(res.data.data.data)
      })
      .catch((err) => {
        console.log('数据获取失败', err)
      })
  }, [])

  useEffect(() => {
    Promise.all([getListData(), getRoleList()])
      .then((res) => {
        console.log('获取数据成功', res)
      })
      .catch((err) => {
        console.log('获取数据失败', err)
      })
  }, [getListData, getRoleList])

  const columns = [
    {
      title: 'ID',
      width: '40px',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      fixed: 'left',
    },
    {
      title: '标题',
      width: '100px',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '作者',
      width: '100px',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '标签',
      width: '100px',
      dataIndex: 'to_tag',
      key: 'to_tag',
      render: (tag) => {
        return tag //TODO:暂定，需要根据字段完成背景颜色和内容
      },
    },
    {
      title: '内容',
      width: '100px',
      dataIndex: 'content',
      key: 'content',
      render: (role) => {
        //FIX:点击查看内容
        return role ? role.name : ''
      },
    },
    {
      title: '创建时间',
      width: '100px',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (time) => {
        return time.replace('T', ' ').slice(0, 19)
      },
    },
    {
      title: '更新时间',
      width: '100px',
      dataIndex: 'update_time',
      key: 'update_time',
      render: (time) => {
        return time.replace('T', ' ').slice(0, 19)
      },
    },
    {
      title: '操作',
      width: '100px',
      dataIndex: 'operation',
      key: 'operation',
      fixed: 'right',
      render: (_, item) => {
        return (
          <div>
            <Dropdown
              menu={{
                items: menuItems.filter((x) => x.key !== item.status),
                onClick: (key) => clickMenu(key.key, item),
              }}
            >
              <div>
                操作
                <DownOutlined />
              </div>
            </Dropdown>
          </div>
        )
      },
    },
  ]

  //WARN:需要调整
  const clickMenu = (key, item) => {
    console.log(key)
    if (key === 'editItem') {
      console.log('编辑条目', item)
      setCurrentItem({ ...item })
      setEditPopFlag(true)
    }
  }

  const cancleEditPop = () => {
    setEditPopFlag(false)
    setCurrentItem({})
    console.log('取消', currentItem)
  }

  //编辑
  const saveEditPop = () => {
    console.log('保存', currentItem)
    axios
      .put('/admin/notes/' + currentItem.id, {
        title: currentItem.title,
        content: currentItem.content,
        to_tag: currentItem.to_tag,
      })
      .then((res) => {
        console.log('保存成功', res)
        setEditPopFlag(false)
        setCurrentItem({})
        messageApi.open({
          type: 'success',
          content: '保存成功',
          duration: 2,
        })
        getListData()
      })
      .catch((err) => {
        console.log('保存失败', err)
        messageApi.open({
          type: 'error',
          content: '保存失败',
          duration: 2,
        })
      })
  }

  //启用/禁用  TODO:当添加了笔记审核后处理
  // const changeStatus = (status, item) => {
  //   console.log('启用/禁用', status, item)
  //
  //   const changeStatusApi = (status, item) => {
  //     axios
  //       .put('/admin/users/' + item.id, { status })
  //       .then((res) => {
  //         console.log('启用/禁用成功', res)
  //         messageApi.open({
  //           type: 'success',
  //           content: '操作成功',
  //           duration: 2,
  //         })
  //         getListData()
  //       })
  //       .catch((err) => {
  //         console.log('启用/禁用失败', err)
  //         messageApi.open({
  //           type: 'error',
  //           content: '操作失败',
  //           duration: 2,
  //         })
  //       })
  //   }
  //
  //   confirm({
  //     title: '确认更改该用户状态?',
  //     icon: <ExclamationCircleFilled />,
  //     content: '请谨慎操作',
  //     okText: '确认',
  //     cancelText: '取消',
  //     centered: true,
  //     onOk() {
  //       changeStatusApi(status, item)
  //     },
  //     onCancel() {
  //       console.log('取消')
  //     },
  //   })
  // }

  //新增
  const openAddPop = () => {
    console.log('新增', currentItem)
    setAddPopFlag(true)
  }

  const handleAddUser = () => {
    console.log('新增用户')
    // console.log('新增用户', form.getFieldsValue())
    // const {username, email, role} = form.getFieldsValue()
  }

  const cancleAddPop = () => {
    setAddPopFlag(false)
  }

  //过滤
  const filtersList = [
    {
      title: '标题',
      key: 'title',
      type: 'input',
      handle: (e) => {
        setFilters({ ...filters, title: e })
      },
    },
    {
      title: '标签',
      key: 'to_tag',
      type: 'select',
      options: roleList.map((item) => {
        //FIX:待修改
        return {
          value: item.id,
          label: item.name,
        }
      }),
      handle: (e) => {
        setFilters({ ...filters, role_id: e })
      },
    },
  ]

  const resetFilters = () => {
    setFilters({ username: '', roleId: '', status: '', email: '' })
  }

  useEffect(() => {
    console.log('currentItem', currentItem)
    if (Object.keys(currentItem).length > 0 && (editPopFlag || addPopFlag)) {
      form.setFieldsValue({
        title: currentItem.title,
        content: currentItem.content,
        to_tag: currentItem.tag && currentItem.tag.name,
      })
    } else {
      form.setFieldsValue({
        title: '',
        content: '',
        to_tag: '',
      })
    }
  }, [currentItem, editPopFlag, addPopFlag])

  // useEffect(() => {
  //   getListData();
  // }, [filters, pagination]);

  return (
    <div style={pageStyle.totalStyle}>
      <div style={pageStyle.allButtonStyle}>
        <SearchAdd
          openAddPop={openAddPop}
          filtersList={filtersList}
          refresh={getListData}
          resetFilters={resetFilters}
        />
      </div>
      {contextHolder}
      <div style={pageStyle.tableStyle}>
        <ConfigProvider locale={zhCN}>
          <Table
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={noteList}
            pagination={{
              position: ['bottomCenter'],
              current: pagination.offset,
              pageSize: pagination.limit,
              total: pagination.total,
              showQuickJumper: pagination.showQuickJumper,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                console.log('切换页面', page, pageSize)
                setPagination({
                  ...pagination,
                  offset: page,
                  limit: pageSize,
                })
              },
              onShowSizeChange: (current, pageSize) => {
                setPagination({
                  ...pagination,
                  offset: 1,
                  limit: pageSize,
                })
              },
              pageSizeOptions: [10, 20, 50, 100],
            }}
            scroll={{ scrollToFirstRowOnChange: false, x: '100%', y: '67vh' }}
          />
        </ConfigProvider>
      </div>
      <Modal
        title="编辑笔记"
        open={editPopFlag}
        okText="保存"
        cancelText="取消"
        onCancel={() => cancleEditPop()}
        onOk={() => saveEditPop()}
      >
        <Form
          name="editNote"
          form={form}
          layout={{ layout: 'Vertical' }}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入昵称!' }]}
            initialValue={currentItem.title}
            onChange={(e) => {
              setCurrentItem({ ...currentItem, title: e.target.value })
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入笔记内容!' }]}
            initialValue={currentItem.content}
            onChange={(e) => {
              setCurrentItem({ ...currentItem, content: e.target.value })
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="标签"
            name="tag"
            rules={[{ required: true, message: '请选择笔记所属标签!' }]}
            initialValue={currentItem.tag ? currentItem.tag.name : ''}
            onChange={(e) => {
              console.log(e)
              setCurrentItem({
                ...currentItem,
                tag: roleList.find((item) => item.id === e.target.value), //FIX:待修复
                to_tag: e.target.value,
              })
            }}
          >
            <Select
              options={roleList.map((item) => {
                return {
                  value: item.id,
                  label: item.name,
                }
              })}
              onChange={(e) => {
                console.log(e)
                setCurrentItem({
                  ...currentItem,
                  role: roleList.find((item) => item.id === e),
                  role_id: e,
                })
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* <Modal */}
      {/*   title="添加用户" */}
      {/*   open={addPopFlag} */}
      {/*   okText="保存" */}
      {/*   cancelText="取消" */}
      {/*   onCancel={() => cancleAddPop()} */}
      {/*   onOk={() => handleAddUser()} */}
      {/* > */}
      {/*   <Form */}
      {/*     name="addUser" */}
      {/*     form={form} */}
      {/*     layout={{ layout: 'Vertical' }} */}
      {/*     labelCol={{ span: 8 }} */}
      {/*     wrapperCol={{ span: 16 }} */}
      {/*   > */}
      {/*     <Form.Item */}
      {/*       label="昵称" */}
      {/*       name="nickname" */}
      {/*       rules={[{ required: true, message: '请输入昵称!' }]} */}
      {/*       onChange={(e) => */}
      {/*         setCurrentItem({ ...currentItem, nickname: e.target.value }) */}
      {/*       } */}
      {/*     > */}
      {/*       <Input /> */}
      {/*     </Form.Item> */}
      {/*     <Form.Item */}
      {/*       label="用户邮箱" */}
      {/*       name="email" */}
      {/*       rules={[{ required: true, message: '请输入用户邮箱!' }]} */}
      {/*       onChange={(e) => { */}
      {/*         setCurrentItem({ ...currentItem, email: e.target.value }) */}
      {/*       }} */}
      {/*     > */}
      {/*       <Input /> */}
      {/*     </Form.Item> */}
      {/*     <Form.Item */}
      {/*       label="用户角色" */}
      {/*       name="role" */}
      {/*       rules={[{ required: true, message: '请选择用户角色!' }]} */}
      {/*       onChange={(e) => { */}
      {/*         setCurrentItem({ */}
      {/*           ...currentItem, */}
      {/*           role: roleList.find((item) => item.id === e.target.value), */}
      {/*           role_id: e.target.value, */}
      {/*         }) */}
      {/*       }} */}
      {/*     > */}
      {/*       <Select */}
      {/*         options={roleList.map((item) => { */}
      {/*           return { */}
      {/*             value: item.id, */}
      {/*             label: item.name, */}
      {/*           } */}
      {/*         })} */}
      {/*         onChange={(e) => { */}
      {/*           console.log(e) */}
      {/*           setCurrentItem({ */}
      {/*             ...currentItem, */}
      {/*             role: roleList.find((item) => item.id === e), */}
      {/*             role_id: e, */}
      {/*           }) */}
      {/*         }} */}
      {/*       /> */}
      {/*     </Form.Item> */}
      {/*   </Form> */}
      {/* </Modal> */}
    </div>
  )
}
