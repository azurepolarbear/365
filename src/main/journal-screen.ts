import P5Lib from 'p5';

import { CanvasScreen, P5Context } from "@batpb/genart";

export class JournalScreen extends CanvasScreen {
    readonly #DATE: Date;
    
    // #journalEntry: string = '';
    // #username: string = '';
    #dateString: string = '';
    // #dateGraph: unknown = null;
    
    public constructor() {
        super('journal-screen');
        this.#DATE = new Date();
        this.#dateString = this.#DATE.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    
    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.background(255);
        p5.fill(0);
        p5.text(this.#dateString, 100, 100);
    }

    public keyPressed(): void {

    }

    public mousePressed(): void {

    }
}
