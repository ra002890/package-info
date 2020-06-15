"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walk = void 0;
/**
 * Recursively walk a directory asynchronously and obtain all file names (with full path).
 *
 * @param dir Folder name you want to recursively process
 * @param done Callback function, returns all files with full path.
 * @param filter Optional filter to specify which files to include,
 *   e.g. for json files: (f: string) => /.json$/.test(f)
 * @see https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search/50345475#50345475
 */
const path = require("path");
const fs = require("fs");
const getDirectories = (source) => fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
const walk = (dir, done) => {
    let results = [];
    let list = getDirectories(dir);
    console.log(dir);
    results.push(dir);
    let pending = list.length;
    if (!pending) {
        return done(null, results);
    }
    list.forEach((file) => {
        file = path.resolve(dir, file);
        fs.stat(file, (err2, stat) => {
            if (stat && stat.isDirectory()) {
                walk(file, (err3, res) => {
                    if (res) {
                        results = results.concat(res);
                    }
                    if (!--pending) {
                        done(null, results);
                    }
                });
            }
            else {
                if (!--pending) {
                    done(null, results);
                }
            }
        });
    });
};
exports.walk = walk;
//# sourceMappingURL=walk.js.map