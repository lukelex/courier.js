export default class ReceiverIterator {
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
