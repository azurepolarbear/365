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

import { JournalScreen } from './journal-screen';

// TODO - params
// TODO   - username
// TODO   - date font
// TODO   - name font

// import { FxParamValue, FxParamType } from '@fxhash/params/types';


const date: Date = new Date();
date.getDay();

console.log(date);
console.log(date.getDate());

const day: number = date.getDate();
const month: number = date.getMonth() + 1;
const year: number = date.getFullYear();

window.$fx.params([
    { id: 'day', name: 'day of the month', type: 'number', default: day, value: day, options: { min: day - 1, max: day + 1, step: 1 } },
    { id: 'month', name: 'month of the year', type: 'number', default: month, value: month, options: { min: month, max: month, step: 0 } },
    { id: 'year', name: 'year', type: 'number', default: year, value: year, options: { min: year, max: year, step: 0 } },
    { id: 'username', name: 'name', type: 'string', default: '', value: 'my name', options: { minLength: 0, maxLength: 64 } }
]);

function sketch(p5: P5Lib): void {
    p5.setup = (): void => {
        P5Context.initialize(p5);
        Random.randomMethod = window.$fx.rand;
        CanvasContext.buildCanvas(ASPECT_RATIOS.SQUARE, 720, p5.P2D, true);

        let name = window.$fx.getParam('username');
        let username: string = '';

        if (typeof name === 'string') {
            name = name.trim();
            username = name;
        }

        const screen: JournalScreen = new JournalScreen(username);
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
