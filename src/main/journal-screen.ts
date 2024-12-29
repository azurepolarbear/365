import P5Lib from 'p5';

import { CanvasContext, CanvasScreen, CoordinateMode, P5Context } from "@batpb/genart";
import { DateDisplay, DateDisplayConfig } from './date-display';

export class JournalScreen extends CanvasScreen {
    readonly #DATE: Date;
    readonly #DATE_DISPLAY: DateDisplay;
    
    // #journalEntry: string = '';
    // #username: string = '';
    // #dateGraph: unknown = null;
    
    public constructor() {
        super('journal-screen');
        const p5: P5Lib = P5Context.p5;
        this.#DATE = new Date();
        
        const dateDisplayConfig: DateDisplayConfig = {
            date: this.#DATE,
            coordinatePosition: p5.createVector(0.1, 0.1),
            coordinateMode: CoordinateMode.RATIO
        }

        this.#DATE_DISPLAY = new DateDisplay(dateDisplayConfig);
        this.addRedrawListener(this.#DATE_DISPLAY);
    }
    
    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.background(220);
        this.#DATE_DISPLAY.draw();
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

    }
}
