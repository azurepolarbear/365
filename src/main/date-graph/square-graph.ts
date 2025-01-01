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

import {
    CanvasRedrawListener,
    Color,
    ColorSelector,
    Coordinate,
    CoordinateMode,
    P5Context,
    Random,
    RandomSelector
} from '@batpb/genart';

import { GraphCellSizeSelection, GraphFillMode } from './graph-categories';

export interface SquareGraphConfig {
    days: number;
    center: P5Lib.Vector;
    coordinateMode: CoordinateMode;
    widthRatio: number;
    heightRatio: number;
    colorSelector: ColorSelector;
    fillMode: GraphFillMode;
    cellSizeSelection: GraphCellSizeSelection;
}

interface CellConfig {
    rowIndex: number;
    columnIndex: number;
    widthRatio: number;
    heightRatio: number;
    sizeMultiplier: number;
    isActive: boolean;
    color: Color;
}

class Cell {
    readonly #WIDTH_RATIO: number;
    readonly #HEIGHT_RATIO: number;
    readonly #ROW_INDEX: number;
    readonly #COLUMN_INDEX: number;
    readonly #COLOR: Color;
    readonly #SIZE_MULTIPLIER: number;

    #isActive: boolean;

    public constructor(config: CellConfig) {
        this.#WIDTH_RATIO = config.widthRatio;
        this.#HEIGHT_RATIO = config.heightRatio;
        this.#ROW_INDEX = config.rowIndex;
        this.#COLUMN_INDEX = config.columnIndex;
        this.#isActive = config.isActive;
        this.#COLOR = config.color;
        this.#COLOR.alpha = Random.randomInt(50, 255);
        this.#SIZE_MULTIPLIER = config.sizeMultiplier;
    }

    public get isActive(): boolean {
        return this.#isActive;
    }

    public draw(cornerX?: number, cornerY?: number): void {
        if (this.#isActive && typeof cornerX === 'number' && typeof cornerY === 'number') {
            const p5: P5Lib = P5Context.p5;
            p5.noStroke();
            p5.fill(this.#COLOR.color);
            p5.rectMode(p5.CENTER);
            const cellWidth: number = this.#WIDTH_RATIO * p5.width;
            const cellHeight: number = this.#HEIGHT_RATIO * p5.height;
            const cellX: number = (cornerX + (cellWidth / 2.0)) + (this.#COLUMN_INDEX * cellWidth);
            const cellY: number = (cornerY + (cellHeight / 2.0)) + (this.#ROW_INDEX * cellHeight);
            p5.rect(cellX, cellY, cellWidth * this.#SIZE_MULTIPLIER, cellHeight * this.#SIZE_MULTIPLIER);
        }
    }

    public activate(): void {
        this.#isActive = true;
    }
}

// TODO - grid size determined by day of the year
// TODO - grid size constant

// TODO - cell size constant

export class SquareGraph implements CanvasRedrawListener {
    readonly #DAYS: number;
    readonly #CENTER: Coordinate = new Coordinate();
    readonly #WIDTH_RATIO: number;
    readonly #HEIGHT_RATIO: number;
    readonly #CELLS: Cell[][] = [];

    #cellWidth: number = 0;
    #cellHeight: number = 0;

    public constructor(config: SquareGraphConfig) {
        const p5: P5Lib = P5Context.p5;
        this.#DAYS = config.days;
        this.#CENTER.setPosition(config.center, config.coordinateMode);
        this.#WIDTH_RATIO = config.widthRatio;
        this.#HEIGHT_RATIO = config.heightRatio;
        this.#cellWidth = (this.#WIDTH_RATIO * p5.width) / this.CELL_COLUMNS;
        this.#cellHeight = (this.#HEIGHT_RATIO * p5.height) / this.CELL_ROWS;

        let cellSizeMultiplier: number = Random.randomFloat(0.5, 1.5);

        for (let i: number = 0; i < this.CELL_ROWS; i++) {
            const row: Cell[] = [];

            for (let j: number = 0; j < this.CELL_COLUMNS; j++) {
                if (config.cellSizeSelection === GraphCellSizeSelection.RANDOM) {
                    cellSizeMultiplier = Random.randomFloat(0.5, 1.5);
                }

                row.push(new Cell({
                    rowIndex: i,
                    columnIndex: j,
                    widthRatio: this.#cellWidth / p5.width,
                    heightRatio: this.#cellHeight / p5.height,
                    sizeMultiplier: cellSizeMultiplier,
                    isActive: false,
                    color: config.colorSelector.getColor()
                }));
            }

            this.#CELLS.push(row);
        }

        if (config.fillMode === GraphFillMode.RANDOM) {
            interface Pair {
                row: number; col: number;
            }

            const pairs: Pair[] = [];

            for (let i: number = 0; i < this.CELL_ROWS; i++) {
                for (let j: number = 0; j < this.CELL_COLUMNS; j++) {
                    pairs.push({ row: i, col: j });
                }
            }

            for (let i: number = 0; i < this.#DAYS; i++) {
                const selector: RandomSelector<Pair> = new RandomSelector<Pair>(pairs);
                const pair: Pair | undefined = selector.getRandomElementAndRemove();

                if (pair) {
                    this.#CELLS[pair.row][pair.col].activate();
                }
            }
        } else {
            for (let i: number = 0; i < this.#DAYS; i++) {
                const row: number = Math.floor(i / this.CELL_COLUMNS);
                const column: number = i % this.CELL_COLUMNS;
                this.#CELLS[row][column].activate();
            }
        }
    }

    get CELL_ROWS(): number {
        return 20;
    }

    get CELL_COLUMNS(): number {
        return 19;
    }

    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        const mode: CoordinateMode = CoordinateMode.CANVAS;
        const x: number = this.#CENTER.getX(mode);
        const y: number = this.#CENTER.getY(mode);
        const width: number = this.#WIDTH_RATIO * p5.width;
        const height: number = this.#HEIGHT_RATIO * p5.height;
        const cornerX: number = x - (width / 2.0);
        const cornerY: number = y - (height / 2.0);

        for (const list of this.#CELLS) {
            for (const cell of list) {
                cell.draw(cornerX, cornerY);
            }
        }
    }

    public canvasRedraw(): void {
        const p5: P5Lib = P5Context.p5;
        this.#CENTER.remap();
        this.#cellWidth = (this.#WIDTH_RATIO * p5.width) / this.CELL_COLUMNS;
        this.#cellHeight = (this.#HEIGHT_RATIO * p5.height) / this.CELL_ROWS;
    }
}
