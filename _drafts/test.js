function fn (a) {
  a.bbb = 2
  return a
}
let a  = {

}
console.log(a)
console.log(fn(a))