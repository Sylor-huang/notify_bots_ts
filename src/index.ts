import * as crypto from 'crypto';
import axios from 'axios';

// 定义接口来描述通知数据和响应结构
interface NotifyData {
  msg_type: string;
  content: any;
  timestamp?: number;
  sign?: string;
}

interface NotifyResponse {
  data: any;
}

// 定义 NotiFyBot 类型
export default class NotiFyBot {
  private webhookUrl: string;
  private secret_key: string;

  constructor(url: string, secret_key: string) {
    this.webhookUrl = url;
    this.secret_key = secret_key;
  }

  private sign(timestamp: number): string {
    const hmac = crypto.createHmac('sha256', `${timestamp}\n${this.secret_key}`);
    return hmac.digest('base64');
  }

  private post(data: NotifyData): Promise<NotifyResponse> {
    if (this.secret_key) {
      const timestamp = Math.floor(Date.now() / 1000);
      data.timestamp = timestamp;
      data.sign = this.sign(timestamp);
    }

    return axios.post(this.webhookUrl, data, {
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
  sendText(text: string): Promise<any> {
    return this.post({
      msg_type: "text",
      content: { text }
    });
  }

  sendRich(content: any[]): Promise<any> {
    return this.post({
      msg_type: "post",
      content: { post: { zh_cn: content } }
    });
  }
}
