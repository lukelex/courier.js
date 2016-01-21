import { stringify } from './helpers';

export default class Subscription {
  constructor( box, handler ) {
    this.id = "#" + Math.floor( Math.random()*16777215 ).toString( 16 );
    this.box = stringify( box );
    this.handler = handler;
  }
}