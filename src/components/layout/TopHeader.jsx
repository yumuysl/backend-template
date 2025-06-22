import { useState, useEffect } from 'react'
import { Avatar, Dropdown, Space } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router'

const topHeaderStyle = {
  totalEare: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    color: '#000',
  },
  left: {
    minWidth: '20%',
  },
  leftContent: {
    marginLeft: '15px',
  },
  center: {
    width: '60%',
    height: '100%',
    textalign: 'center',
  },
  right: {
    minWidth: '20%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'flex-end',
    alignItems: 'center',
  },
  rightContent: {
    marginRight: '15px', 
  }
}

export default function TopHeader() {
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const menuItems = [
    {
      key: '1',
      label: '管理员',
      onClick: (item) => {
        console.log('管理员', item) 
      }
    },
    {
      key: '2',
      label: '退出登录',
      onClick: (item) => {
        console.log('退出登录', item)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
      }
    }
  ]

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem('user'))
    setUsername(user.username.trim())
  }, [])

  return (
    <>
      <div style={topHeaderStyle.totalEare}>
        <div style={topHeaderStyle.left}>
          <div style={topHeaderStyle.leftContent}>
            首页
          </div>
        </div>
        <div style={topHeaderStyle.right}>
          <div style={topHeaderStyle.rightContent}>
            <Dropdown 
              menu={{ items: menuItems,}}
            >
              <Space>
                <p>{username}</p>
                <Avatar size="large" icon={<UserOutlined />} />
              </Space>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  )
}