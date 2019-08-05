import {
    wrapFetcher,
    filter
} from '../../src/index';
import axios from 'axios';


export const fetch = wrapFetcher(({
    url,
    method,
    data,
    config
}:any) => {
    config = config || {};
    
    if (method !== 'post' && method !== 'put' && method !== 'patch') {
        if (data) {
            config.params = data;
        }

        return (axios as any)[method](url, config);
    } else if (data && data instanceof FormData) {
        // config.headers = config.headers || {};
        // config.headers['Content-Type'] = 'multipart/form-data';
    } else if (data 
        && typeof data !== 'string'
        && !(data instanceof Blob) 
        && !(data instanceof ArrayBuffer)
    ) {
        data = JSON.stringify(data);
        config.headers = config.headers || {};
        config.headers['Content-Type'] = 'application/json';
    }

    return (axios as any)[method](url, data, config);
});

export {
    filter
};