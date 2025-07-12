import { OAuth2Client } from "google-auth-library";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export interface GoogleUserInfo {
  sub: string; // Google 고유 ID
  name: string; // 사용자 이름
  email: string; // 이메일
  picture: string; // 프로필 이미지 URL
  email_verified: boolean; // 이메일 인증 여부
  given_name?: string; // 이름
  family_name?: string; // 성
}

export async function verifyGoogleToken(
  credential: string
): Promise<GoogleUserInfo> {
  try {
    // 1. Google 서버에 토큰 검증 요청
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    // 2. 검증된 사용자 정보 추출
    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error("Invalid token payload");
    }

    // 3. 필요한 사용자 정보 반환
    const userInfo: GoogleUserInfo = {
      sub: payload.sub!,
      name: payload.name!,
      email: payload.email!,
      picture: payload.picture!,
      email_verified: payload.email_verified!,
      given_name: payload.given_name,
      family_name: payload.family_name,
    };

    console.log("Google user info verified:", userInfo);
    return userInfo;
  } catch (error) {
    console.error("Google token verification failed:", error);
    throw new Error("Invalid Google token");
  }
}
