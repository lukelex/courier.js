import ReceiverIterator from './ReceiverIterator';
import { typeOf } from './helpers';

function testSubscription(senderPattern, receiverPattern) {
  if (typeOf(senderPattern) === typeOf(receiverPattern)) {
    return typeOf(senderPattern) !== 'regexp' && senderPattern === receiverPattern;
  }

  if (typeOf(senderPattern) === 'regexp') {
    return senderPattern.test(receiverPattern);
  }

  if (typeOf(receiverPattern) === 'regexp') {
    return receiverPattern.test(senderPattern);
  }
}

export default class BoxFinder {
  constructor( subscriptions ) {
    this.subscriptions = subscriptions;
  }

  withName( box, callback ) {
    var senderPattern = box,
        receivers = [];

    Object.keys(this.subscriptions).forEach((name) => {
      var receiverPattern = this.subscriptions[ name ].box;

      if (testSubscription(senderPattern, receiverPattern)) {
        receivers.push(this.subscriptions[ name ]);
      }
    });

    return new ReceiverIterator(receivers, callback, this);
  }
}
