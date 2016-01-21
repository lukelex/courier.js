import Subscription from './lib/Subscription';
import BoxFinder from './lib/BoxFinder';

function unsubscribe( subscription ) {
  this.subscriptions[ subscription.box ] =
    this.subscriptions[ subscription.box ].filter( function( subs ) {
      return subs.id !== subscription.id;
    });

  if ( this.subscriptions[ subscription.box ].length === 0 ) {
    delete this.subscriptions[ subscription.box ];
  }
}

function andPassAlongThe( message, callback ) {
  const results = [];

  return function( subscriptions ) {
    subscriptions.forEach( function( subscription ) {
      results.push( subscription.handler( message ) );
    });

    return callback( results );
  }
}

function is( func, type ) {
  return func && {}.toString.call(func) === "[object " + type + "]";
}

export default class Courier {
  constructor() {
    this.subscriptions = {};
  }

  receive( box, opener ) {
    var subscription = new Subscription( box, opener );

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
