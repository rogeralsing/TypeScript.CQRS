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

           if (result == null || result.events == null)
               callback([]);
           else
                callback(result.events);
       });
   });
}



    export function addEvents(entityId: string, events: string[] , callback: () => void) {

       db.collection('events', function(error, eventCollection) {
           if(error) { 
               console.error(error); return; 
           }
           eventCollection.update({ _id: entityId }, { $pushAll : { events: events } }, {upsert: true},
               function(error, result) {
                   if(error) { 
                       console.error(error); return; 
                   }
                   callback();
               });
       });
    }


export function close() {
   db.close();
}