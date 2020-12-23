export function repeatPrintArray(array: Array<any>) {
  if (array != null) {
    for (let i = 0; i < array.length; i++) {
      console.log(array[i]);
    }
  }
}
