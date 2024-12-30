interface Window {
    $fx: {
        rand: () => number;
        params: (params: FxParameter[]) => void;
    };
}

declare type FxParameter = NumberParameter | StringParameter | BooleanParameter | ColorParameter | SelectParameter | BigIntParameter | BytesParameter;

// a parameter definition
declare interface Parameter {
    id: string;
    name?: string;
    type: 'number' | 'string' | 'boolean' | 'color' | 'select' | 'bigint' | 'bytes';
    default?: string | number | bigint | boolean;
    update?: 'page-reload' | 'sync' | 'code-driven';
    options?: { min: number; max: number; step?: number; } | { minLength: number; maxLength: number; } | { options: string[]; } | { length: number; };
}

declare interface NumberParameter extends Parameter {
    id: string;
    name?: string;
    type: 'number';
    default?: number;
    update?: 'page-reload' | 'sync' | 'code-driven';
    options?: { min: number; max: number; step?: number; };
}

declare interface StringParameter extends Parameter {
    id: string;
    name?: string;
    type: 'string';
    default?: string;
    update?: 'page-reload' | 'sync' | 'code-driven';
    options?: { minLength: number; maxLength: number; };
}

declare interface BooleanParameter extends Parameter {
    id: string;
    name?: string;
    type: 'boolean';
    default?: string;
    update?: 'page-reload' | 'sync' | 'code-driven';
}

declare interface ColorParameter extends Parameter {
    id: string;
    name?: string;
    type: 'color';
    default?: string;
    update?: 'page-reload' | 'sync' | 'code-driven';
}

declare interface BytesParameter extends Parameter {
    id: string;
    name?: string;
    type: 'bytes';
    default?: string;
    update?: 'page-reload' | 'sync' | 'code-driven';
    options?: { length: number; };
}

declare interface SelectParameter extends Parameter {
    id: string;
    name?: string;
    type: 'select';
    default?: string;
    update?: 'page-reload' | 'sync' | 'code-driven';
    options?: { options: string[]; };
}

declare interface BigIntParameter extends Parameter {
    id: string;
    name?: string;
    type: 'bigint';
    default?: number;
    update?: 'page-reload' | 'sync' | 'code-driven';
    options?: { min: number; max: number; };
}
