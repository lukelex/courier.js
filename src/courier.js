(function( window ){
  class Courier {
    constructor() {
      this.subscriptions = {};
    }

    receive( box, opener ) {
      var subscription = createSubscription({
        box: stringify( box ), opener: opener
      });

      this.subscriptions[ box ] = ( this.subscriptions[ box ] || [] );
      this.subscriptions[ box ].push( subscription );

      return unsubscribe.bind( this, subscription );
    }

    send( box, message, options, callback ) {
      callback = is( options, "Function" ) ? options : ( callback || function(){} );
      options = is( options, "Object" ) ? options : { throwOnMissing: true };

      new BoxFinder( this.subscriptions )
        .withName( "all", andPassAlongThe( box, callback ) )
        .dispatch( box, { throwOnMissing: false } )
        .withName( box, andPassAlongThe( message, callback ) )
        .dispatch( box, options );
    }

    reset() { this.subscriptions = {}; }
  }

  class BoxFinder {
    constructor( subscriptions ) {
      this.subscriptions = subscriptions;
    }

    withName( box, callback ) {
      var senderPattern = new RegExp( box ),
          receiverPattern,
          receivers = [];

      for ( var name in this.subscriptions ) {
        receiverPattern = new RegExp( stringify( name ) );

        if ( senderPattern.exec( stringify( name ) ) || receiverPattern.exec( stringify( box ) ) ) {
          receivers.push( this.subscriptions[ name ] );
        }
      }

      return new ReceiverIterator(receivers, callback, this);
    }
  }

  class ReceiverIterator {
    constructor( receivers, callback, context ) {
      this.receivers = receivers;
      this.callback = callback;
      this.context = context;
    }

    dispatch( box, options ) {
      if ( this.receivers.length === 0 && options.throwOnMissing === true ) {
        throw "Courier: No receiver registered for '" + box + "'";
      }

      this.receivers.forEach( ( receiver ) => {
        this.callback( receiver );
      });

      return this.context;
    }
  }

  function unsubscribe( subscription ){
    this.subscriptions[ subscription.box ] =
      this.subscriptions[ subscription.box ].filter( function( subs ){
        return subs.id !== subscription.id;
      });

    if ( this.subscriptions[ subscription.box ].length === 0 ) {
      delete this.subscriptions[ subscription.box ];
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

  function andPassAlongThe( message, callback ){
    var results = [];

    return function( openers ){
      var i = openers.length;

      while ( i-- ) {
        results.push( openers[ i ].opener( message ) );
      }

      return callback( results );
    }
  }

  function is( func, type ) {
    return func && {}.toString.call(func) === "[object " + type + "]";
  }

  window.Courier = Courier;
})( window );
