// ==========================================================================
// Project:   Courier.js - Simple messaging engine for JavaScript
// Copyright: Copyright 2014 Lukas Alexandre
// License:   Licensed under MIT license
//            See https://github.com/lukelex/courier.js/blob/master/LICENSE
// ==========================================================================

// Version: 0.3.1 | From: 22-6-2014

(function(window){
  window.Courier = function Courier(){
    var subscriptions = {};

    this.receive = function receive( box, opener ){
      var subscription = createSubscription({
        box: stringify( box ), opener: opener
      });

      subscriptions[ box ] = ( subscriptions[ box ] || [] );
      subscriptions[ box ].push( subscription );

      return unsubscribe.bind( {}, subscription );
    };

    this.send = function send( box, message, options ){
      var i = 0,
          foundAny = false;

      options = options || { throwOnMissing: true };

      fetchSubscriptions( box , function( openers ){
        foundAny = true;
        i = openers.length;
        while ( i-- ) {
          openers[ i ].opener( message );
        }
      });

      if ( !foundAny && options.throwOnMissing === true ) {
        throw "Courier: No receiver registered for '" + box + "'";
      }
    };

    this.reset = function reset() { subscriptions = {}; }

    function fetchSubscriptions( box, callback ){
      var senderPattern = new RegExp( box ),
          receiverPattern;

      for ( var name in subscriptions ) {
        receiverPattern = new RegExp( stringify( name ) )
        if ( senderPattern.exec( stringify( name ) ) ||
             receiverPattern.exec( stringify( box ) ) ) {
          callback( subscriptions[ name ] );
        }
      }
    }

    function unsubscribe( subscription ){
      subscriptions[ subscription.box ] =
      subscriptions[ subscription.box ].filter( function( subs ){
        return subs.id !== subscription.id;
      });

      if ( subscriptions[ subscription.box ].length === 0 ) {
        delete subscriptions[ subscription.box ];
      }
    }

    function createSubscription( spec ){
      spec.id = "#" + Math.floor(
        Math.random()*16777215
      ).toString( 16 );

      return spec;
    }

    function stringify( name ){
      return name.toString()
                 .replace(/(^\/|\/$)/g, "");
    }
  }
})(window);
