import { Dispatch, SetStateAction } from 'react';
export interface ItemProps {
  id: string
}  
export default function ItemsContext<T extends ItemProps>(props:[T[], Dispatch<SetStateAction<T[]>>]):[T[], Dispatch<SetStateAction<T[]>>, (T, idToReplace?) => void, (id) => T, (T) => void] {
  const [items, setItems] = props;

  const getItem = (id) => items.find((p) => p.id == id)

  const getItemIndex = (id) => {
    const item = getItem(id)
    return item && items.indexOf(item)
  }

  const updateItems = (items, item, idToReplace?) => {
    if(!item.id) {
      throw Error(`Item without id : ${JSON.stringify(item)}`)
    }
    const existingItem = idToReplace && getItem(idToReplace) || getItem(item.id)
    if (existingItem) {
      const index = items.indexOf(existingItem)
      item = Object.assign({}, existingItem, item)
      items.splice(index, 1, item)
      console.log(`${item.id} : updated item at ${index}`, items[index])
    } else {
      items.push(item)
      const index = items.length - 1
      console.log(`${item.id} : pushed item at ${index}`, items[index])
    }
  }

  const deleteItem = (id) => {
    // check if full item is being passed
    id = id.id || id
    const index = getItemIndex(id)
    if(index >= 0) {
      const itemsDupe = ([] as T[]).concat(items)
      itemsDupe.splice(index, 1)
      console.log(`${id} : removed item at ${index}`)
      setItems(itemsDupe)
    }
  }

  const upsertItem = (item, idToReplace) => {
    const itemsDupe = ([] as T[]).concat(items)
    if (Array.isArray(item)) {
      item.forEach((i) => { updateItems(itemsDupe, i) })
    } else {
      updateItems(itemsDupe, item, idToReplace)
    }
    setItems(itemsDupe)
  }

  return [items, setItems, upsertItem, getItem, deleteItem];
};
