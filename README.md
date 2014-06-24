#Courier.js

Simple pub-sub for JavaScript

Enables a controller/behavior to send and receive messages from another controller/behavior.

##Using it
```javascript
var courier = new Courier();

// subscribing to a message
courier.receive("new-message", function(msg){
  // do something with the message
  ...
});

// send a new message
// can be either a String or a JS Object (POJO)
courier.send("new-message", {
  your: "message"
});

// to avoid an exeception while sending messages
// not yet defined receivers set throwOnMissing: false
courier.send("new-message", {
  your: "delegation"
}, {throwOnMissing: false});

// you can also subscribe and send with Regular expressions

courier.send(/[Aa]\s(regex)?\ssender/, {
  your: "message"
});

courier.receive(/[Aa]\s(regex)?\sreceiver/, function(msg){
  ...
});
```
