# Workation CI/CD 점검 정리

작성 기준: 현재 체크아웃 브랜치 `zzz/kyw`

## 현재 상태 요약

- 현재 브랜치: `zzz/kyw`
- 배포 트리거 브랜치: `main`
- 백엔드 빌드: `./gradlew bootJar` 성공
- 프론트 빌드: `npm run build -- --mode production` 실패
- 현재 `zzz/kyw`는 `origin/main`과 갈라져 있음
  - `origin/main`보다 3커밋 뒤
  - `origin/main`보다 5커밋 앞

## 현재 CI/CD 구조

### 백엔드

파일: `.github/workflows/backend-deploy.yml`

흐름:

```text
main push
  -> workation/back/** 변경 감지
  -> GitHub Actions 실행
  -> application-private.properties 생성
  -> JDK 21 세팅
  -> ./gradlew bootJar
  -> Docker image build
  -> Docker Hub push
  -> EC2 SSH 접속
  -> 기존 컨테이너 stop/rm
  -> 새 컨테이너 docker run
```

### 프론트엔드

파일: `.github/workflows/frontend-deploy.yml`

흐름:

```text
main push
  -> workation/front/** 변경 감지
  -> Node 18 세팅
  -> npm install
  -> npm run build
  -> AWS credential 설정
  -> S3 sync
  -> CloudFront invalidation
```

## 즉시 막히는 문제

### 1. 현재 브랜치의 프론트 빌드 실패

파일:

```text
workation/front/src/features/member/components/login/SocialLoginButtons.jsx
```

문제:

```jsx
<<<<<<< HEAD
=======
>>>>>>> ...
```

merge conflict marker가 중첩으로 남아 있어 Vite build가 실패한다.

결과:

```text
[vite:esbuild] Transform failed
Unexpected "<<"
```

영향:

- 현재 `zzz/kyw`를 그대로 `main`에 merge하면 프론트 CI/CD는 build 단계에서 실패한다.
- S3 업로드와 CloudFront invalidation까지 진행되지 않는다.

수정 방향:

- conflict marker 제거
- env 기반 코드만 유지
- hardcoded AWS OAuth 값 제거

권장 형태:

```js
const NAVER_REDIRECT_URI = import.meta.env.VITE_NAVER_REDIRECT_URI;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
```

### 2. 현재 브랜치의 프론트 S3 sync 경로 오류

현재 `zzz/kyw` 기준:

```yaml
aws s3 sync ./workation/frontend/dist s3://${{ secrets.S3_BUCKET_NAME }} --delete
```

문제:

- 실제 프론트 폴더는 `workation/front`
- Vite 빌드 결과물은 `workation/front/dist`
- `workation/frontend/dist` 경로는 존재하지 않음

수정:

```yaml
aws s3 sync ./workation/front/dist s3://${{ secrets.S3_BUCKET_NAME }} --delete
```

참고:

- `origin/main`에는 이미 이 수정이 들어가 있음
- 현재 브랜치 `zzz/kyw`에는 아직 반영되지 않은 상태

## 백엔드 CI/CD 문제

### 1. Docker image tag가 `latest` 하나뿐임

현재:

```yaml
docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/sandykeyboard:latest .
docker push ${{ secrets.DOCKERHUB_USERNAME }}/sandykeyboard:latest
```

문제:

- 어떤 커밋이 배포됐는지 추적하기 어려움
- 장애 발생 시 롤백이 어려움
- EC2에서 항상 `latest`를 pull하므로 배포 재현성이 낮음

개선:

```yaml
docker build \
  -t ${{ secrets.DOCKERHUB_USERNAME }}/sandykeyboard:latest \
  -t ${{ secrets.DOCKERHUB_USERNAME }}/sandykeyboard:${{ github.sha }} .

docker push ${{ secrets.DOCKERHUB_USERNAME }}/sandykeyboard:latest
docker push ${{ secrets.DOCKERHUB_USERNAME }}/sandykeyboard:${{ github.sha }}
```

EC2 실행도 SHA 태그 기준으로 변경:

```bash
sudo docker run -d \
  --name sandykeyboard \
  --restart unless-stopped \
  -p 8001:8001 \
  ${{ secrets.DOCKERHUB_USERNAME }}/sandykeyboard:${{ github.sha }}
```

### 2. 기존 컨테이너를 먼저 죽이는 배포 방식

현재:

```bash
sudo docker stop sandykeyboard || true
sudo docker rm sandykeyboard || true
sudo docker run -d --name sandykeyboard -p 8001:8001 ...
```

문제:

- 새 컨테이너 실행 실패 시 바로 장애 발생
- health check 없음
- rollback 없음
- `--restart unless-stopped` 없음

최소 개선:

```bash
sudo docker run -d \
  --name sandykeyboard \
  --restart unless-stopped \
  -p 8001:8001 \
  image:tag
```

추가 권장:

```bash
sleep 10
curl -f http://localhost:8001/health
```

현재 actuator가 없다면 `/swagger-ui.html` 또는 public API endpoint로 임시 health check를 둔다.

### 3. 운영 프로필이 명확하지 않음

현재 `application.properties`에 로컬/AWS 설정이 섞여 있음.

문제 파일:

```text
workation/back/src/main/resources/application.properties
```

문제:

- AWS OAuth redirect가 선언된 뒤 아래쪽에서 로컬 redirect가 다시 선언됨
- 같은 key는 뒤쪽 값이 최종 적용될 가능성이 큼
- 서버 OAuth가 `localhost:5173`으로 튈 수 있음

권장 구조:

```text
application.properties
application-local.properties
application-prod.properties
```

CI/CD에서는 명확히 prod 프로필 사용:

```yaml
env:
  SPRING_PROFILES_ACTIVE: prod
```

또는 Docker 실행 시:

```bash
-e SPRING_PROFILES_ACTIVE=prod
```

## 프론트엔드 CI/CD 문제

### 1. `npm install` 사용

현재:

```yaml
npm install
npm run build
```

문제:

- CI에서 lockfile 기반 재현성이 떨어짐
- `package-lock.json` 기준 설치가 보장되지 않음

수정:

```yaml
npm ci
npm run build
```

### 2. 빌드 타임 환경변수 관리 필요

Vite는 `VITE_` 환경변수를 빌드 시점에 bundle에 주입한다.

권장:

```yaml
env:
  VITE_API_BASE_URL: https://api.sandykey.shop/api
  VITE_WS_URL: wss://api.sandykey.shop/ws-connect
  VITE_NAVER_REDIRECT_URI: https://sandykey.shop/oauth/callback/naver
  VITE_KAKAO_REDIRECT_URI: https://sandykey.shop/oauth/callback/kakao
  VITE_GOOGLE_REDIRECT_URI: https://sandykey.shop/oauth/callback/google
```

주의:

- `.env.production`을 repo에 계속 두는 방식은 환경 분리와 보안 관점에서 좋지 않음
- 공개되어도 되는 client id와 secret을 구분해야 함

### 3. AWS 런타임 하드코딩

현재 일부 프론트 코드에 localhost가 남아 있음.

확인된 예:

```text
workation/front/src/home/hooks/useNotification.js
workation/front/src/features/user/destination/pages/SpaceDetailPage.jsx
workation/front/src/features/user/destination/pages/StayDetailPage.jsx
workation/front/src/features/user/destination/pages/DestinationPage.jsx
workation/front/src/features/admin/pages/AdminBoardPage.jsx
```

문제 예:

```js
ws://localhost:80/ws-connect
http://localhost:80
http://localhost/api/public/files/...
```

영향:

- CI/CD는 성공해도 AWS에서 이미지, 파일, WebSocket이 깨질 수 있음

수정 방향:

- API URL: `VITE_API_BASE_URL`
- WebSocket URL: `VITE_WS_URL`
- asset/file URL: `VITE_ASSET_BASE_URL` 또는 백엔드 응답 URL 기준으로 통일

## 보안 문제

### 1. Git remote URL에 GitHub token 포함

현재 remote URL에 GitHub token이 포함되어 있음.

조치:

1. 해당 GitHub token 즉시 폐기
2. 새 token 발급 또는 SSH remote 사용
3. remote URL 변경

권장:

```bash
git remote set-url origin https://github.com/temtaemee/SandyKeyboard.git
```

또는 SSH:

```bash
git remote set-url origin git@github.com:temtaemee/SandyKeyboard.git
```

### 2. AWS/DB/JWT/Toss/Mail secret 평문 관리

위험 파일:

```text
workation/back/src/main/resources/application.properties
workation/back/src/main/resources/application-cloud.properties
workation/back/src/main/resources/application-private.properties
workation/front/.env
workation/front/.env.production
```

문제:

- AWS access key
- AWS secret key
- DB URL/username/password
- Gmail app password
- JWT secret
- Toss secret key
- OAuth key

등이 repo에 남아 있거나 tracked 상태임.

조치:

1. 노출된 key 전부 rotate
2. GitHub Secrets로 이동
3. repo에는 placeholder만 유지
4. `.gitignore` 강화
5. 이미 git history에 들어갔다면 history purge까지 검토

## 필요한 PR 검증 CI

현재는 `main` push 때만 배포 workflow가 돈다.

문제:

- PR 단계에서 빌드 실패를 미리 못 잡음
- 현재 `SocialLoginButtons.jsx` 같은 충돌 마커가 개인 브랜치에 남아도 main merge 전까지 자동 차단이 약함

권장 workflow:

```yaml
name: PR Check

on:
  pull_request:
    branches: [ "main" ]

jobs:
  backend-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
      - run: |
          cd workation/back
          chmod +x ./gradlew
          ./gradlew bootJar

  frontend-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: |
          cd workation/front
          npm ci
          npm run build
```

## 추천 최종 CI/CD 구조

```text
feature/* 또는 zzz/*
  -> PR 생성
  -> backend bootJar
  -> frontend npm ci && npm run build
  -> 통과해야 main merge 가능

main merge
  -> backend 변경 시 Docker build/push/EC2 deploy
  -> frontend 변경 시 Vite build/S3 sync/CloudFront invalidation
```

## 브랜치 전략

### 추천

```text
main
  운영 배포 전용
  직접 push 금지
  PR merge만 허용

develop
  통합 개발 브랜치
  배포 없음
  PR check만 실행

feature/*
  기능 작업 브랜치

hotfix/*
  운영 긴급 수정 브랜치
  main 먼저 반영 후 develop에도 반영
```

현재 브랜치 상황:

```text
zzz/kyw
  origin/main과 갈라져 있음
  현재 그대로 main merge 금지
```

필요 작업:

```bash
git fetch origin
git merge origin/main
# 또는
git rebase origin/main
```

이후 충돌 해결, 빌드 검증 후 PR 생성.

## 지금 당장 할 일

1. `zzz/kyw`에 `origin/main` 최신 반영
2. `SocialLoginButtons.jsx` conflict marker 제거
3. `frontend-deploy.yml` S3 경로를 `workation/front/dist`로 맞춤
4. `npm install`을 `npm ci`로 변경
5. PR check workflow 추가
6. 백엔드 Docker image에 `${{ github.sha }}` 태그 추가
7. EC2 `docker run`에 `--restart unless-stopped` 추가
8. health check 추가
9. prod/local profile 분리
10. Git remote token 제거 및 노출된 secret 전부 rotate

## 결론

`origin/main` 기준으로는 프론트 S3 경로와 `SocialLoginButtons.jsx` conflict 문제 일부가 해결되어 있다.

하지만 현재 체크아웃된 `zzz/kyw` 기준으로는:

- 프론트 빌드 실패
- S3 sync 경로 오류
- main과 브랜치 divergence 존재
- secret 관리 위험
- EC2 배포 rollback/health check 부재

때문에 아직 CI/CD 안정 상태라고 보기 어렵다.
