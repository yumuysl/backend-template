import { Button } from 'antd'
//import axios from 'axios';
import LexicalEditor from '../../components/richeditor/LexicalEditor.jsx'

export default function Dashboard() {
  return (
    <div>
      <Button type="primary">Button</Button>
      <LexicalEditor width="600px" height="200px" />
    </div>
  )
}
