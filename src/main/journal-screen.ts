import P5Lib from 'p5';

import { ALL_PALETTE_COLORS, CanvasContext, CanvasScreen, Color, ColorContrastAssessor, ContrastFontSize, ContrastStandard, CoordinateMode, P5Context, PaletteColor, Random, StringMap } from '@batpb/genart';
import { TextDisplay, TextDisplayConfig } from './text-display';

export class JournalScreen extends CanvasScreen {
    readonly #DATE: Date;
    readonly #DATE_STRING: string;
    readonly #DATE_DISPLAY: TextDisplay;
    readonly #NAME_DISPLAY: TextDisplay;

    readonly #BACKGROUND_COLOR: Color;
    readonly #TEXT_COLOR: Color;

    readonly #HEX_MAP: StringMap<string[]> = new StringMap<string[]>();

    // #journalEntry: string = '';
    #username: string = '';
    // #dateGraph: unknown = null;

    public constructor(username: string) {
        super('journal-screen');
        const p5: P5Lib = P5Context.p5;
        this.#DATE = new Date();
        this.#DATE_STRING = this.#DATE.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        this.#populateHexMap();
        const colors = Array.from(this.#HEX_MAP.keys);
        const backgroundColorHex = Random.randomElement(colors) ?? '#FFFFFF';
        const textColors = this.#HEX_MAP.get(backgroundColorHex) ?? ['#000000'];
        const textColorHex = Random.randomElement(textColors) ?? '#000000';

        this.#BACKGROUND_COLOR = new Color(p5.color(backgroundColorHex));
        this.#TEXT_COLOR = new Color(p5.color(textColorHex));

        const dateDisplayConfig: TextDisplayConfig = {
            text: this.#DATE_STRING,
            textSizeMultiplier: 20,
            xAlign: p5.LEFT,
            yAlign: p5.TOP,
            coordinatePosition: p5.createVector(0.1, 0.1),
            coordinateMode: CoordinateMode.RATIO,
            maxWidthRatio: 0.8,
            color: this.#TEXT_COLOR
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
            maxWidthRatio: 0.8,
            color: this.#TEXT_COLOR
        };
        this.#NAME_DISPLAY = new TextDisplay(nameDisplayConfig);
        this.addRedrawListener(this.#NAME_DISPLAY);

        console.log(`background color: ${this.#BACKGROUND_COLOR.name}`);
        console.log(`text color: ${this.#TEXT_COLOR.name}`);
    }

    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.background(this.#BACKGROUND_COLOR.color);
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

    #populateHexMap(): void {
        const colorsArray: PaletteColor[] = Array.from(ALL_PALETTE_COLORS.values);

        for (let i = 0; i < colorsArray.length; i++) {
            const pc_A = colorsArray[i];
            const hex_A: string = pc_A.HEX;

            for (let j = i + 1; j < colorsArray.length; j++) {
                const pc_B = colorsArray[j];
                const hex_B: string = pc_B.HEX;

                if (hex_A !== hex_B) {
                    if (ColorContrastAssessor.meetsContrastStandard(pc_A, pc_B, ContrastStandard.AAA, ContrastFontSize.LARGE)) {
                        if (this.#HEX_MAP.hasKey(hex_A)) {
                            this.#HEX_MAP.get(hex_A)?.push(hex_B);
                        } else {
                            this.#HEX_MAP.setUndefinedKey(hex_A, [hex_B]);
                        }

                        if (this.#HEX_MAP.hasKey(hex_B)) {
                            this.#HEX_MAP.get(hex_B)?.push(hex_A);
                        } else {
                            this.#HEX_MAP.setUndefinedKey(hex_B, [hex_A]);
                        }
                    }
                }
            }
        }

        console.log(this.#HEX_MAP);
    }
}
