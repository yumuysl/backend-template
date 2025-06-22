import {Flex, Button, Input, Select} from "antd";

const { Search } = Input;

const SearchAdd = ({openAddPop, filtersList, refresh, resetFilters}) => {

  return (
   <>
      <Flex justify="space-between" align="center">
        <Flex  gap='small'>
          {
            filtersList.map((item, index)=>{
              if(item.type === 'input'){
                return (
                  <Search key={item.key}  placeholder={item.title}  allowClear  onSearch={(e)=>item.handle(e)} />
                )
              }

              if(item.type === 'select'){
                return (
                  <Select allowClear showSearch placeholder={ item.title } optionFilterProp="label"  onChange={item.handle} options={item.options} />
                ) 
              }
            }) 
          }
          <Button color="primary" variant="solid" onClick={()=>refresh()}>刷新</Button>
          <Button color="primary" variant="solid" onClick={()=>resetFilters()}>重置</Button>
        </Flex>
        <Button color="primary" variant="solid" onClick={()=>openAddPop()}>新增</Button>
      </Flex>
   </> 
  )

}

export default SearchAdd;