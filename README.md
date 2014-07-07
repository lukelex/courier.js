#Courier.js

Simple pub-sub for JavaScript.

##Using it
```javascript
var courier = new Courier();

// subscribing to a message
courier.receive("new-message", function(msg){
  // do something with the message
  ...
});

// sending a new message
// the first parameter is the message identifier
// the second parameter can be anything
// and will just be forwarded to the receiver
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

###Unsubscribe

Courier allows you to unsubscribe to any message with the given receiver returned function, like so:

```javascript
var unsubscribe = courier.receive("one-time-receiver", function(msg){
  // do something and unsubscribe
  unsubscribe() // this will notofy courier to remove this hook
});
```
