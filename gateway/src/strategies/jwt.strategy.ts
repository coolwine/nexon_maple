import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONFIG, JWT_PAYLOAD_FIELDS, USER_FIELDS } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || JWT_CONFIG.DEFAULT_SECRET,
    });
  }

  validate(payload: any) {
    return {
      [USER_FIELDS.USER_ID]: payload[JWT_PAYLOAD_FIELDS.USER_ID],
      [USER_FIELDS.EMAIL]: payload[JWT_PAYLOAD_FIELDS.EMAIL],
      [USER_FIELDS.ROLE]: payload[JWT_PAYLOAD_FIELDS.ROLE],
    };
  }
}
