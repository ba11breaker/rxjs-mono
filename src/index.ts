import { fromEvent } from "rxjs";

const button = document.getElementById("myButton");
const myObservable$ = fromEvent(button, 'click');

const subscription = myObservable$.subscribe(
  // console.log
);