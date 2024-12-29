import P5Lib from 'p5';

import { CanvasContext, CanvasScreen, CoordinateMode, P5Context } from '@batpb/genart';
import { TextDisplay, TextDisplayConfig } from './text-display';

export class JournalScreen extends CanvasScreen {
    readonly #DATE: Date;
    readonly #DATE_STRING: string;
    readonly #DATE_DISPLAY: TextDisplay;
    readonly #NAME_DISPLAY: TextDisplay;

    // #journalEntry: string = '';
    #username: string = '';
    // #dateGraph: unknown = null;

    public constructor(username: string) {
        super('journal-screen');
        const p5: P5Lib = P5Context.p5;
        this.#DATE = new Date();
        this.#DATE_STRING = this.#DATE.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        const dateDisplayConfig: TextDisplayConfig = {
            text: this.#DATE_STRING,
            textSizeMultiplier: 20,
            xAlign: p5.LEFT,
            yAlign: p5.TOP,
            coordinatePosition: p5.createVector(0.1, 0.1),
            coordinateMode: CoordinateMode.RATIO,
            maxWidthRatio: 0.8
        };

        this.#DATE_DISPLAY = new TextDisplay(dateDisplayConfig);
        this.addRedrawListener(this.#DATE_DISPLAY);

        this.#username = username;
        const nameDisplayConfig: TextDisplayConfig = {
            text: this.#username,
            textSizeMultiplier: 18,
            xAlign: p5.RIGHT,
            yAlign: p5.BOTTOM,
            coordinatePosition: p5.createVector(0.1, 0.9),
            coordinateMode: CoordinateMode.RATIO,
            maxWidthRatio: 0.8
        };
        this.#NAME_DISPLAY = new TextDisplay(nameDisplayConfig);
        this.addRedrawListener(this.#NAME_DISPLAY);
    }

    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.background(220);
        this.#DATE_DISPLAY.draw();
        this.#NAME_DISPLAY.draw();
    }

    public keyPressed(): void {
        const p5: P5Lib = P5Context.p5;

        if (p5.key === '0') {
            CanvasContext.updateResolution(720);
        } else if (p5.key === '9') {
            CanvasContext.updateResolution(1080);
        }
    }

    public mousePressed(): void {
        console.log('mouse pressed');
    }
}
