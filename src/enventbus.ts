class EventBus {
    private events: {};
    constructor() {
        this.events = {};
    }

    on(event: any, listener: any) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    off(event: any, listener: any) {
        if (!this.events[event]) {
            return;
        }
        const index = this.events[event].indexOf(listener);
        if (index >= 0) {
            this.events[event].splice(index, 1);
        }
    }

    emit(event: any, ...args: any[]) {
        if (!this.events[event]) {
            return;
        }
        this.events[event].forEach((listener:any) => {
            listener.apply(this, args);
        });
    }

    once(event: any, listener: any){
        function callback(...args: any[]){
            listener.apply(this, args);
            this.off(event,callback);
        }
        this.on(event,callback);
    }
}

export let eventBus = new EventBus();