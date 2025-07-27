import { type DynamicModule, Global, Module } from "@nestjs/common";
import { TurnstileService } from "./services";

import { HttpModule } from "@nestjs/axios";
import { TURNSTILE_OPTIONS_SYMBOL, TurnstileAsyncOptions, TurnstileOptions } from "./interfaces";

import { TurnstileGuard } from "./guards";

@Global()
@Module({})
export class TurnstileModule {
       public static forRoot(options: TurnstileOptions): DynamicModule {
              return {
                     module: TurnstileModule,
                     imports: [HttpModule],
                     exports: [TurnstileService, TURNSTILE_OPTIONS_SYMBOL],
                     global: true,
                     providers: [
                            {
                                   provide: TURNSTILE_OPTIONS_SYMBOL,
                                   useValue: options
                            },
                            TurnstileService
                     ]
              }
       }

       public static forRootAsync(options: TurnstileAsyncOptions): DynamicModule {
              return {
                     module: TurnstileModule,
                     imports: [...(options.imports || []), HttpModule],
                     exports: [TurnstileService, TURNSTILE_OPTIONS_SYMBOL],
                     global: true,
                     providers: [
                            {
                                   provide: TURNSTILE_OPTIONS_SYMBOL,
                                   useFactory: options.useFactory,
                                   inject: options.inject || []
                            },
                            TurnstileService
                     ]
              }
       }
}