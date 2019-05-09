import * as React from 'react';

export default {
    $schema: "https://houtai.baidu.com/v2/schemas/page.json#",
    title: "Editor",
    body: [
        {
            type: "form",
            api: "/api/mock2/saveForm?waitSeconds=2",
            title: "",
            controls: [
                {
                    name: "javascript",
                    type: "javascript-editor",
                    label: "Javascript",
                    value: "console.log(1, 2, 3);"
                },

                {
                    name: "html",
                    type: "html-editor",
                    label: "Html",
                    value: "<html><head><title>Hello</title></head><body><p>world</p></body></html>"
                },

                {
                    name: "css",
                    type: "css-editor",
                    label: "CSS",
                    value: "body {color: red;}"
                }
            ]
        }
    ]
};
