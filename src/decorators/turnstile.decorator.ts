import { UseGuards } from "@nestjs/common";
import { TurnstileGuard } from "../guards";

export function TurnstileCaptcha(): MethodDecorator {
       return UseGuards(TurnstileGuard)
}