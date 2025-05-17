import { Model } from 'mongoose';
// import * as bcrypt from 'bcrypt'
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Omit<User, 'password'>> {
    const { email, password, name, role } = registerDto;

    const existing = await this.userModel.findOne({ email });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // const hashed = await bcrypt.hash(password, 10);
    // const user = new this.userModel({ email, password: hashed, name, role });
    const user = new this.userModel({ email, password, name, role });
    const saved = await user.save();
    const { password: _, ...result } = saved.toObject();
    return result;
  }

  // 기존 register 메서드 아래에 추가
  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials[1]');
    }

    // const valid = await bcrypt.compare(password, user.password);
    const valid = password === user.password;
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials[2]');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
