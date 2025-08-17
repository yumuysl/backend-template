import { useState, useEffect } from 'react'
import { Menu } from 'antd'
import {
  HomeOutlined,
  UserOutlined,
  IdcardOutlined,
  FolderOpenOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router'

const itemsData = [
  {
    key: 'dashboard',
    icon: <HomeOutlined />,
    label: '首页',
  },
  {
    key: 'note',
    icon: <UserOutlined />,
    label: '笔记管理',
    children: [
      {
        key: 'note/list',
        label: '笔记列表',
      },
    ],
  },
  {
    key: 'user',
    icon: <UserOutlined />,
    label: '用户管理',
    children: [
      {
        key: 'user/list',
        label: '用户列表',
      },
    ],
  },
  {
    key: 'auth',
    icon: <IdcardOutlined />,
    label: '权限管理',
    children: [
      {
        key: 'auth/list',
        label: '权限列表',
      },
      {
        key: 'role/list',
        label: '角色列表',
      },
    ],
  },
  {
    key: 'system',
    label: '系统管理',
    icon: <SettingOutlined />,
    children: [
      {
        key: 'system/menu',
        label: '系统配置',
      },
    ],
  },
]

export default function SideMenu() {
  const [mode, setMode] = useState('inline')
  const [items, setItems] = useState(itemsData) // 初始数据为 itemsData[0]
  const [theme, setTheme] = useState('light')
  const [pageStyle, setpageStyle] = useState({
    switchStyle: {
      width: '100%',
      height: '4vh',
      minHeight: '32px',
      padding: '20px',
      textAlign: 'center',
      fontSize: '10px',
      color: '#000',
      backaroundColor: '#fff',
    },
    menuStyle: {
      width: '100%',
      height: '100%',
      overflow: 'auto',
    },
  })

  const navigate = useNavigate()

  useEffect(() => {
    let user = localStorage.getItem('user')
    if (!user) {
      navigate('/login')
    }
    // user = JSON.parse(user)
    // const roleRights = user.role && user.role.rights
    // const getItems = (objList)=>{
    //   return objList.filter( item => {
    //     if(!!roleRights && roleRights.includes('/'+item.key)){
    //       if(!!item.children && item.children.length > 0){
    //         item.children = getItems(item.children)
    //       }
    //       return item
    //     }
    //   })
    // }
    // setItems(getItems(itemsData))
  }, [])

  useEffect(() => {
    // console.log(theme, pageStyle)
    setpageStyle({
      ...pageStyle,
      switchStyle: {
        ...pageStyle.switchStyle,
        backgroundColor: theme === 'dark' ? '#000' : '#fff',
        color: theme === 'dark' ? '#fff' : '#000',
      },
    })
  }, [theme])

  const getItem = (item) => {
    console.log('跳转', item)
    navigate(item.key)
  }

  return (
    <>
      <div style={pageStyle.menuStyle}>
        <Menu
          style={{
            width: '100%',
            height: '100%',
          }}
          defaultSelectedKeys={['dashboard']}
          defaultOpenKeys={[]}
          mode={mode}
          theme={theme}
          items={items}
          onClick={getItem}
        />
      </div>
    </>
  )
}
