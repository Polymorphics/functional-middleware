"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplicationMiddleware = void 0;
const application_1 = require("./application");
const createApplicationMiddleware = (application = (0, application_1.createApplication)()) => Object.assign({
    initializer: (next) => {
        application.ready();
        next();
    },
    handler: (next) => {
        application.process();
        next();
    },
    finalizer: (next) => {
        application.close();
        next();
    },
}, application);
exports.createApplicationMiddleware = createApplicationMiddleware;
//# sourceMappingURL=application-middleware.js.map