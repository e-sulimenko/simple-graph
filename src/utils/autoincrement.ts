export function* AutoIncrement(): Generator<number> {
  let i = 1;
  while(true) {
    yield i++;
  }
}
