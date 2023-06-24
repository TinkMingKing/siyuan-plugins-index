//目录栈类节点
export class IndexStackNode {
    depth: number;
    text: string;
    path: string;
    children: IndexStack;
    constructor(depth: number, text: string) {
        this.depth = depth;
        this.text = text;
        this.children = new IndexStack();
    }
}

//目录栈类
export class IndexStack {
    stack: IndexStackNode[];
    basePath: string;
    notebookId: string;
    pPath: string;
    constructor() {
        this.stack = [];
    }

    push(item: IndexStackNode) {
        return this.stack.push(item);
    }

    pop() {
        return this.stack.pop();
    }

    peek() {
        if (this.stack.length > 0) {
            return this.stack[this.stack.length - 1]
        }
    }

    clear() {
        this.stack = [];
    }

    isEmpty() {
        return this.stack.length === 0;
    }
}

//目录队列节点
export class IndexQueueNode {
    depth: number;
    text: string;
    children: IndexQueue;
    constructor(depth: number, text: string) {
        this.depth = depth;
        this.text = text;
        this.children = new IndexQueue();
    }
}

//目录队列
export class IndexQueue {

    queue: IndexQueueNode[];

    constructor() {
        this.queue = [];
    }

    push(item: IndexQueueNode) {
        return this.queue.push(item);
    }

    pop() {
        return this.queue.shift();
    }

    getFront() {
        return this.queue[0];
    }
    getRear() {
        return this.queue[this.queue.length - 1]
    }

    clear() {
        this.queue = [];
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    getSize(){
        return this.queue.length;
    }
}