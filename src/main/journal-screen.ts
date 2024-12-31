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
    ALL_PALETTE_COLORS,
    CanvasContext,
    CanvasScreen,
    Color,
    ColorContrastAssessor,
    ContrastFontSize,
    ContrastStandard,
    CoordinateMode,
    P5Context,
    PaletteColor,
    Random,
    StringMap
} from '@batpb/genart';
import {TextDisplay, TextDisplayConfig} from './text-display';
import {GraphCellSizeSelection, GraphFillMode, SquareGraph} from "./date-graph";
import {HexColorSelector} from "./hex-color-selector";
import {addNewPaletteColors} from "./palette-colors";

export interface JournalScreenConfig {
    username: string;
    day: number;
    month: number;
    year: number;
    journalEntry: string;
    font: string;
    journalFont: string;
    hasGraph: boolean;
}

export class JournalScreen extends CanvasScreen {
    readonly #DATE: Date;
    readonly #DATE_STRING: string;
    readonly #DATE_DISPLAY: TextDisplay;
    readonly #NAME_DISPLAY: TextDisplay;
    readonly #JOURNAL_DISPLAY: TextDisplay;

    readonly #BACKGROUND_COLOR: Color;
    readonly #TEXT_COLOR: Color;
    readonly #JOURNAL_COLOR: Color;

    readonly #HEX_MAP: StringMap<string[]> = new StringMap<string[]>();

    readonly #DISPLAY_GRAPH: boolean;
    readonly #DATE_GRAPH: SquareGraph;

    public constructor(config: JournalScreenConfig) {
        super('journal-screen');
        const p5: P5Lib = P5Context.p5;
        this.#DATE = new Date(Date.UTC(config.year, config.month - 1, config.day));
        this.#DATE_STRING = this.#DATE.toLocaleDateString('en-us', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        this.#DISPLAY_GRAPH = config.hasGraph;

        const MILLIS_PER_SECOND: number = 1000;
        const SECONDS_PER_MINUTE: number = 60;
        const MINUTES_PER_HOUR: number = 60;
        const HOURS_PER_DAY: number = 24;
        const MILLIS_PER_DAY: number = MILLIS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;
        const startOfYear: Date = new Date(Date.UTC(this.#DATE.getUTCFullYear(), 0, 1));
        const startOfYear_Millis: number = startOfYear.getTime();
        const currentDay_Millis: number = this.#DATE.getTime();
        const millis: number = currentDay_Millis - startOfYear_Millis;
        const dayOfTheYear: number = Math.floor(millis / MILLIS_PER_DAY) + 1;

        addNewPaletteColors();
        this.#populateHexMap();
        const colors = Array.from(this.#HEX_MAP.keys);
        const backgroundColorHex = Random.randomElement(colors) ?? '#FFFFFF';
        const colorSelector: HexColorSelector = new HexColorSelector(this.#HEX_MAP.get(backgroundColorHex) ?? ['#000000']);

        this.#BACKGROUND_COLOR = new Color(p5.color(backgroundColorHex));
        this.#TEXT_COLOR = colorSelector.getColor();
        this.#JOURNAL_COLOR = colorSelector.getColor();
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
            text: config.username,
            textSizeMultiplier: 18,
            xAlign: p5.RIGHT,
            yAlign: p5.BOTTOM,
            coordinatePosition: p5.createVector(0.1, 0.95),
            coordinateMode: CoordinateMode.RATIO,
            maxWidthRatio: 0.8,
            color: this.#TEXT_COLOR,
            font: config.font
        };
        this.#NAME_DISPLAY = new TextDisplay(nameDisplayConfig);
        this.addRedrawListener(this.#NAME_DISPLAY);

        const journalDisplayConfig: TextDisplayConfig = {
            text: config.journalEntry,
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

        let graphYRatio: number;
        let graphWidthRatio: number;
        let graphHeightRatio: number;

        if (config.journalEntry === '' && config.username === '') {
            graphYRatio = 0.55;
            graphWidthRatio = 0.75;
            graphHeightRatio = 0.75;
        } else if (config.journalEntry === '') {
            graphYRatio = 0.5;
            graphWidthRatio = 0.65;
            graphHeightRatio = 0.65;
        } else {
            graphYRatio = 0.41;
            graphWidthRatio = 0.45;
            graphHeightRatio = 0.45;
        }

        const graphFillMode: GraphFillMode = this.#selectGraphFillMode();
        const cellSizeSelection: GraphCellSizeSelection = this.#selectCellSizeSelection();
        this.#DATE_GRAPH = new SquareGraph({
            center: p5.createVector(0.5, graphYRatio),
            coordinateMode: CoordinateMode.RATIO,
            widthRatio: graphWidthRatio,
            heightRatio: graphHeightRatio,
            days: dayOfTheYear,
            colorSelector: colorSelector,
            fillMode: graphFillMode,
            cellSizeSelection: cellSizeSelection
        });
        this.addRedrawListener(this.#DATE_GRAPH);

        window.$fx.features({
            'username': config.username,
            'date': this.#DATE_STRING,
            'day of the year': dayOfTheYear,
            'font': config.font,
            'journal font': config.journalFont,
            'has graph': this.#DISPLAY_GRAPH,
            'graph fill mode': graphFillMode,
            'cell size selection': cellSizeSelection,
            'background color': this.#BACKGROUND_COLOR.name,
            'text color': this.#TEXT_COLOR.name,
            'journal color': this.#JOURNAL_COLOR.name,
            'graph colors': colorSelector.getNames()
        });
    }

    public draw(): void {
        const p5: P5Lib = P5Context.p5;
        p5.background(this.#BACKGROUND_COLOR.color);

        if (this.#DISPLAY_GRAPH) {
            this.#DATE_GRAPH.draw();
        }

        this.#DATE_DISPLAY.draw();
        this.#NAME_DISPLAY.draw();
        this.#JOURNAL_DISPLAY.draw();
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
        console.log(`total choices: ${totalChoices}`);
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

    #selectGraphFillMode(): GraphFillMode {
        const r: boolean = Random.randomBoolean(0.8);

        if (r) {
            return GraphFillMode.RANDOM;
        } else {
            return GraphFillMode.SEQUENTIAL;
        }
    }

    #selectCellSizeSelection(): GraphCellSizeSelection {
        const r: boolean = Random.randomBoolean(0.75);

        if (r) {
            return GraphCellSizeSelection.RANDOM;
        } else {
            return GraphCellSizeSelection.CONSTANT
        }
    }
}
