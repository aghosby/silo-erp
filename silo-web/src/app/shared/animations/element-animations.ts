import {
    trigger,
    transition,
    style,
    animate,
    query,
    stagger,
    animation,
    useAnimation,
    AnimationTriggerMetadata
} from '@angular/animations';

/**
 * Base item animations (reusable)
 */
export const fadeInItem = animation([
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('{{ duration }}ms {{ easing }}',
            style({ opacity: 1, transform: 'translateY(0)' })
        )
    ], {
    params: {
        duration: 250,
        easing: 'ease-out'
    }
});

export const scaleInItem = animation([
    style({ opacity: 0, transform: 'scale(0.95)' }),
    animate(
        '{{ duration }}ms {{ easing }}',
        style({ opacity: 1, transform: 'scale(1)' })
    )], 
    {
        params: {
            duration: 200,
            easing: 'ease-out'
        }
    }
);


/**
 * Stagger Fade In List
*/
export function staggerFadeIn(staggerTime = 80, delay = 0): AnimationTriggerMetadata {
    return trigger('staggerFadeIn', [
        transition(':enter', [
            query(':enter', [
                style({ opacity: 0 }),
                stagger(staggerTime, [
                    animate('250ms ease-out', style({ opacity: 1 }))
                ])
            ],
            { optional: true }),
            animate(`${delay}ms`, style({}))
        ])
    ]);
}

/**
 * Stagger Slide + Fade (Top → Bottom)
*/
export function staggerSlideFade(staggerTime = 80, delay = 0): AnimationTriggerMetadata {
    return trigger('staggerSlideFade', [
        transition(':enter', [
            animate(`${delay}ms`, style({})),
            query(
                ':enter', [
                    style({ opacity: 0, transform: 'translateY(15px)' }),
                    stagger(staggerTime, [
                        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
                    ])
                ],
                { optional: true }
            )
        ])
    ]);
}

/**
 * Stagger Scale In
*/
export function staggerScaleIn(staggerTime = 60, delay = 0): AnimationTriggerMetadata {
    return trigger('staggerScaleIn', [
        transition(':enter', [
            animate(`${delay}ms`, style({})),
            query(':enter', [
                style({ opacity: 0, transform: 'scale(0.9)' }),
                stagger(staggerTime, [
                    animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
                ])],
                { optional: true }
            )
        ])
    ]);
}
