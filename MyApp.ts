
import weaver = module("Weaver");
import cqrs = module("CQRS");
import db = module("db");


enum OrderStatus {
    Created,
    Confirmed,
    Shipped,
}

class OrderDetail {
    constructor (
        public productId: number,
        public quantity: number,
        public price: number) { }
}

class Order extends cqrs.CQRS.AggregateRoot {

    private details: OrderDetail[];
    private status: OrderStatus;
    private foo: string = "hej";
    constructor() {        
       super();
       this.details = new OrderDetail[];
       console.log(this.details.length);
    }

    public ship() {
        this.orderShippedEvent();
    }

    private orderShippedEvent() {
        this.status = OrderStatus.Shipped;
    }


    public addProduct(productId: number, quantity: number, price: number) {
        this.productAddedEvent(productId, quantity, price);
    }

    private productAddedEvent(productId: number, quantity: number, price: number) {
        this.details.push(new OrderDetail(productId, quantity, price));            
       // console.log("foo is = " + this.foo);
    }
}

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
weaver.Weaver.makeInterceptType(Order);


function createPerson() {
    var b = new Person();

    b.rename("Roger");
    b.sayHello();
    b.growOlder();
    b.growOlder();

    var events = b.getEvents();

    db.addEvents("2", events, function 
    {
        db.close();
    });
}

function readPerson() {
    db.getEvents("2", events =>
    {
        for (var i = 0; i < events.length; i++)
        console.log("event found " + events[i]);

    var c = new Person();
    var snapshot = JSON.stringify(c);
    console.log(snapshot);

    c.replayEvents(events, true);
        db.close();
    });    
}

var order = new Order();
order.addProduct(123, 22, 666);
order.addProduct(222, 1, 55);
order.addProduct(333, 2, 33);
order.ship();

//var events = order.getEvents();

//db.addEvents("3", events, function 
//    {
//        db.close();
//    });

//createPerson();
//readPerson();