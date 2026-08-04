import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AnonymousGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const raw = req.headers.authorization;
    console.log('AnonymousGuard: header received:', raw);
    if (!raw) {
      console.log('AnonymousGuard: no token → allow');
      return true;
    }
    let header: string;
    if (Array.isArray(raw)) {
      // Приводим к string[], чтобы TS понял, что raw[0] — это string
      const arr = raw as string[];
      header = arr[0] ?? '';
    } else if (typeof raw === 'string') {
      header = raw;
    } else {
      return true;
    }
    if (!header) return true;
    const token = header.replace(/^Bearer\s+/i, '');
    try {
      await this.jwtService.verify(token);
      console.log('AnonymousGuard: token valid → block');
      return false;
    } catch {
      console.log('AnonymousGuard: token invalid/missing → allow');
      return true;
    }
  }
}
