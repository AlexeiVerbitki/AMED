import { animate, state, style, transition, trigger } from '@angular/animations';

export const fadeTrigger = trigger('fadeTrigger', [
  state('show', style({
    opacity: 1
  })),
  transition('void => show', [
    style({
      opacity: 0
    }),
    animate(150, style({
      opacity: 1
    }))
  ]),
  transition('show => void', animate(150, style({
    opacity: 0
  })))
]);
