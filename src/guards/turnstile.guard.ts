import { TurnstileService } from "../services"
import { TURNSTILE_OPTIONS_SYMBOL, TurnstileOptions } from "../interfaces"
import { BadRequestException, CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common"

@Injectable()
export class TurnstileGuard implements CanActivate {
       public constructor(
              @Inject(TURNSTILE_OPTIONS_SYMBOL)
              private readonly options: TurnstileOptions,
              private readonly turnstileService: TurnstileService,
       ) {}

       public async canActivate(context: ExecutionContext): Promise<boolean> {
              const request = context.switchToHttp().getRequest() as Request

              const skipIfValue = this.options.skipIf

              const skip = typeof skipIfValue === 'function' 
                     ? await skipIfValue(request)
                     : !!skipIfValue

              if (skip) {
                     return true
              }

              const token = this.options.token(request)

              if (!token) throw new BadRequestException('Missing turnstile verification code.')
       
              const { success } = await this.turnstileService.validateToken(token);
              
              if (!success) throw new BadRequestException('Invalid turnstile verification code.')
       }
}