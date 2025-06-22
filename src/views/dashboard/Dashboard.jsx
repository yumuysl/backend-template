import { Button } from 'antd';
import axios from 'axios';

export default function Dashboard() {
  const ajax = ()=>{
    // 获取
    // axios.get('http://localhost:8000//user-list').then((res)=>{
    //   console.log("获取数据", res.data);
    // })

    // 新增
    // axios.post('http://localhost:8000/user-list',   {
    //   "name": "江柳儿",
    //   "email": "d.wrlytlheg@kuxk.hr",
    //   "role": "普通用户",
    //   "updateTime": "1979-11-29 02:44:35",
    //   "createTime": "2022-11-01 13:19:46"
    // }).then((res)=>{
    //   console.log("新增数据", res.data);
    // })

    //更新 put
    // axios.put('http://localhost:8000/posts/4',{
    //   title: '测试'
    // })

    //更新 patch
    // axios.patch('http://localhost:8000/posts/4', {
    //   title: '测试patch'
    // })

    // 删除
    //axios.delete('http://localhost:8000/auth-list/1')
   

    //_embed
    // axios.get('http://localhost:8000/posts?_embed=comments').then((res)=>{
    //   console.log("获取数据", res.data);
    // })

    // axios.get('http://localhost:8000/comments?_embed=post').then((res)=>{
    //   console.log("获取数据", res.data);
    // })

  }

  return (
    <div>
      <Button type="primary" >Button</Button>
    </div>
  )

}