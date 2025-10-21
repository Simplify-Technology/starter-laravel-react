/// <reference types="vitest/globals" />

declare global {
    var route: (name: string, params?: any) => string;
}

export {};
