var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useContext } from 'react';
import axios from 'axios';
import useFetcherWithPromise from '../hooks/useFetcherWithPromise.js';
import { ApiContext } from '../contexts/Api.js';
export default function (props) {
    const [useFetcher] = useContext(ApiContext);
    return () => __awaiter(this, void 0, void 0, function* () {
        if (useFetcher) {
            const fetcher = useFetcherWithPromise();
            if (props.method = ~/get/i) {
                return yield fetcher.load(props.url);
            }
            else {
                return yield fetcher.submit(props.data, props);
            }
        }
        else {
            const csrfTokenEl = document.querySelector("meta[name=csrf-token]");
            if (csrfTokenEl) {
                axios.defaults.headers.common['X-CSRF-Token'] = csrfTokenEl.content;
            }
            return yield axios(props);
        }
    });
}
