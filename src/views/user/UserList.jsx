import React, { useState, useEffect } from "react";
import {
  ConfigProvider,
  Table,
  Dropdown,
  Modal,
  Form,
  message,
  Input,
  Select,
  Pagination,
} from "antd";
import { DownOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import zhCN from "antd/locale/zh_CN";
import axios from "axios";

import SearchAdd from "../../components/table/SearchAdd";

const { confirm } = Modal;

const pageStyle = {
  totalStyle: {
    width: "100%",
    height: "89vh",

    color: "#000",
    backgroundColor: "#fff",
    overflow: "auto",
  },
  tableStyle: {
    padding: "0 8px",
    textAlign: "center",
    fontSize: "10px",
  },
  allButtonStyle: {
    width: "100%",
    height: "80px",
    padding: "20px 8px",
  },
};

//ID、用户名、用户邮箱、用户角色、用户状态、创建时间、更新时间、操作
const menuItems = [
  {
    label: "编辑",
    key: "editItem",
  },
  {
    label: "重置密码",
    key: "resetPassword",
  },
  {
    label: "禁用",
    key: "N",
  },
  {
    label: "启用",
    key: "Y",
  },
];

export default function UserList() {
  const [userList, setUserList] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [editPopFlag, setEditPopFlag] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [addPopFlag, setAddPopFlag] = useState(false);
  const [filters, setFilters] = useState({
    username: "",
    roleId: "",
    status: "",
    email: "",
  });
  const [pagination, setPagination] = useState({
    offset: 1,
    limit: 10,
    total: 0,
    showQuickJumper: false,
  });
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const getListData = () => {
    console.log("过滤筛选", filters);
    //过滤筛选
    let params = "";
    for (let key in filters) {
      if (filters[key]) {
        params += "&" + key + "=" + filters[key];
      }
    }

    let url = `/admin/users?currentpage=${pagination.offset}&limit=${pagination.limit}`;
    axios
      .get(url)
      .then((res) => {
        let resData = res.data;
        console.log("列表：", resData);
        console.log("分页：", pagination);
        setUserList(resData.data.data);
        if(resData.data.total !== pagination.total)
        {
          setPagination({
            ...pagination,
            offset: resData.data.currentPage,
            total: resData.data.total,
            showQuickJumper: (parseInt(resData.data.total / pagination.limit) + 1 > 5) ? true : false,
          });
        }
      })
      .catch((err) => {
        console.log("用户数据", err);
      });
  };

  const getRoleList = () => {
    axios
      .get("/admin/roles")
      .then((res) => {
        console.log("角色数据", res.data);
        setRoleList(res.data.data.data);
      })
      .catch((err) => {
        console.log("数据获取失败", err);
      });
  };

  useEffect(() => {
    Promise.all([getListData(), getRoleList()])
      .then((res) => {
        console.log("获取数据成功", res);
      })
      .catch((err) => {
        console.log("获取数据失败", err);
      });
  }, []);

  const columns = [
    {
      title: "ID",
      width: "40px",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      fixed: "left",
    },
    {
      title: "用户名",
      width: "100px",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "昵称",
      width: "100px",
      dataIndex: "nickname",
      key: "nickname",
    },
    {
      title: "用户邮箱",
      width: "100px",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "用户角色",
      width: "100px",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        return !!role ? role.name : '';
      },
    },
    {
      title: "用户状态",
      width: "100px",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return status === "Y" ? "正常" : "禁用";
      },
    },
    {
      title: "创建时间",
      width: "100px",
      dataIndex: "create_time",
      key: "create_time",
      render: (time) => {
        return time.replace('T', ' ').slice(0,19)
      },
    },
    {
      title: "更新时间",
      width: "100px",
      dataIndex: "update_time",
      key: "update_time",
      render: (time) => {
        return time.replace('T', ' ').slice(0,19)
      },
    },
    {
      title: "操作",
      width: "100px",
      dataIndex: "operation",
      key: "operation",
      fixed: "right",
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
        );
      },
    },
  ];

  const clickMenu = (key, item) => {
    console.log(key);
    if (key === "editItem") {
      console.log("编辑条目", item);
      setCurrentItem({ ...item });
      setEditPopFlag(true);
    }
    if (key === "resetPassword") {
      console.log("重置密码", item);
      resetPassword(item)
    }
    if (key === "N") {
      console.log("禁用", item);
      changeStatus("N", item);
    }
    if (key === "Y") {
      console.log("启用", item);
      changeStatus("Y", item);
    }
  };

  const cancleEditPop = () => {
    setEditPopFlag(false);
    setCurrentItem({});
    console.log("取消", currentItem);
  };

  //编辑
  const saveEditPop = () => {
    console.log("保存", currentItem);
    axios
      .put("/admin/users/" + currentItem.id, {
        nickname: currentItem.nickname,
        email: currentItem.email,
        role_id: currentItem.role_id,
      })
      .then((res) => {
        console.log("保存成功", res);
        setEditPopFlag(false);
        setCurrentItem({});
        messageApi.open({
          type: "success",
          content: "保存成功",
          duration: 2,
        });
        getListData();
      })
      .catch((err) => {
        console.log("保存失败", err);
        messageApi.open({
          type: "error",
          content: "保存失败",
          duration: 2,
        });
      });
  };

  //重置密码
  const resetPassword = (item) => { 
    const handleReset = () =>{
      axios.put('/admin/users/password/'+item.id, {
        password1: "123456",
        password2: "123456"
      }).then((res) => {
          messageApi.open({
            type: "success",
            content: "操作成功",
            duration: 2,
          });
      }).catch((err) => {
          messageApi.open({
            type: "error",
            content: "操作失败",
            duration: 2,
          });
      });
    }

    confirm({
      title: "是否重置用户密码？",
      icon: <ExclamationCircleFilled />,
      content: "请谨慎操作",
      okText: "确认",
      cancelText: "取消",
      centered: true,
      onOk(){
        handleReset()
      },
      onCancel() {
        console.log("取消");
      },
    })
  };

  //启用/禁用
  const changeStatus = (status, item) => {
    console.log("启用/禁用", status, item);

    const changeStatusApi = (status, item) => {
      axios
        .put("/admin/users/" + item.id, { status })
        .then((res) => {
          console.log("启用/禁用成功", res);
          messageApi.open({
            type: "success",
            content: "操作成功",
            duration: 2,
          });
          getListData();
        })
        .catch((err) => {
          console.log("启用/禁用失败", err);
          messageApi.open({
            type: "error",
            content: "操作失败",
            duration: 2,
          });
        });
    };

    confirm({
      title: "确认更改该用户状态?",
      icon: <ExclamationCircleFilled />,
      content: "请谨慎操作",
      okText: "确认",
      cancelText: "取消",
      centered: true,
      onOk() {
        changeStatusApi(status, item);
      },
      onCancel() {
        console.log("取消");
      },
    });
  };

  //新增
  const openAddPop = () => {
    console.log("新增", currentItem)
    setAddPopFlag(true);
  };

  const handleAddUser = () => {
    console.log("新增用户");
    // console.log('新增用户', form.getFieldsValue())
    // const {username, email, role} = form.getFieldsValue()
  };

  const cancleAddPop = () => {
    setAddPopFlag(false);
  };
  
  
  //过滤
  const filtersList = [
    {
      title: "用户名",
      key: "username",
      type: "input",
      handle: (e) => {
        setFilters({ ...filters, username: e });
      },
    },
    {
      title: "用户邮箱",
      key: "email",
      type: "input",
      handle: (e) => {
        setFilters({ ...filters, email: e });
      },
    },
    {
      title: "用户角色",
      key: "roleId",
      type: "select",
      options: roleList.map((item) => {
        return {
          value: item.id,
          label: item.roleName,
        };
      }),
      handle: (e) => {
        setFilters({ ...filters, role_id: e });
      },
    },
    {
      title: "用户状态",
      key: "status",
      type: "select",
      options: [
        { value: "Y", label: "正常" },
        { value: "N", label: "禁用" },
      ],
      handle: (e) => {
        setFilters({ ...filters, status: e });
      },
    },
  ];

  const resetFilters = () => {
    setFilters({ username: "", roleId: "", status: "", email: "" });
  };

  useEffect(() => {
    console.log("currentItem", currentItem);
    if (Object.keys(currentItem).length > 0 && (editPopFlag || addPopFlag)) {
      form.setFieldsValue({
        nickname: currentItem.nickname,
        email: currentItem.email,
        role: currentItem.role && currentItem.role.name,
      });
    } else{
      form.setFieldsValue({
        nickname: '',
        email: '',
        role: '',
      });
    }
  }, [currentItem]);

  useEffect(() => {
    getListData();
  }, [filters, pagination]);

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
            dataSource={userList}
            pagination={{
              position: ["bottomCenter"],
              current: pagination.offset,
              pageSize: pagination.limit,
              total: pagination.total,
              showQuickJumper: pagination.showQuickJumper,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                console.log("切换页面", page, pageSize);
                setPagination({
                ...pagination,
                  offset: page,
                  limit: pageSize,}); 
              },
              onShowSizeChange: (current, pageSize) => {
                setPagination({
                  ...pagination,
                  offset: 1,
                  limit: pageSize,
                });
              },
              pageSizeOptions: [10, 20, 50, 100],
            }}
            scroll={{ scrollToFirstRowOnChange: false, x: "100%", y: "67vh" }}
          />
        </ConfigProvider>
      </div>
      <Modal
        title="编辑用户"
        open={editPopFlag}
        okText="保存"
        cancelText="取消"
        onCancel={() => cancleEditPop()}
        onOk={() => saveEditPop()}
      >
        <Form
          name="editUser"
          form={form}
          layout={{ layout: "Vertical" }}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="昵称"
            name="nickname"
            rules={[{ required: true, message: "请输入昵称!" }]}
            initialValue={currentItem.nickname}
            onChange={(e) =>{
              setCurrentItem({ ...currentItem, nickname: e.target.value });
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, message: "请输入用户邮箱!" }]}
            initialValue={currentItem.email}
            onChange={(e) => {
              setCurrentItem({ ...currentItem, email: e.target.value });
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="角色"
            name="role"
            rules={[{ required: true, message: "请选择用户角色!" }]}
            initialValue={!!currentItem.role ? currentItem.role.name : ""}
            
            onChange={(e) => {
              console.log(e)
              setCurrentItem({ 
                ...currentItem, 
                role: roleList.find(item => item.id === e.target.value),
                role_id: e.target.value
              });
            }}
          >
            <Select
              options={roleList.map((item) => {
                return {
                  value: item.id,
                  label: item.name,
                };
              })}
              onChange={(e) => {
                console.log(e)
                setCurrentItem({ 
                  ...currentItem, 
                  role: roleList.find(item => item.id === e),
                  role_id: e
                });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="添加用户"
        open={addPopFlag}
        okText="保存"
        cancelText="取消"
        onCancel={() => cancleAddPop()}
        onOk={() => handleAddUser()}
      >
        <Form
          name="addUser"
          form={form}
          layout={{ layout: "Vertical" }}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="昵称"
            name="nickname"
            rules={[{ required: true, message: "请输入昵称!" }]}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, nickname: e.target.value })
            }
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="用户邮箱"
            name="email"
            rules={[{ required: true, message: "请输入用户邮箱!" }]}
            onChange={(e) => {
              setCurrentItem({ ...currentItem, email: e.target.value });
            }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="用户角色"
            name="role"
            rules={[{ required: true, message: "请选择用户角色!" }]}
            onChange={(e) => {
              setCurrentItem({ 
                ...currentItem, 
                role: roleList.find(item => item.id === e.target.value),
                role_id: e.target.value
              });
            }}
          >
            <Select
              options={roleList.map((item) => {
                return {
                  value: item.id,
                  label: item.name,
                };
              })}
              onChange={(e) => {
                console.log(e)
                setCurrentItem({ 
                  ...currentItem, 
                  role: roleList.find(item => item.id === e),
                  role_id: e
                });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
