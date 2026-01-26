import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';

/**
 * Auth Page Initial Stagger
 * Logo → Fields → CTA
 */
export const authPageStagger = trigger('authPageStagger', [
    transition(':enter', [
        query(
        '.anim-item',
        [
            style({
                opacity: 0,
                transform: 'translateY(32px)'
            }),

            stagger(160, [
            animate(
                '5000ms cubic-bezier(0.16, 1, 0.3, 1)', // easeOutCubic
                style({
                    opacity: 1,
                    transform: 'translateY(0)'
                })
            )
            ])
        ],
        { optional: true }
        )

    ])
]);
