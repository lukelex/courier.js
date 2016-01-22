function stringify( name ) {
  return name.toString().replace( /(^\/|\/$)/g, "" );
}

export default { stringify };
