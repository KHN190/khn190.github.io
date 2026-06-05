/* tslint:disable */
/* eslint-disable */

export class RunResult {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    error: string;
    ok: boolean;
    stderr: string;
    stdout: string;
    value: string;
    warnings: string;
}

export class Session {
    free(): void;
    [Symbol.dispose](): void;
    heap_live_count(): number;
    constructor(source: string);
    resume(input: bigint): boolean;
    take_stderr(): string;
    take_stdout(): string;
}

export function check(source: string): RunResult;

export function check_with(source: string, int32: boolean, no_built_in: boolean): RunResult;

export function example_names(): string[];

export function example_source(name: string): string;

export function init(): void;

export function run(source: string): RunResult;

export function run_with(source: string, int32: boolean, no_built_in: boolean): RunResult;

export function version(): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_get_runresult_error: (a: number) => [number, number];
    readonly __wbg_get_runresult_ok: (a: number) => number;
    readonly __wbg_get_runresult_stderr: (a: number) => [number, number];
    readonly __wbg_get_runresult_stdout: (a: number) => [number, number];
    readonly __wbg_get_runresult_value: (a: number) => [number, number];
    readonly __wbg_get_runresult_warnings: (a: number) => [number, number];
    readonly __wbg_runresult_free: (a: number, b: number) => void;
    readonly __wbg_session_free: (a: number, b: number) => void;
    readonly __wbg_set_runresult_error: (a: number, b: number, c: number) => void;
    readonly __wbg_set_runresult_ok: (a: number, b: number) => void;
    readonly __wbg_set_runresult_stderr: (a: number, b: number, c: number) => void;
    readonly __wbg_set_runresult_stdout: (a: number, b: number, c: number) => void;
    readonly __wbg_set_runresult_value: (a: number, b: number, c: number) => void;
    readonly __wbg_set_runresult_warnings: (a: number, b: number, c: number) => void;
    readonly check: (a: number, b: number) => number;
    readonly check_with: (a: number, b: number, c: number, d: number) => number;
    readonly example_names: () => [number, number];
    readonly example_source: (a: number, b: number) => [number, number];
    readonly run: (a: number, b: number) => number;
    readonly run_with: (a: number, b: number, c: number, d: number) => number;
    readonly session_heap_live_count: (a: number) => number;
    readonly session_new: (a: number, b: number) => [number, number, number];
    readonly session_resume: (a: number, b: bigint) => [number, number, number];
    readonly session_take_stderr: (a: number) => [number, number];
    readonly session_take_stdout: (a: number) => [number, number];
    readonly version: () => [number, number];
    readonly init: () => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_drop_slice: (a: number, b: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
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
