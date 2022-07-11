export function* AutoIncrement(): Generator<number> {
  let i = 0;
  while(true) {
    yield i++;
  }
}
