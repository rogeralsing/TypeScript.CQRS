/// <reference path="Weaver.ts"/>
/// <reference path="CQRS.ts"/>



class Person extends CQRS.AggregateRoot {
	
    private firstname: string;
    private lastname: string;
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
}

Weaver.makeInterceptType(Person);

var b = new Person();

b.rename("Roger");

var events = b.getEvents();

for(var i =0;i<events.length;i++)
	alert( "event found " + events[i]);