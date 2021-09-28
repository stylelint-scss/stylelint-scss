"use strict"; // eslint-disable-line strict

/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 *
 */

const crypto = require("crypto");
const fs = require("fs");
const jestPreset = require("babel-preset-jest");
const path = require("path");

const BABELRC_FILENAME = ".babelrc";
const BABELRC_JS_FILENAME = ".babelrc.js";
const BABEL_CONFIG_KEY = "babel";
const PACKAGE_JSON = "package.json";
const THIS_FILE = fs.readFileSync(__filename);

let babel;

const createTransformer = options => {
  const cache = Object.create(null);

  const getBabelRC = filename => {
    const paths = [];
    let directory = filename;

    while (directory !== (directory = path.dirname(directory))) {
      if (cache[directory]) {
        break;
      }

      paths.push(directory);
      const configFilePath = path.join(directory, BABELRC_FILENAME);

      if (fs.existsSync(configFilePath)) {
        cache[directory] = fs.readFileSync(configFilePath, "utf8");
        break;
      }

      const configJsFilePath = path.join(directory, BABELRC_JS_FILENAME);

      if (fs.existsSync(configJsFilePath)) {
        // $FlowFixMe
        cache[directory] = JSON.stringify(require(configJsFilePath));
        break;
      }

      const packageJsonFilePath = path.join(directory, PACKAGE_JSON);

      if (fs.existsSync(packageJsonFilePath)) {
        // $FlowFixMe
        const packageJsonFileContents = require(packageJsonFilePath);

        if (packageJsonFileContents[BABEL_CONFIG_KEY]) {
          cache[directory] = JSON.stringify(
            packageJsonFileContents[BABEL_CONFIG_KEY]
          );

          break;
        }
      }
    }
    paths.forEach(directoryPath => (cache[directoryPath] = cache[directory]));

    return cache[directory] || "";
  };

  options = Object.assign({}, options, {
    plugins: (options && options.plugins) || [],
    presets: ((options && options.presets) || []).concat([jestPreset]),
    retainLines: true
  });

  delete options.cacheDirectory;
  delete options.filename;

  return {
    canInstrument: true,
    getCacheKey(sourceText, sourcePath, transformOptions) {
      const { configString, instrument } = transformOptions;

      return crypto
        .createHash("md5")
        .update(THIS_FILE)
        .update("\0", "utf8")
        .update(sourceText)
        .update("\0", "utf8")
        .update(configString)
        .update("\0", "utf8")
        .update(getBabelRC(sourcePath))
        .update("\0", "utf8")
        .update(instrument ? "instrument" : "")
        .digest("hex");
    },
    process(sourceText, sourcePath, transformOptions) {
      const { config, instrument } = transformOptions;

      if (!babel) {
        babel = require("@babel/core");
      }

      if (babel.util && !babel.util.canCompile(sourcePath)) {
        return sourceText;
      }

      const theseOptions = Object.assign({ filename: sourcePath }, options);

      if (typeof instrument !== "undefined" && instrument) {
        // theseOptions.auxiliaryCommentBefore = ' istanbul ignore next ';
        // Copied from jest-runtime transform.js
        theseOptions.plugins = theseOptions.plugins.concat([
          [
            require("babel-plugin-istanbul").default,
            {
              // files outside `cwd` will not be instrumented
              cwd: config.rootDir,
              exclude: []
            }
          ]
        ]);
      }

      return babel.transform(sourceText, theseOptions).code;
    }
  };
};

module.exports = createTransformer();
module.exports.createTransformer = createTransformer;
