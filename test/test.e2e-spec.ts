import request from "supertest"

const url = {
  base: "http://localhost:3000",
  register: "/auth/register",
  login: "/auth/login",
  me: "/auth/me",
  event: "/event",
  reward: "/reward",
  rewardType: "/reward/type",
  rewardCreate: "/reward/create",
  rewardRequest: "/reward/request",
  rewardHistory: "/reward/history",
  rewardHistoryAll: "/reward/history/all",
}

describe("전체 e2e 테스트", () => {
  let userToken: string;
  let adminToken: string;
  let auditToken: string;
  const testUser = {
    email: "test-user+" + Date.now() + "@example.com",
    password: "1234",
    name: "Tester",
    role: "USER",
  };

  const testAdmin = {
    email: "test-admin+" + Date.now() + "@example.com",
    password: "1234",
    name: "AdminTester",
    role: "ADMIN",
  }

  const testAudit = {
    email: "test-audit+" + Date.now() + "@example.com",
    password: "1234",
    name: "AuditTester",
    role: "AUDITOR",
  }

  const testEvent = {
    title: `[test]테스트 이벤트-${new Date().getTime()}`,
    description: "테스트 이벤트 설명",
    condition: "login_7_days",
    startDate: new Date(Date.now() + 86400000).toISOString(), // 내일
    endDate: new Date(Date.now() + 86400000 * 14).toISOString(), // 2주 후
    isActive: true
  }

  const testEventOVer = {
    title: `[test]테스트 이벤트-${new Date().getTime()}`,
    description: "종료된 이벤트",
    condition: "login_7_days",
    startDate: new Date(Date.now() - 86400000 * 7).toISOString(), // 7일전
    endDate: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2시간전
    isActive: true
  }

  /**********************************
   * 유저 테스트
   **********************************/
  describe("유저 생성", () => {
    it("사용자 등록[유저] → 201", async () => {
      await request(url.base)
        .post(url.register)
        .send(testUser)
        .expect(201)
    })

    it("중복 이메일 등록 → 409", async () => {
      await request(url.base).post(url.register).send(testUser).expect(409)
    })

    it("사용자 등록[관리자] → 201", async () => {
      await request(url.base)
        .post(url.register)
        .send(testAdmin)
        .expect(201)
    })

    it("사용자 등록[감사] → 201", async () => {
      await request(url.base)
        .post(url.register)
        .send(testAudit)
        .expect(201)
    })

    describe("로그인", () => {
      it("사용자 로그인 → 200", async () => {
        const response = await request(url.base)
          .post(url.login)
          .send({ email: testUser.email, password: testUser.password })
          .expect(201)

        expect(response.body).toHaveProperty('accessToken');
        userToken = response.body.accessToken;
      })

      it("관리자 로그인 → 200", async () => {
        const response = await request(url.base)
          .post(url.login)
          .send({ email: testAdmin.email, password: testAdmin.password })
          .expect(201)

        expect(response.body).toHaveProperty('accessToken')
        adminToken = response.body.accessToken
      });

      it("감사자 로그인 → 200", async () => {
        const response = await request(url.base)
          .post(url.login)
          .send({ email: testAudit.email, password: testAudit.password })
          .expect(201)

        expect(response.body).toHaveProperty('accessToken')
        auditToken = response.body.accessToken
      });

      it("사용자 정보 조회 → 200", async () => {
        const response = await request(url.base)
          .get(url.me)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(200)

        expect(response.body).toHaveProperty('email', testUser.email)
        expect(response.body).toHaveProperty('role', testUser.role)
      });

      it("인증 없이 사용자 정보 조회 → 401", async () => {
        await request(url.base).get(url.me).expect(401)
      })
    })
  })

  /**********************************
   * 이벤트 테스트
   **********************************/
  describe("이벤트", () => {
    let lastEventId: string
    let lastEventOverId: string

    it("일반 사용자가 이벤트 생성 시도 → 403", async () => {
      await request(url.base)
        .post(url.event)
        .set('Authorization', `Bearer ${userToken}`)
        .send(testEvent)
        .expect(403)
    })

    it("관리자가 이벤트 생성 → 201", async () => {
      const response = await request(url.base)
        .post(url.event)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testEvent)
        .expect(201)

      const event = JSON.parse(response.text)
      lastEventId = event._id
    })

    it("관리자가 이벤트 생성[종료된이벤트] → 201", async () => {
      const response = await request(url.base)
        .post(url.event)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(testEventOVer)
        .expect(201)

      console.log(response.text)
      const event = JSON.parse(response.text)
      lastEventOverId = event._id
    })

    it("이벤트 조회", async () => {
      await request(url.base)
        .get(url.event)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
    })

    it("인증 없이 이벤트 목록 조회 → 401", async () => {
      await request(url.base).get(url.event).expect(401);
    })

    it("이벤트 세부 내용 조회 → 200", async () => {
      const response = await request(url.base)
        .get(`${url.event}/${lastEventId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)

      // 생성한 이벤트와 동일한가?
      const data = JSON.parse(response.text)
      expect(data?._id).toBe(lastEventId)
    })

    /**********************************
     * 보상 테스트
     **********************************/
    describe("리워드", () => {
      const rewardType = { type: `test-POINT-${new Date().getTime()}`, description: "포인트 리워드 타입입니다." };
      const rewardItem = {
        "eventId": "",
        "type": "POINT",
        "name": "point-reward",
        "quantity": 1
      }

      it("보상 타입 생성 -> 201", async () => {
        await request(url.base)
          .post(url.rewardType)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(rewardType)
          .expect(201)
      })

      it("보상 타입 생성[중복] -> 409", async () => {
        await request(url.base)
          .post(url.rewardType)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(rewardType)
          .expect(409)
      })

      it("일반 사용자가 보상 생성 시도 → 403", async () => {
        await request(url.base)
          .post(url.rewardCreate)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ ...rewardItem, type: rewardType.type })
          .expect(403)
      })

      it("관리자가 보상 생성 시도[없는 타입] → 409", async () => {
        rewardItem.eventId = lastEventId
        await request(url.base)
          .post(url.rewardCreate)
          .set('Authorization', `Bearer ${adminToken}`)
          .send(rewardItem)
          .expect(409)
      })

      it("관리자가 보상 생성 시도 → 201", async () => {
        rewardItem.eventId = lastEventId
        await request(url.base)
          .post(url.rewardCreate)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ ...rewardItem, type: rewardType.type })
          .expect(201)
      })

      it("보상 요청 → 201", async () => {
        rewardItem.eventId = lastEventId
        await request(url.base)
          .post(url.rewardRequest)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ eventId: lastEventId })
          .expect(201)
      })

      it("보상 요청[중복] → 409", async () => {
        await request(url.base)
          .post(url.rewardRequest)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ eventId: lastEventId })
          .expect(409)
      })

      it("보상 요청[미존재] → 404", async () => {
        const eventId = lastEventId.slice(0, -1) + "0"
        await request(url.base)
          .post(url.rewardRequest)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ eventId })
          .expect(404)
      })

      it("보상 요청[이벤트 종료] → 409", async () => {
        await request(url.base)
          .post(url.rewardRequest)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ eventId: lastEventOverId })
          .expect(409)
      })

      it("보상 내역 요청[유저] → 201", async () => {
        const res = await request(url.base)
          .get(url.rewardHistory)
          .set('Authorization', `Bearer ${userToken}`)
          .expect(200)

        expect(Array.isArray(res.body)).toBe(true);
      })

      it("보상 내역 요청[관리자] → 201", async () => {
        const res = await request(url.base)
          .get(url.rewardHistoryAll)
          .set('Authorization', `Bearer ${adminToken}`)
          .expect(200)

        expect(Array.isArray(res.body)).toBe(true);
      })

      it("보상 내역 요청[감사자] → 201", async () => {
        const res = await request(url.base)
          .get(url.rewardHistoryAll)
          .set('Authorization', `Bearer ${auditToken}`)
          .expect(200)

        expect(Array.isArray(res.body)).toBe(true);
      })
    })
  })
})
