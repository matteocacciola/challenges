import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';

@UseGuards(AuthGuard)
export class AppResolver {}
