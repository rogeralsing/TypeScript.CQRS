/// <reference path="Weaver.ts"/>

import cqrs = module('CQRS');

class Person extends cqrs.CQRS.AggregateRoot {
	
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
