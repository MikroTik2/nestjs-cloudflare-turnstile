import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { catchError, firstValueFrom } from 'rxjs'
import { type TurnstileOptions, TURNSTILE_OPTIONS_SYMBOL } from '../interfaces'
import { API_URL } from '../constants/turnstile.constant'

@Injectable()
export class TurnstileService {
       private readonly secretKey: string
       private readonly apiUrl: string

       public constructor(
              @Inject(TURNSTILE_OPTIONS_SYMBOL)
              private readonly options: TurnstileOptions,
              private readonly httpService: HttpService
       ) {
              this.secretKey = this.options.secretKey,
              this.apiUrl = API_URL
       }

       public async validateToken(token: string) {
              const { data } = await firstValueFrom(
                     this.httpService.post(`${this.apiUrl}/siteverify`, {
                            response: token,
                            secret: this.secretKey,
                            headers: {
                                   'Content-Type': 'application/x-www-form-urlencoded',
                            }
                     }).pipe(catchError(e => {
                            throw new InternalServerErrorException(`Failed turnstile verification: ${e}`)
                     }))
              )

              return data
       }
}