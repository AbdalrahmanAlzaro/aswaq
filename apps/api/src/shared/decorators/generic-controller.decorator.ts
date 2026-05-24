import { applyDecorators, ClassSerializerInterceptor, Controller, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

// Mirrors Safeer's GenericController: bundle per-controller boilerplate into one decorator.
// JWT auth is enforced GLOBALLY (APP_GUARD) + opened per-route with @Public(), so this
// decorator no longer attaches the guard itself; `secured` just documents bearer auth.
export function GenericController(path: string, secured = false) {
  const decorators = [
    ApiTags(path),
    Controller({ path }),
    UseInterceptors(ClassSerializerInterceptor),
  ];
  if (secured) decorators.push(ApiBearerAuth());
  return applyDecorators(...decorators);
}
