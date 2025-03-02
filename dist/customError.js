"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
const common_1 = require("@nestjs/common");
class CustomError extends common_1.HttpException {
    constructor(message) {
        super(message, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.CustomError = CustomError;
//# sourceMappingURL=customError.js.map