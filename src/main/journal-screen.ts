import P5Lib from 'p5';

import { ALL_PALETTE_COLORS, CanvasContext, CanvasScreen, Color, ColorContrastAssessor, ContrastFontSize, ContrastStandard, CoordinateMode, P5Context, PaletteColor, Random, StringMap } from '@batpb/genart';
import { TextDisplay, TextDisplayConfig } from './text-display';

export interface JournalScreenConfig {
    username: string;
    day: number;
    month: number;
    year: number;
    journalEntry: string;
    font: string;
    journalFont: string;
}

export class JournalScreen extends CanvasScreen {
    readonly #DATE: Date;
    readonly #DATE_STRING: string;
    readonly #DATE_DISPLAY: TextDisplay;
    readonly #NAME_DISPLAY: TextDisplay;
    readonly #JOURNAL_DISPLAY: TextDisplay;

    // for debugging
    readonly #DEBUG_SEED_DISPLAY: TextDisplay;

    readonly #BACKGROUND_COLOR: Color;
    readonly #TEXT_COLOR: Color;
    readonly #JOURNAL_COLOR: Color;

    readonly #HEX_MAP: StringMap<string[]> = new StringMap<string[]>();

    #username: string = '';
    #journalEntry: string = '';
    // #dateGraph: unknown = null;

    #debugSeed: number;

    public constructor(config: JournalScreenConfig) {
        super('journal-screen');
        const p5: P5Lib = P5Context.p5;
        this.#username = config.username;
        this.#journalEntry = config.journalEntry;
        this.#DATE = new Date(Date.UTC(config.year, config.month - 1, config.day));
        this.#DATE_STRING = this.#DATE.toLocaleDateString('en-us', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        this.#populateHexMap();
        const colors = Array.from(this.#HEX_MAP.keys);
        const backgroundColorHex = Random.randomElement(colors) ?? '#FFFFFF';
        const textColors = this.#HEX_MAP.get(backgroundColorHex) ?? ['#000000'];
        const textColorHex = Random.randomElement(textColors) ?? '#000000';
        const journalColorHex: string = Random.randomElement(textColors) ?? '#000000';

        this.#BACKGROUND_COLOR = new Color(p5.color(backgroundColorHex));
        this.#TEXT_COLOR = new Color(p5.color(textColorHex));
        this.#JOURNAL_COLOR = new Color(p5.color(journalColorHex));
        this.#JOURNAL_COLOR.alpha = 100;

        while (!ColorContrastAssessor.meetsContrastStandard(this.#BACKGROUND_COLOR.hex, this.#RGBAToRGB(this.#JOURNAL_COLOR, this.#BACKGROUND_COLOR), ContrastStandard.AAA, ContrastFontSize.LARGE)) {
            this.#JOURNAL_COLOR.alpha++;
        }

        const dateDisplayConfig: TextDisplayConfig = {
            text: this.#DATE_STRING,
            textSizeMultiplier: 20,
            xAlign: p5.LEFT,
            yAlign: p5.TOP,
            coordinatePosition: p5.createVector(0.1, 0.1),
            coordinateMode: CoordinateMode.RATIO,
            maxWidthRatio: 0.8,
            color: this.#TEXT_COLOR,
            font: config.font
        };
        this.#DATE_DISPLAY = new TextDisplay(dateDisplayConfig);
        this.addRedrawListener(this.#DATE_DISPLAY);

        const nameDisplayConfig: TextDisplayConfig = {
            text: this.#username,
            textSizeMultiplier: 18,
            xAlign: p5.RIGHT,
            yAlign: p5.BOTTOM,
            coordinatePosition: p5.createVector(0.1, 0.9),
            coordinateMode: CoordinateMode.RATIO,
            maxWidthRatio: 0.8,
            color: this.#TEXT_COLOR,
            font: config.font
        };
        this.#NAME_DISPLAY = new TextDisplay(nameDisplayConfig);
        this.addRedrawListener(this.#NAME_DISPLAY);

        const journalDisplayConfig: TextDisplayConfig = {
            text: this.#journalEntry,
            textSizeMultiplier: 14,
            xAlign: p5.RIGHT,
            yAlign: p5.BOTTOM,
            coordinatePosition: p5.createVector(0.1, 0.85),
            coordinateMode: CoordinateMode.RATIO,
            maxWidthRatio: 0.8,
            color: this.#JOURNAL_COLOR,
            font: config.journalFont
        }
        this.#JOURNAL_DISPLAY = new TextDisplay(journalDisplayConfig);
        this.addRedrawListener(this.#JOURNAL_DISPLAY);

        this.#debugSeed = Random.randomInt(0, 1_000_000);
        const debugSeedDisplayConfig: TextDisplayConfig = {
            text: `hash check: ${this.#debugSeed}`,
            textSizeMultiplier: 10,
            xAlign: p5.LEFT,
            yAlign: p5.TOP,
            coordinatePosition: p5.createVector(0.1, 0.95),
            coordinateMode: CoordinateMode.RATIO,
            maxWidthRatio: 0.50,
            color: this.#JOURNAL_COLOR,
            font: config.font
        };
        this.#DEBUG_SEED_DISPLAY = new TextDisplay(debugSeedDisplayConfig);
        this.addRedrawListener(this.#DEBUG_SEED_DISPLAY);

        window.$fx.features({
            'username': this.#username,
            'date': this.#DATE_STRING,
            'background color': this.#BACKGROUND_COLOR.name,
            'text color': this.#TEXT_COLOR.name,
            'journal color': this.#JOURNAL_COLOR.name,
            'font': config.font,
            'journal font': config.journalFont
        });
    }

    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.background(this.#BACKGROUND_COLOR.color);
        this.#DATE_DISPLAY.draw();
        this.#NAME_DISPLAY.draw();
        this.#JOURNAL_DISPLAY.draw();
        // this.#DEBUG_SEED_DISPLAY.draw();
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
        // console.log('mouse pressed');
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

        let totalChoices: number = 0;

        for (const key of this.#HEX_MAP.keys) {
            const choices: string[] = this.#HEX_MAP.get(key) ?? [];
            totalChoices += choices.length;
        }

        // console.log(this.#HEX_MAP);
        // console.log(`total choices: ${totalChoices}`);
    }

    // TODO - Add functionality to @batpb/genart
    #RGBAToRGB(color: Color, background: Color): string {
        // source: https://stackoverflow.com/questions/21576092/convert-rgba-to-hex/21576659#21576659
        // source: https://stackoverflow.com/questions/2049230/convert-rgba-color-to-rgb
        const alphaRatio: number = color.alpha / 255.0;
        const r: number = ((1 - alphaRatio) * background.red) + (alphaRatio * color.red);
        const g: number = ((1 - alphaRatio) * background.green) + (alphaRatio * color.green);
        const b: number = ((1 - alphaRatio) * background.blue) + (alphaRatio * color.blue);
        return (new Color(r, g, b)).hex;
    }
}
