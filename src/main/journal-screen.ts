import { CanvasScreen } from "@batpb/genart";

export class JournalScreen extends CanvasScreen {
    #journalEntry: string = '';
    #username: string = '';
    #dateString: string = '';
    #dateGraph: unknown = null;
    
    public constructor() {
        super('journal-screen');
    }
    
    public draw(): void {

    }

    public keyPressed(): void {

    }

    public mousePressed(): void {

    }
}
