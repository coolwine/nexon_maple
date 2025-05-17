
# Event Reward System

NestJS + MongoDB 기반의 이벤트/보상 관리 플랫폼입니다.  
MSA 구조로 구성되며, 실제 운영 환경에 투입 가능한 수준을 목표로 개발되었습니다.

---

## 📦 기술 스택

- Node.js 20+
  - 18기준으로 작성하지 않은 이유는 NestJS 가 최소 20에 의존성을 가지며, 18버전은 이미 지원 종료(25.04)된 버전입니다.
- NestJS
- MongoDB
- Docker, Docker Compose
- JWT 인증 (Role 기반 접근 제어)
- Axios (Gateway → 서비스 프록시)

---

## 🧱 아키텍처

- 4개(Gateway, Auth, Event, Mongo)의 도커가 생성됩니다.
```
[Client]
   │
   ▼
[Gateway] ─────▶ 인증, 권한 검사, 라우팅
   │
   ├──▶ [Auth Service] : 회원가입, 로그인, 역할관리, JWT 발급
   └──▶ [Event Service] : 이벤트 등록, 보상 등록/요청/이력
        └── MongoDB
```

---

## ⚙️ 실행 방법

### 1. 프로젝트 구조
```
event-reward-system/
├── auth/
├── event/
├── gateway/
├── test/
├── docker-compose.yml
└── README.md
```

### 2. 실행 명령어

```bash
# Install
npm run install:all
# 전체 빌드 및 실행
npm run start:docker
```

```bash
# 테스트 케이스를 실행하여 전체 로직에 대해 e2e 테스트를 진행합니다.(실제 데이터 생성)
npm run test:e2e
```

### 3. 종료
```bash
docker compose down
```

---

## 🔐 역할별 기능 요약

| 역할 | 기능 |
|------|------|
| USER | 이벤트 보상 요청, 이력 확인 |
| OPERATOR | 이벤트/보상 등록 |
| AUDITOR | 보상 요청 이력 확인 |
| ADMIN | 전체 기능 접근 가능 |

---

## 🗃️ MongoDB Database
| DB      | Collection                                   |
|---------|----------------------------------------------|
| auth    | users                                        |
| event   | events, rewardRequests, rewards, rewardTypes |

## 📌 주요 API 요약

### 📍 Auth 서비스

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/auth/register` | 회원가입 |
| POST | `/auth/login` | 로그인 (JWT 발급) |
| GET | `/auth/me` | 토큰으로 본인 정보 조회 |

### 📍 Event 서비스

| 메서드 | 경로          | 설명                     |
|--------|-------------|------------------------|
| POST | `/event`    | 이벤트 등록 *(OPERATOR 이상)* |
| GET | `/event`    | 전체 이벤트 조회              |
| GET | `/event:id` | 이벤트 세부 내용 조회 |

### 📍 Reward 서비스

| 메서드 | 경로               | 설명                        |
|--------|------------------|---------------------------|
| POST | `/reward/create` | 이벤트 보상 등록 *(OPERATOR 이상)* |
| POST | `/reward/type`   | 이벤트 타입 등록 *(OPERATOR 이상)* |
| GET | `/reward/[id]`   | 특정 이벤트의 보상 목록             |

### 📍 보상 요청

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/reward/request` | 유저 보상 요청 |
| GET | `/reward/history` | 유저 본인 이력 조회 |
| GET | `/reward/history/all` | 전체 이력 조회 *(AUDITOR 이상)* |

---

## 🔎 설계 의도 & 설명

💡 Node.js 18이 아닌 20을 사용한 이유
```
NestJS v11은 Node.js 20 이상을 필수로 요구하며,
Node.js 18은 2025년 4월부로 공식 지원이 종료되었습니다.
따라서 본 프로젝트는 장기적인 유지보수와 보안성을 고려하여 Node.js 20 버전 기준으로 작성되었습니다.
```

💡 npm run test:e2e
```
시나리오 테스트를 위한 단일 명령어로 전체 시스템의 가용성을 검증할 수 있습니다.
이는 향후 CI/CD 파이프라인에서 필수적인 단계로 활용될 수 있습니다.
```

- **역할 기반 인증**을 통해 서비스 접근 제어를 분리
- **MSA 구조**를 적용하여 서비스 간 관심사를 명확히 분리
- Gateway에서 JWT 인증/역할 검증 → 내부 API 프록시
- MongoDB는 이벤트/보상/요청 이력을 독립적으로 관리
- 조건 검증 로직은 추후 커스터마이징 가능한 구조로 구성
- `@nestjs/passport`와 `AuthGuard`, `RolesGuard`로 보안 적용

---
