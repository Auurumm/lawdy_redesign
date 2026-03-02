import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;
const ADMIN_TOKEN_EXPIRES_IN = '8h';

export interface AdminTokenPayload {
  adminId: string;
  username: string;
}

export function generateAdminToken(payload: AdminTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ADMIN_TOKEN_EXPIRES_IN });
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
}

export async function verifyAdminPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('adminToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60,
    path: '/',
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('adminToken');
}

export async function withAdminAuth(
  request: NextRequest,
  handler: (request: NextRequest, adminId: string) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const adminToken = request.cookies.get('adminToken')?.value;

    if (!adminToken) {
      return NextResponse.json(
        { error: '관리자 인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const payload = verifyAdminToken(adminToken);
    return handler(request, payload.adminId);
  } catch {
    return NextResponse.json(
      { error: '유효하지 않은 관리자 토큰입니다.' },
      { status: 401 }
    );
  }
}
