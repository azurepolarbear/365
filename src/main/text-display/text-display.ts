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
}

export class TextDisplay implements CanvasRedrawListener {
    readonly #TEXT: string;
    readonly #COORDINATE: Coordinate;

    #textSizeMultiplier: number;
    #xAlign: P5Lib.HORIZ_ALIGN;
    #yAlign: P5Lib.VERT_ALIGN;
    #maxWidthRatio: number;
    #textColor: Color;

    public constructor(config: TextDisplayConfig) {
        this.#COORDINATE = new Coordinate();
        this.#COORDINATE.setPosition(config.coordinatePosition, config.coordinateMode);
        this.#TEXT = config.text;
        this.#textSizeMultiplier = config.textSizeMultiplier;
        this.#xAlign = config.xAlign;
        this.#yAlign = config.yAlign;
        this.#maxWidthRatio = config.maxWidthRatio;
        this.#textColor = config.color;
    }

    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.fill(this.#textColor.color);
        p5.textWrap(p5.WORD);
        p5.textAlign(this.#xAlign, this.#yAlign);
        p5.textSize(CanvasContext.defaultStroke * this.#textSizeMultiplier);
        p5.text(
            this.#TEXT,
            this.#COORDINATE.getX(CoordinateMode.CANVAS),
            this.#COORDINATE.getY(CoordinateMode.CANVAS),
            p5.width * this.#maxWidthRatio
        );
    }

    public canvasRedraw(): void {
        this.#COORDINATE.remap();
    }
}
