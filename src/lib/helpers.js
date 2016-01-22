export function stringify( name ) {
  return name.toString().replace( /(^\/|\/$)/g, "" );
}
