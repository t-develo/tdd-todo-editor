'use strict';
const fs = require('fs');
const path = require('path');

/**
 *
 * @return {string}
 */
function getFilePathPrefix() {
    if (process.env.NODE_ENV === 'development') {
        return process.cwd() + '/public/';
    }
    return '../bundled/';
}

fs.readFile(
    path.join(getFilePathPrefix(), 'todo.json'),
    { encoding: 'utf-8' },
    async (err, data) => {
        if (err !== null) {
            console.log(err);
            global.readFileData = null;
            return;
        }
        // Node環境のglobal変数にプロパティ追加→Chromiumのwindowオブジェクトにプロパティが追加される
        global.readFileData = data;
    }
);
