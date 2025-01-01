/*
 * Copyright (C) 2024 brittni and the polar bear LLC.
 *
 * This file is a part of azurepolarbear's 365 algorithmic art project,
 * which is released under the GNU Affero General Public License, Version 3.0.
 * You may not use this file except in compliance with the license.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. See LICENSE or go to
 * https://www.gnu.org/licenses/agpl-3.0.en.html for full license details.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * The visual outputs of this source code are licensed under the
 * Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License.
 * You should have received a copy of the CC BY-NC-ND 4.0 License with this program.
 * See OUTPUT-LICENSE or go to https://creativecommons.org/licenses/by-nc-nd/4.0/
 * for full license details.
 */

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
    readonly #X_ALIGN: P5Lib.HORIZ_ALIGN;
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
        p5.rectMode(p5.CORNER);
        p5.fill(this.#TEXT_COLOR.color);
        p5.noStroke();
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
