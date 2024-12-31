/*
 * Copyright (C) 2023-2024 brittni and the polar bear LLC.
 *
 * This file is a part of brittni and the polar bear's @batpb/genart project template,
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

import '../../assets/styles/sketch.css';

import {
    ASPECT_RATIOS,
    CanvasContext,
    P5Context,
    Random,
    ScreenHandler
} from '@batpb/genart';

import {JournalScreen, JournalScreenConfig} from './journal-screen';

// TODO - params
// TODO   - date font
// TODO   - name font

import { FxParamValue, FxParamType } from '@fxhash/params/types';

const date: Date = new Date();
const paramDay: number = date.getUTCDate();
const paramMonth: number = date.getUTCMonth() + 1;
const paramYear: number = date.getUTCFullYear();

// TODO - add to @batpb/genart
const fonts: string[] = [
    'American Typewriter',
    'Andale Mono',
    'Apple Chancery',
    'Arial',
    'Arial Narrow',
    'Avantgarde',
    'Blippo',
    'Bookman',
    'Bradley Hand',
    'Brush Script MT',
    'Chalkduster',
    'Copperplate',
    'Courier',
    'Courier New',
    'DejaVu Sans Mono',
    'Didot',
    'FreeMono',
    'Garamond',
    'Geneva',
    'Georgia',
    'Gill Sans',
    'Helvetica',
    'Impact',
    'Jazz LET',
    'Lucida Console',
    'Lucida Handwriting',
    'Luminari',
    'Marker Felt',
    'Monaco',
    'New Century Schoolbook',
    'Noto Sans',
    'OCR A Std',
    'Optima',
    'Palatino',
    'Snell Roundhand',
    'Stencil Std',
    'Tahoma',
    'Times',
    'Times New Roman',
    'Trebuchet MS',
    'Trattatello',
    'URW Chancery L',
    'Verdana',
    'cursive',
    'fantasy',
    'monospace',
    'sans-serif',
    'serif'
]

window.$fx.params([
    { id: 'day', name: 'day of the month', type: 'number', default: paramDay, value: paramDay, options: { min: paramDay - 1, max: paramDay + 1, step: 1 } },
    { id: 'month', name: 'month of the year', type: 'number', default: paramMonth, value: paramMonth, options: { min: paramMonth, max: paramMonth, step: 0 } },
    { id: 'year', name: 'year', type: 'number', default: paramYear, value: paramYear, options: { min: paramYear, max: paramYear, step: 0 } },
    { id: 'username', name: 'name', type: 'string', default: '', value: 'my name', options: { minLength: 0, maxLength: 64 } },
    { id: 'journal', name: 'journal entry', type: 'string', default: '', value: '', options: { minLength: 0, maxLength: 256 } },
    { id: 'font', name: 'font', type: 'select', default: 'Arial', value: 'Arial', options: { options: fonts } },
    { id: 'journalFont', name: 'journal font', type: 'select', default: 'Arial',  value: 'Arial', options: { options: fonts } }
]);

function getParamString(id: string): string | undefined {
    let value: FxParamValue<FxParamType> = window.$fx.getParam(id);
    let result: string | undefined = undefined;

    if (typeof value === 'string') {
        result = value;
    }

    return result;
}

function getParamInteger(id: string): number | undefined {
    let result: number | undefined;
    result = getParamFloat(id);

    if (result) {
        result = Math.floor(result);
    }

    return result;
}

function getParamFloat(id: string): number | undefined {
    let value: FxParamValue<FxParamType> = window.$fx.getParam(id);
    let result: number | undefined = undefined;

    if (typeof value === 'number') {
        result = value;
    }

    return result;
}

function sketch(p5: P5Lib): void {
    p5.setup = (): void => {
        P5Context.initialize(p5);
        Random.randomMethod = window.$fx.rand;
        CanvasContext.buildCanvas(ASPECT_RATIOS.SQUARE, 720, p5.P2D, true);
        const today: Date = new Date();

        const name: string = getParamString('username') ?? '';
        const journalEntry: string = getParamString('journal') ?? '';
        const day: number = getParamInteger('day') ?? today.getUTCDate();
        const month: number = getParamInteger('month') ?? (today.getUTCMonth() + 1);
        const year: number = getParamInteger('year') ?? today.getUTCFullYear();
        const font: string = getParamString('font') ?? 'Arial';
        const journalFont: string = getParamString('journalFont') ?? 'Arial';

        const config: JournalScreenConfig = {
            username: name.trim(),
            journalEntry: journalEntry.trim(),
            font: font.trim(),
            journalFont: journalFont.trim(),
            day: day,
            month: month,
            year: year
        }

        const screen: JournalScreen = new JournalScreen(config);
        ScreenHandler.addScreen(screen);
        ScreenHandler.currentScreen = screen.NAME;
    };

    p5.draw = (): void => {
        ScreenHandler.draw();
    };

    p5.keyPressed = (): void => {
        ScreenHandler.keyPressed();
    };

    p5.mousePressed = (): void => {
        ScreenHandler.mousePressed();
    };

    p5.windowResized = (): void => {
        CanvasContext.resizeCanvas();
    };
}

new P5Lib(sketch);
