export default class NotiFyBot {
    private webhookUrl;
    private secret_key;
    constructor(url: string, secret_key: string);
    private sign;
    private post;
    sendText(text: string): Promise<any>;
    sendRich(content: any[]): Promise<any>;
}
