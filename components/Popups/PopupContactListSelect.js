import { useEffect, useState } from 'react'
import { mainAPI } from '@/plugins/axios'
import FormContactListSelect from '../FormContactListSelect'
import Popup from './Popup'

const PopupContactListSelect = ({ onDone }) => {
  const [loading, setLoading] = useState(true)
  const [dataList, setDataList] = useState([])

  useEffect(() => { 
    async function getList() {
      const { data } = await mainAPI.get(
        `/users/me/contactLists?limit=1000&page=1`
      )  
      setLoading(false)
      setDataList(data.docs)
    }
    getList()
  }, [])

  return (
    <Popup title="Add to existing list">
      <FormContactListSelect
        buttonText="Add"
        data={dataList}
        loading={loading}
        onSubmit={onDone}
      />
    </Popup>
  )
}

export default PopupContactListSelect