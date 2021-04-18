/* eslint-disable no-console */
export default function logger(obj) {
  console.log(obj);
  return function (...args) {
    console.log(args);
  };
}
