import P5Lib from "p5";

import { CanvasContext, CanvasRedrawListener, Coordinate, CoordinateMode, P5Context } from "@batpb/genart";

export interface DateDisplayConfig {
    date: Date;
    coordinatePosition: P5Lib.Vector;
    coordinateMode: CoordinateMode;
}

export class DateDisplay implements CanvasRedrawListener {
    readonly #DATE: Date;
    
    #coordinate: Coordinate;
    #dateString: string;

    public constructor(config: DateDisplayConfig) {
        this.#coordinate = new Coordinate();
        this.#coordinate.setPosition(config.coordinatePosition, config.coordinateMode);
        this.#DATE = config.date;
        this.#dateString = this.#DATE.toLocaleDateString('en-us', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.fill(0);
        p5.textSize(CanvasContext.defaultStroke * 20);
        p5.text(this.#dateString,
                this.#coordinate.getX(CoordinateMode.CANVAS),
                this.#coordinate.getY(CoordinateMode.CANVAS));
    }

    public canvasRedraw(): void {
        this.#coordinate.remap();
    }
}
