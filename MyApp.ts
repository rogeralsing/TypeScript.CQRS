
import weaver = module("Weaver");
import cqrs = module("CQRS");
import db = module("db");

class Person extends cqrs.CQRS.AggregateRoot {
	
    private firstname: string;
    private lastname: string;
    private age: number;

    constructor() {
       super();
    }
	
    public rename(newName: string) {
        if (newName == null || newName.length < 1)
            throw "";

        this.renamedEvent(newName);
    }
	
    private renamedEvent(newName: string) {
        this.firstname = newName;
    }

    public sayHello() {
        this.saidHelloEvent();
    }

    private saidHelloEvent() {      
    }

    public growOlder() {
        this.AgedEvent();
    }

    private AgedEvent() {
        this.age++;
    }
}

weaver.Weaver.makeInterceptType(Person);


function createPerson() {
    var b = new Person();

    b.rename("Roger");
    b.sayHello();
    b.growOlder();
    b.growOlder();

    var events = b.getEvents();

    db.addEvents("1", events, function 
    {
        db.close();
    });

}

function readPerson() {
    db.getEvents("1", events =>
    {
        for (var i = 0; i < events.length; i++)
        console.log("event found " + events[i]);

    var c = new Person();
    c.replayEvents(events, true);
        db.close();
    });    
}

//createPerson();
readPerson();