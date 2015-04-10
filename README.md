#Courier.js

Simple and flexible pub-sub for JavaScript.

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

// By default, an exception will be thrown if the specified
// receiver isn't found. To avoid this set throwOnMissing: false
courier.send("new-message", {
  your: "delegation"
}, {throwOnMissing: false});

// Regular Expressions can also be used as both `receiver` and
// `sender` identifiers
courier.send(/[Aa]\s(regex)?\ssender/, {
  your: "message"
});

courier.receive(/[Aa]\s(regex)?\sreceiver/, function(msg){
  ...
});
```

###Unsubscribe

Courier allows you to unsubscribe to any message with the given
receiver returned function, like so:

```javascript
var unsubscribe = courier.receive("one-time-receiver", function(msg){
  // do some work
  unsubscribe(); // this will tell courier to remove this
receiver
});
```
