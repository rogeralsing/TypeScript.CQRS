
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
    }
}

class OrderRepository extends  cqrs.CQRS.Repository {
    public findById(entityId: string, callback : (order:Order) => void ) {       
        this.findAggregateById(Order, entityId, callback);
    }
}

weaver.Weaver.makeInterceptType(Order);

var repo = new OrderRepository();
repo.findById("3", o => {

    o.addProduct(777, 333, 444);
    repo.save(o, () =>
    {
        db.close();
        console.log("done");
    });
});
