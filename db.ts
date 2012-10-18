// Mongo
import mongodb = module('mongodb');
console.log("creating server");
var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true}, {})
console.log("creating db");
var db = new mongodb.Db('mydb', server, {safe:true});



//export function openDB(callback:() => void) {
//    db.open(function() {
//        console.log("db started");
//        callback(); 
//        console.log("done");
//    });
//}
export function getEvents(entityid: string, callback: (events: string[]) => void) {
   db.collection('events', function(error, eventCollection) {
       if(error) { 
           console.error(error); 
           return; 
       }

       console.log("try reading .. " + entityid);
       eventCollection.findOne({_id: entityid}, function(error, result) {
          if(error) { 
              console.error(error); 
              return; 
          }

       //   console.log(result);

          callback(result.events);
       });
   });
}



export function addEvents(entityId: string, events: string[] , callback: () => void) {

 //  console.log("trying to save events for " + entityId);

   db.collection('events', function(error, eventCollection) {
       if(error) { 
           console.error(error); return; 
       }
//       console.log("saving events for " + entityId);
       eventCollection.insert({ _id: entityId, events:  events },
           function(error, result) {
               if(error) { 
                   console.error(error); return; 
               }
//               console.log("saved events for " + entityId);
               callback();
           }
       );
   });
}


export function close() {
   db.close();
}