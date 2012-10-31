export module CQRS {

    export class Repository {
        constructor () {
        }
    }

    export class AggregateRoot {
        
        public _id: string;
        private events: string[];

        constructor () {
            this.events = new string[];
            this._id = "";
        }

        store(event: string) {
            this.events.push(event);
        }

        public getEvents() {
            return this.events;
        }

        public replayEvents(replayEvents: string[],debug=false) {
            for (var i = 0; i < replayEvents.length; i++) {
                var event = replayEvents[i];
                var obj = JSON.parse(event);

                if (debug)
                    console.log("replaying event : " + event);

                for (var prop in obj) {
                    var fullEventName = prop.toString();
                    var shortEventName = fullEventName.split(".")[1];
                    var args = obj[fullEventName];

                    var args2 = [];
                    for(var arg in args)
                        args2.push(args[arg]);

                    this[shortEventName].apply(this, args2);
                    break; //should only be one prop in serialized event
                }
            }
        }
    }
}