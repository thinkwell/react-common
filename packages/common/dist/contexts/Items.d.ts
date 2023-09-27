import { Dispatch, SetStateAction } from 'react';
export interface ItemProps {
    id: string;
}
export default function ItemsContext<T extends ItemProps>(props: [T[], Dispatch<SetStateAction<T[]>>]): [T[], Dispatch<SetStateAction<T[]>>, (T: any, idToReplace?: any) => void, (id: any) => T, (T: any) => void];
