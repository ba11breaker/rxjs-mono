import { BehaviorSubject, combineLatest, fromEvent, interval, map, scan, startWith, switchMap } from "rxjs";
import { Letters, State } from "./interfaces";

const randomLetter = () => String.fromCharCode(
  Math.random() * ('z'.charCodeAt(0) - 'a'.charCodeAt(0)) + 'a'.charCodeAt(0)
);

const levelChangeThreshold = 20;
const speedAdjust = 50;
const endThreshold = 15;
const gameWidth = 30;

const intervalSubject = new BehaviorSubject<number>(600);


// Generate letters each 600 mini-seconds
const letter$ = intervalSubject.pipe(
  switchMap((i : number) => interval(i).pipe(
      scan<number, Letters>((letters : Letters) => ({
        intrvl: i,
        ltrs: [
          {
            letter: randomLetter(),
            yPos: Math.floor(Math.random() * gameWidth)
          },
          ...letters.ltrs
        ]
      }), {
        ltrs: [], intrvl: 0
      })
    )
  )
);

const keys$ = fromEvent(document, 'keydown')
  .pipe(
    startWith({ ley: ''}),
    map((e: KeyboardEvent) => e.key)
  );

const renderGame = (state: State) => (
  document.body.innerHTML = `Score: ${state.score}, Level: ${state.level} <br/>`,
  state.letters.forEach(l => document.body.innerHTML +=
    '&nbsp'.repeat(l.yPos) + l.letter + '<br/>'),
  document.body.innerHTML +=
  '<br/>'.repeat(endThreshold - state.letters.length - 1) + '-'.repeat(gameWidth)
);
const renderGameOver = () => document.body.innerHTML += '<br/>GAME OVER!';
const noop = () => { };

const game$ = combineLatest(keys$, letter$)
  .pipe(
    scan<[string, Letters], State>((state, [key, letters]) => {

      return {
        score: 0,
        letters: [],
        level: 1
      };
    }, {
      score: 0,
      letters: [],
      level: 1
    })
  )

game$.subscribe({
  next: renderGame,
  error: noop,
  complete: renderGameOver
});


export default () => {};