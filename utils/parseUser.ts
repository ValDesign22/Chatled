import { GetServerSidePropsContext } from 'next';
import { parse } from 'cookie';
import { verify } from 'jsonwebtoken';
import { User } from './interfaces';

export function parseUser(ctx: GetServerSidePropsContext): User | null {
  if (!ctx.req.headers.cookie) return null;

  const token = parse(ctx.req.headers.cookie)[`${process.env.COOKIE_NAME}`];

  if (!token) return null;

  try {
      const { iat, exp, ...user } = verify(token, process.env.JWT_SECRET!) as User & { iat: number; exp: number; };
      return user;
  } catch (err) {
      return null;
  }
}