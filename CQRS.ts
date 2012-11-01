export module CQRS {

    export class Repository {
        constructor () {
        }
    }

    export class AggregateRoot {
        
        public _id: string;
        private events: string[];

        constructor () {
            this.clearEvents();
            this._id = "";
        }

        store(event: string) {
            this.events.push(event);
        }

        public getEvents() {
            return this.events;
        }

        public clearEvents() {
            this.events = new string[];
        }

        public replayEvents(replayEvents: string[],debug=false) {
            for (var i = 0; i < replayEvents.length; i++) {
                var event = replayEvents[i];
                var eventObject = JSON.parse(event);

                if (debug)
                    console.log("replaying event : " + event);

                for (var prop in eventObject) {
                    var fullEventName = prop.toString();
                    var eventMethodName = fullEventName.split(".")[1];
                    var args = eventObject[fullEventName];

                    var args2 = [];
                    for(var arg in args)
                        args2.push(args[arg]);

                    this[eventMethodName].apply(this, args2);
                    break; //should only be one prop in serialized event
                }
            }
        }
    }
}