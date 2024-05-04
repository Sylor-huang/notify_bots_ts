"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
// 定义 NotiFyBot 类型
class NotiFyBot {
    constructor(url, secret_key) {
        this.webhookUrl = url;
        this.secret_key = secret_key;
    }
    sign(timestamp) {
        const hmac = crypto_1.default.createHmac('sha256', `${timestamp}\n${this.secret_key}`);
        return hmac.digest('base64');
    }
    post(data) {
        if (this.secret_key) {
            const timestamp = Math.floor(Date.now() / 1000);
            data.timestamp = timestamp;
            data.sign = this.sign(timestamp);
        }
        return axios_1.default.post(this.webhookUrl, data, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        })
            .then(res => res.data)
            .catch(error => {
            console.error('Error:', error);
            throw error;
        });
    }
    // 方法定义使用 TypeScript 中的类型注释来提高代码清晰度和可维护性
    sendText(text) {
        return this.post({
            msg_type: "text",
            content: { text }
        });
    }
    sendRich(content) {
        return this.post({
            msg_type: "post",
            content: { post: { zh_cn: content } }
        });
    }
}
exports.default = NotiFyBot;
