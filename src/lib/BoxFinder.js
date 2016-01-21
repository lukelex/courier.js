import ReceiverIterator from './ReceiverIterator';
import { stringify } from './helpers';

export default class BoxFinder {
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
