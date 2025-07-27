import type { FactoryProvider, ModuleMetadata } from "@nestjs/common";

export const TURNSTILE_OPTIONS = Symbol('TURNSTILE_OPTIONS');

export type TurnstileOptions<Req = Request | any> = Readonly<{
       secretKey: string
       token: (req: Req) => string
       skipIf?: | boolean | ((request: Req) => boolean | Promise<boolean>)
}>

export type TurnstileAsyncOptions = Pick<ModuleMetadata, 'imports'>
       & Pick<FactoryProvider<TurnstileOptions>, 'useFactory' | 'inject'>