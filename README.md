# ShareAlbum

### BackEnd 초기 세팅

#### 1. 패키지 설치

```sh
# nodeJs 이미 설치했다고 가정
npm i
```

#### 2. env 추가 (back-end 디렉토리에 추가)

```sh
# 요청 시, 원본 env 공유

# Database
DATABASE_URL="db_url"

# Backend
NODE_ENV="development"
PORT=0

# Jwt Secret key
JWT_SECRET="secret-key"
```

#### 3. prisma client 생성

```sh
# postgreSQL을 이미 설치했다고 가정함
npx prisma generate
```

#### 4. 실행

```sh
npm run dev
```
