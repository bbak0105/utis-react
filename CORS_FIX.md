# CORS 에러 해결 방법

## 문제 상황
- 프론트엔드: `https://travelutis.com`
- 백엔드: `https://huhuhihi.shop`
- 에러: CORS policy에 의해 요청이 차단됨

## 해결 방법

백엔드 서버(`huhuhihi.shop`)의 CORS 설정에 `travelutis.com`을 추가해야 합니다.

### 백엔드 서버 코드 수정 필요

`huhuhihi.shop` 서버의 Express CORS 설정을 다음과 같이 업데이트하세요:

```javascript
app.use(cors({
  origin: [
    'https://travelutis.com',        // 프로덕션 도메인
    'http://travelutis.com',         // HTTP 버전 (필요시)
    'https://www.travelutis.com',    // www 서브도메인
    'http://www.travelutis.com',     // www 서브도메인 HTTP
    'http://localhost:5173',         // 로컬 개발 환경
    /\.netlify\.app$/,               // 모든 Netlify 미리보기 배포
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

### 또는 모든 도메인 허용 (개발/테스트용)

**주의**: 프로덕션에서는 특정 도메인만 허용하는 것이 보안상 안전합니다.

```javascript
app.use(cors({
  origin: true,  // 모든 도메인 허용
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

## 확인 사항

1. 백엔드 서버 코드 수정 후 **서버 재시작** 필요
2. 브라우저에서 다시 테스트
3. 여전히 CORS 에러가 발생하면 브라우저 캐시 삭제 후 재시도

## 현재 프로젝트의 CORS 설정

현재 `server/index.ts` 파일에는 이미 `travelutis.com`이 포함되어 있지만, 실제 배포된 서버(`huhuhihi.shop`)는 별도로 설정되어 있을 수 있습니다.

백엔드 개발자에게 위의 CORS 설정을 적용하도록 요청하세요.

