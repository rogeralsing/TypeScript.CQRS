module CQRS {
    export class AggregateRoot {
        events: string[];

        constructor () {
            this.events = new string[];
        }

        store(event: string) {
            this.events.push(event);
        }

        public getEvents() {
            return this.events;
        }

        public replayEvents(events: string[]) {
            for (var i = 0; i < events.length; i++) {
                //
            }
        }
    }
}