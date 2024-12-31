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

import {Color, ColorSelector, ColorSelectorType, P5Context, Random, RandomSelector} from "@batpb/genart";
import P5Lib from "p5";

export class HexColorSelector extends ColorSelector {
    readonly #NAMES: string[] = [];

    public static get MAX_COLORS(): number {
        return 10;
    }

    public constructor(hexPool: string[]) {
        super('Hex Color Selector', Random.randomBoolean());

        const size: number = Random.randomInt(1, HexColorSelector.MAX_COLORS);
        const selector: RandomSelector<string> = new RandomSelector(hexPool);

        for (let i: number = 0; i < size; i++) {
            const hex: string | undefined = selector.getRandomElementAndRemove();

            if (hex) {
                const c: P5Lib.Color = P5Context.p5.color(hex);
                const color: Color = new Color(c);
                this.addColorChoice(color);
                this.#NAMES.push(color.name.toLowerCase());
            }
        }
    }

    public get type(): ColorSelectorType {
        return ColorSelectorType.PALETTE;
    }

    public getColor(): Color {
        return this.selectColorFromChoices();
    }

    public getNames(): string {
        this.#NAMES.sort();
        return this.#NAMES.join(', ');
    }
}
