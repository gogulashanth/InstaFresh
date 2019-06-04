module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "airbnb",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "settings": {
        "import/resolver": {
            "node": {
                "paths": ["library"],
            }
        }
    },
    "rules": {
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "no-underscore-dangle": [2, { "allowAfterThis": true }],
        "react/prefer-stateless-function": "off",
        "react/no-multi-comp": "off",
        "no-else-return": "off",
        "no-use-before-define": ["error", { "variables": false }],
        "import/no-unresolved": "off",
    },
    
};