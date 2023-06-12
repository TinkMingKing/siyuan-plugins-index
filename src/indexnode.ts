export class IndexNode {
    depth: number;
    text: string;
    path:string;
    children: IndexStack;
    constructor(depth: number, text: string) {
        this.depth = depth;
        this.text = text;
        this.children = new IndexStack();
    }
}

export class IndexStack{
    stack: IndexNode[];
    basePath : string;
    notebookId: string;
    pPath:string;
    constructor(){
        this.stack = [];
    }

    push(item: IndexNode){
        return this.stack.push(item);
    }

    pop(){
        return this.stack.pop();
    }

    peek(){
        if(this.stack.length > 0){
            return this.stack[this.stack.length-1]
        }
    }

    clear(){
        this.stack = [];
    }

    isEmpty(){
        return this.stack.length === 0;
    }
}