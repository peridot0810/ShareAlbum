import { Router, Request, Response } from "express";
import { verifyGoogleToken, GoogleUserInfo } from "../utils/googleAuth";
import prisma from "../configs/prisma";

const router = Router();

interface GoogleLoginRequest {
  credential: string;
}

interface GoogleLoginResponse {
  success: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
    profileImg: string;
  };
  error?: string;
}

router.post("/google", async (req: Request, res: Response): Promise<void> => {
  try {
    const { credential }: GoogleLoginRequest = req.body;

    if (!credential) {
      res.status(400).json({
        success: false,
        error: "Credential is required",
      });
      return;
    }

    console.log("Received Google login request with credential");

    // 1. Google 서버에 토큰 검증 요청
    const googleUserInfo: GoogleUserInfo = await verifyGoogleToken(credential);
    console.log("Google user info verified:", googleUserInfo);

    // 2. DB에서 사용자 찾기 (provider: 'google', providerId: googleUserInfo.sub)
    let user = await prisma.user.findUnique({
      where: {
        provider_providerId: {
          provider: "google",
          providerId: googleUserInfo.sub,
        },
      },
    });

    // 3. 사용자가 없으면 새로 생성
    if (!user) {
      console.log("Creating new user for Google login");
      user = await prisma.user.create({
        data: {
          provider: "google",
          providerId: googleUserInfo.sub,
          email: googleUserInfo.email,
          username: googleUserInfo.name,
          profileImg: googleUserInfo.picture,
        },
      });
      console.log("New user created:", user);
    } else {
      console.log("Existing user found:", user);

      // 기존 사용자 정보 업데이트 (선택사항)
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          username: googleUserInfo.name,
          profileImg: googleUserInfo.picture,
          email: googleUserInfo.email,
          updatedAt: new Date(),
        },
      });
      console.log("User updated:", user);
    }

    // 4. 응답 데이터 구성
    const response: GoogleLoginResponse = {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email!,
        profileImg: user.profileImg,
      },
    };

    console.log("Google login successful, returning user data");
    res.json(response);
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
});

export default router;
