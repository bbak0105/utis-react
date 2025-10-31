# Netlify 배포 가이드

## 1. 환경 변수 설정 (중요!)

Netlify 대시보드에서 환경 변수를 설정해야 합니다:

1. Netlify 사이트 선택
2. **Site settings** → **Environment variables** 이동
3. 다음 환경 변수 추가:

```
Key: VITE_API_URL
Value: http://ec2-43-200-5-154.ap-northeast-2.compute.amazonaws.com:8080
```

또는 IP 주소 사용:

```
Key: VITE_API_URL
Value: http://43.200.5.154:8080
```

**주의**: HTTPS 사이트에서 HTTP API 호출 시 CORS 또는 Mixed Content 문제가 발생할 수 있습니다. 백엔드에서 CORS 설정을 확인하세요.

## 2. Git 저장소 연결

1. Netlify 대시보드 → **Add new site** → **Import an existing project**
2. Git 저장소 선택 (GitHub/GitLab/Bitbucket)
3. 저장소 연결

## 3. 빌드 설정

Netlify는 `netlify.toml` 파일을 자동으로 인식합니다:
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20

## 4. 배포

1. Git에 푸시하면 자동으로 배포됩니다
2. 또는 Netlify 대시보드에서 **Deploy site** → **Deploy manually** 선택 후 `dist` 폴더 업로드

## 5. CORS 설정 확인 (백엔드)

EC2 백엔드 서버에서 Netlify 도메인을 허용하도록 CORS를 설정해야 합니다:

```javascript
// Express CORS 설정 예시
app.use(cors({
  origin: [
    'https://your-netlify-domain.netlify.app',
    'http://localhost:5173' // 개발 환경용
  ],
  credentials: true
}))
```

## 6. 테스트

배포 후 브라우저 콘솔에서 다음을 확인:
- API 호출이 정상적으로 이루어지는지
- CORS 에러가 없는지
- 환경 변수가 올바르게 로드되었는지

## 문제 해결

### Mixed Content 에러
- HTTPS 사이트에서 HTTP API 호출 시 발생
- 백엔드에 SSL 인증서 설치 필요 또는 프록시 사용

### CORS 에러
- 백엔드 CORS 설정 확인
- Netlify 도메인이 허용 목록에 포함되었는지 확인

### 환경 변수가 로드되지 않음
- Netlify에서 환경 변수가 설정되었는지 확인
- 재배포 필요 (환경 변수 변경 후)
- 브라우저 콘솔에서 `console.log(import.meta.env.VITE_API_URL)` 확인

