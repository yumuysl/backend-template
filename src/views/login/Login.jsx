import { useState, useEffect, useMemo } from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Flex, message } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

const pageStyle = {
  pageBackground: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background:
      'linear-gradient(45deg, rgb(161 196 255),rgb(250 250 250), rgb(164 242 250)), url("../public/img/login-background.jpg") #f1f1f1  center/cover',
  },
  formOutFrame: {
    width: '380px',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    zIndex: '10',
  },
}

export default function Login() {
  const navigate = useNavigate()
  const [particlesInit, setParticlesInit] = useState(false)
  const [messageApi, contentHolder] = message.useMessage()

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setParticlesInit(true)
    })
  }, [])

  const particlesLoaded = (container) => {
    console.log(container)
  }

  const options = useMemo(
    () => ({
      key: 'parallax',
      name: 'Parallax',
      particles: {
        number: {
          value: 100,
          density: {
            enable: true,
          },
        },
        color: {
          value: '#CE93F8',
        },
        shape: {
          type: ['circle', 'triangle', 'polygon'],
        },
        opacity: {
          value: {
            min: 0.1,
            max: 0.5,
          },
          animation: {
            enable: true,
            speed: 3,
            sync: false,
          },
        },
        size: {
          value: {
            min: 1,
            max: 10,
          },
          animation: {
            enable: true,
            speed: 20,
            sync: false,
          },
        },
        links: {
          enable: true,
          distance: 150,
          color: '#8C08F1',
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
        },
      },
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: 'grab',
            parallax: {
              enable: true,
              smooth: 50,
              force: 60,
            },
          },
          onClick: {
            enable: true,
            mode: 'push',
          },
        },
        modes: {
          grab: {
            distance: 200,
            links: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 0.8,
          },
          repulse: {
            distance: 200,
          },
          push: {
            quantity: 4,
          },
          remove: {
            quantity: 2,
          },
        },
      },
    }),
    []
  )

  const onFinish = (values) => {
    console.log('Received values of form: ', values)
    try {
      // 节流请求
      // 数据加密
      // 发送请求到服务器进行登录验证
      axios
        .post(
          '/admin/login',
          {
            username: values.username,
            password: values.password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          //验证成功，提示并保存token，跳转到首页
          console.log('res:', response)
          if (response.status === 200) {
            const backData = response.data.data
            messageApi.open({
              type: 'success',
              content: '登录成功！',
              duration: 10,
            })
            localStorage.setItem('token', backData.access_token)
            localStorage.setItem('user', JSON.stringify(backData.user))
            window.location.reload() //主要是为了重新载入路由文件
            setTimeout(() => {
              navigate('/home')
            }, 1000)
          } else {
            messageApi.open({
              type: 'error',
              content: error.message || '账号或密码错误！',
              duration: 10,
            })
          }
        })
        .catch((err) => {
          //验证失败，提示错误信息
          console.log('请求出错：', err)
          messageApi.open({
            type: 'error',
            content: '账号或密码错误',
            duration: 10,
          })
        })
    } catch (error) {
      console.log('', error)
      messageApi.open({
        type: 'error',
        content: '登录异常，请重试！',
        duration: 10,
      })
    }
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <div style={pageStyle.pageBackground}>
        {contentHolder}
        {particlesInit ? (
          <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={options}
          />
        ) : null}
        <div style={pageStyle.formOutFrame}>
          <div>
            <h2>欢迎登录</h2>
          </div>
          <Form
            name="login"
            initialValues={{
              remember: true,
            }}
            style={{
              width: '300px',
              margin: '30px auto',
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                size="large"
                placeholder="用户名"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码!',
                },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                size="large"
                type="password"
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item>
              <Flex
                justify="space-between"
                align="center"
                style={{ padding: '0 7px' }}
              >
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>记住密码</Checkbox>
                </Form.Item>
                <a href="">忘记密码</a>
              </Flex>
            </Form.Item>

            <Form.Item>
              <Button
                block
                color="primary"
                size="large"
                variant="solid"
                htmlType="submit"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  )
}
