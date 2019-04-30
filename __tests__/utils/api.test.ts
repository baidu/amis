import {
    buildApi,
    isApiOutdated
} from '../../src/utils/api';

test('api:buildApi', () => {
    expect(buildApi('/api/xxx')).toMatchObject({
        method: 'get',
        url: '/api/xxx'
    });

    expect(buildApi('get:/api/xxx')).toMatchObject({
        method: 'get',
        url: '/api/xxx'
    });

    expect(buildApi('delete:/api/xxx')).toMatchObject({
        method: 'delete',
        url: '/api/xxx'
    });

    
    expect(buildApi('/api/xxx?a=${a}&b=${b}', {
        a: 1,
        b: 2
    })).toMatchObject({
        method: 'get',
        url: '/api/xxx?a=1&b=2'
    });

    expect(buildApi({
        method: 'get',
        url: '/api/xxx?a=${a}&b=${b}'
    }, {
        a: 1,
        b: 2
    })).toMatchObject({
        method: 'get',
        url: '/api/xxx?a=1&b=2'
    });

    expect(buildApi('/api/xxx?a=${a}', {
        a: '&'
    })).toMatchObject({
        method: 'get',
        url: '/api/xxx?a=' + encodeURIComponent('&')
    });
});


test('api:buildApi:dataMapping', () => {
    expect(buildApi({
        method: 'post',
        url: '/api/xxx',
        data: {
            a: 1,
            b: '${b}'
        }
    }, {
        b: 2
    })).toMatchObject({
        method: 'post',
        url: '/api/xxx',
        data: {
            a: 1,
            b: 2
        }
    });


    expect(buildApi({
        method: 'post',
        url: '/api/xxx',
        headers: {
            a: 1,
            b: '${b}'
        }
    }, {
        b: 2
    })).toMatchObject({
        method: 'post',
        url: '/api/xxx',
        headers: {
            a: 1,
            b: 2
        }
    });
});

test('api:buildApi:autoAppend', () => {
    expect(buildApi({
        method: 'get',
        url: '/api/xxx',
    }, {
        a: 1,
        b: 2
    }, {
        autoAppend: true
    })).toMatchObject({
        method: 'get',
        url: '/api/xxx?a=1&b=2'
    });
});


test('api:isApiOutdated', () => {
    expect(isApiOutdated('/api/xxx?a=${a}', '/api/xxx?a=${a}', {
        a: 1,
        b: 0
    }, {
        a: 1,
        b: 2,
    })).toBeFalsy();

    expect(isApiOutdated('/api/xxx?a=${a}', '/api/xxx?a=${a}', {
        a: 1,
        b: 0
    }, {
        a: 2,
        b: 2,
    })).toBeTruthy();


    expect(isApiOutdated('/api/xxx', '/api/xxx', {
        a: 1,
        b: 0
    }, {
        a: 2,
        b: 2,
    })).toBeFalsy();

    expect(isApiOutdated({
        method: 'get',
        url: '/api/xxx?a=${a}'
    }, {
        method: 'get',
        url: '/api/xxx?a=${a}',
        sendOn: 'this.b === 0'
    }, {
        a: 1,
        b: 0
    }, {
        a: 2,
        b: 2,
    })).toBeFalsy();
});