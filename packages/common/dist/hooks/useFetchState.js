var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useEffect, useState } from 'react';
import api from '../services/api';
export default function useFetchState(props) {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({});
    const fetch = (url) => __awaiter(this, void 0, void 0, function* () {
        setLoading(true);
        const result = yield api({ method: 'get', url: url, headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, data: {} });
        setLoading(false);
        const data = result && result.data;
        setState(data);
        return data;
    });
    useEffect(() => {
        if (props && props.url) {
            fetch(props.url);
        }
    }, [props && props.url]);
    return [state, loading, fetch];
}
