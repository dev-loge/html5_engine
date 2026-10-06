

export class NetworkManager {
    constructor() {
        this.socket = null;
        this.status = 'disconnected';
        this.handlers = new Map(); //message type -> array of functions
        this.queue = [];
    }

    async connect(url) {
        return new Promise((resolve) => {
            this.socket = new WebSocket(url);
            this.status = 'connecting';

            this.socket.onopen = () => {
                this.status = 'connected';
                resolve(true);
            }
            this.socket.onclose = () => {
                this.status = 'disconnected';
            }
            this.socket.onerror = () => {
                this.status = 'failed';
                resolve(false);
            }
            this.socket.onmessage = (event) => {
                try {
                    var message = JSON.parse(event.data);
                    this.queue.push(message);
                } catch (e) {
                    console.error('Failed to parse message', e);
                }
            }

            setTimeout(() => {
                if (this.status === 'connecting') {
                    this.status = 'failed';
                    this.socket.close();
                    resolve(false);
                }
            }, 5000);
        });
    }

    get connected() {
        return this.status === 'connected';
    }

    send(type, data) {
        if (this.connected) {
            this.socket.send(JSON.stringify({ type, data }));
            return true
        } else {
            return false;
        }
    }

    on(type, fn) {
        if (!this.handlers.has(type)) {
            this.handlers.set(type, []);
        }
        this.handlers.get(type).push(fn);
    }

    off(type, fn) {
        var list = this.handlers.get(type);
        if (!list) return;
        this.handlers.set(type, list.filter(fnItem => fnItem !== fn));
    }

    update() {
        while (this.queue.length > 0) {
            var message = this.queue.shift()
            var list = this.handlers.get(message.type);
            if (!list) continue;
            for (var fn of list) {
                try {
                    fn(message.data);
                } catch (e) {
                    console.error('Failed to handle message', e);
                }
            }
        }
    }
}
