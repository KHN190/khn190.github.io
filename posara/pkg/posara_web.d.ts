/* tslint:disable */
/* eslint-disable */

export class Posara {
    free(): void;
    [Symbol.dispose](): void;
    add_file(name: string, data: Uint8Array): void;
    audio_pull(out: Float32Array): void;
    drain_stdout(): string;
    frame(): boolean;
    framebuffer(): Uint8Array;
    height(): number;
    list_files(): string[];
    load_entry(name: string): void;
    load_pk(bytes: Uint8Array): void;
    load_src(src: string): void;
    max_files(): number;
    constructor();
    read_file(name: string): Uint8Array | undefined;
    remove_file(name: string): boolean;
    sample_rate(): number;
    set_input(buttons: number, key: number): void;
    version(): string;
    width(): number;
}

export function init(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_posara_free: (a: number, b: number) => void;
    readonly init: () => void;
    readonly posara_add_file: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly posara_audio_pull: (a: number, b: number, c: number, d: any) => void;
    readonly posara_drain_stdout: (a: number) => [number, number];
    readonly posara_frame: (a: number) => [number, number, number];
    readonly posara_framebuffer: (a: number) => [number, number];
    readonly posara_height: (a: number) => number;
    readonly posara_list_files: (a: number) => [number, number];
    readonly posara_load_entry: (a: number, b: number, c: number) => [number, number];
    readonly posara_load_pk: (a: number, b: number, c: number) => [number, number];
    readonly posara_load_src: (a: number, b: number, c: number) => [number, number];
    readonly posara_max_files: (a: number) => number;
    readonly posara_new: () => [number, number, number];
    readonly posara_read_file: (a: number, b: number, c: number) => [number, number];
    readonly posara_remove_file: (a: number, b: number, c: number) => number;
    readonly posara_sample_rate: (a: number) => number;
    readonly posara_set_input: (a: number, b: number, c: number) => void;
    readonly posara_version: (a: number) => [number, number];
    readonly posara_width: (a: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __externref_drop_slice: (a: number, b: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
