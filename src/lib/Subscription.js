export default class Subscription {
  constructor( box, handler ) {
    this.id = "#" + Math.floor( Math.random()*16777215 ).toString( 16 );
    this.box = box;
    this.handler = handler;
  }
}