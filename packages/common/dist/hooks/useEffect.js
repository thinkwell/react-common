import React, { useEffect as useEffectReact } from 'react';
export default function useEffect(callback, props) {
    const callbackOnMounted = () => {
        let isMounted = true;
        if (isMounted) {
            callback();
        }
        return () => {
            isMounted = false;
        };
    };
    return useEffectReact(callbackOnMounted, props);
}
