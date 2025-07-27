# NestJS Turnstile Captcha

A NestJS module for validating Cloudflare Turnstile CAPTCHA tokens.

---

## Description

This module makes it easy to integrate Cloudflare Turnstile CAPTCHA verification into your NestJS applications.  
Supports both synchronous and asynchronous module configuration. Includes a Guard for convenient use in controllers.

---

## Installation

```bash
npm install your-turnstile-nestjs-package --save
# or
yarn add your-turnstile-nestjs-package
```

---

## Usage

### Import the module (synchronous)

```typescript
import { Module } from '@nestjs/common';
import { TurnstileModule } from 'nestjs-cloudflare-turnstile';

@Module({
       imports: [
              TurnstileModule.forRoot({
                     secretKey: process.env.TURNSTILE_SECRET_KEY,
                     token: req => req.body.captchaToken
                     skipIf: false
              }),
       ],
})
export class AppModule {}
```

### Import the module (asynchronous)

```typescript
import { Module } from '@nestjs/common'
import { TurnstileModule } from 'nestjs-cloudflare-turnstile'

@Module({
	imports: [
		TurnstileModule.forRootAsync({
			useFactory: async (configService: ConfigService) => ({
				secretKey: configService.get('CAPTCHA_SECRET_KEY'),
				token: req => req.headers['captcha-token'],
				skipIf: false
			}),
		}),
	],
})
export class AppModule {}
```

---

## Example separate config for useFactory

If you prefer to keep your configuration logic separate, you can create a dedicated config provider:

```typescript
// /config/turnstile.config.ts
import { ConfigService } from '@nestjs/config'
import type { TurnstileOptions } from 'nestjs-cloudflare-turnstile'

export function getTurnstileConfig(configService: ConfigService): TurnstileOptions {
	return {
		secretKey: configService.getOrThrow<string>('TURNSTILE_SECRET_KEY'),
		token: req => req.body.captcha,
		skipIf: false
	}
}
```

Then use it in your module:

```typescript
import { Module } from '@nestjs/common';
import { TurnstileModule } from 'nestjs-cloudflare-turnstile';
import { getTurnstileConfig } from '@/config/turnstile.config';

@Module({
       imports: [
		TurnstileModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getTurnstileConfig,
			inject: [ConfigService]
		}),
       ],
})
export class AppModule {}
```

---

## Using the Guard in Controllers

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { TurnstileCaptcha } from 'nestjs-cloudflare-turnstile';

@Controller('auth')
export class AuthController {

       @Post('login')
       @TurnstileCaptcha()
       login() {
              return { success: true };
       }
}
```

---

## Support

If you have any questions or encounter any issues, please don’t hesitate to contact the author or submit an issue in the repository.

## Contributors

- Artur Docenko (MikroTik2)  

## License

This project is licensed under the [MIT License](LICENSE).