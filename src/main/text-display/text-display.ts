import P5Lib from 'p5';

import { CanvasContext, CanvasRedrawListener, Color, Coordinate, CoordinateMode, P5Context } from '@batpb/genart';

export interface TextDisplayConfig {
    text: string;
    textSizeMultiplier: number;
    xAlign: P5Lib.HORIZ_ALIGN;
    yAlign: P5Lib.VERT_ALIGN;
    coordinatePosition: P5Lib.Vector;
    coordinateMode: CoordinateMode;
    maxWidthRatio: number;
    color: Color;
    font: string;
}

export class TextDisplay implements CanvasRedrawListener {
    readonly #TEXT: string;
    readonly #COORDINATE: Coordinate;
    readonly  #X_ALIGN: P5Lib.HORIZ_ALIGN;
    readonly #Y_ALIGN: P5Lib.VERT_ALIGN;
    readonly #TEXT_SIZE_MULTIPLIER: number;
    readonly #MAX_WIDTH_RATIO: number;
    readonly #FONT: string;
    readonly #TEXT_COLOR: Color;


    public constructor(config: TextDisplayConfig) {
        this.#COORDINATE = new Coordinate();
        this.#COORDINATE.setPosition(config.coordinatePosition, config.coordinateMode);
        this.#TEXT = config.text;
        this.#TEXT_SIZE_MULTIPLIER = config.textSizeMultiplier;
        this.#X_ALIGN = config.xAlign;
        this.#Y_ALIGN = config.yAlign;
        this.#MAX_WIDTH_RATIO = config.maxWidthRatio;
        this.#TEXT_COLOR = config.color;
        this.#FONT = config.font;
    }

    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.fill(this.#TEXT_COLOR.color);
        p5.textFont(this.#FONT);
        p5.textWrap(p5.WORD);
        p5.textAlign(this.#X_ALIGN, this.#Y_ALIGN);
        p5.textSize(CanvasContext.defaultStroke * this.#TEXT_SIZE_MULTIPLIER);
        p5.text(
            this.#TEXT,
            this.#COORDINATE.getX(CoordinateMode.CANVAS),
            this.#COORDINATE.getY(CoordinateMode.CANVAS),
            p5.width * this.#MAX_WIDTH_RATIO
        );
    }

    public canvasRedraw(): void {
        this.#COORDINATE.remap();
    }
}
