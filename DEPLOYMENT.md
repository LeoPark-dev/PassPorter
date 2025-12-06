# PassPorter Vercel 배포 가이드

## 1단계: GitHub 저장소 생성 및 코드 푸시

### 1.1 GitHub 저장소 생성
1. [GitHub](https://github.com)에 로그인
2. 우측 상단의 "+" 버튼 클릭 → "New repository" 선택
3. 저장소 이름 입력 (예: `passporter`)
4. "Public" 또는 "Private" 선택
5. **"Initialize this repository with a README"는 체크하지 마세요** (이미 로컬에 코드가 있으므로)
6. "Create repository" 클릭

### 1.2 로컬 저장소와 GitHub 연결
터미널에서 다음 명령어를 실행하세요:

```bash
# GitHub 저장소 URL을 확인하고 아래 명령어 실행
# 예: https://github.com/your-username/passporter.git
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

**참고**: `YOUR_USERNAME`과 `YOUR_REPO_NAME`을 실제 GitHub 사용자명과 저장소 이름으로 변경하세요.

## 2단계: Vercel 배포

### 2.1 Vercel 계정 생성
1. [vercel.com](https://vercel.com) 접속
2. "Sign Up" 클릭
3. "Continue with GitHub" 선택하여 GitHub 계정으로 로그인
4. GitHub 권한 승인

### 2.2 프로젝트 Import
1. Vercel 대시보드에서 "Add New..." → "Project" 클릭
2. GitHub 저장소 목록에서 방금 생성한 `passporter` 저장소 선택
3. "Import" 클릭

### 2.3 빌드 설정
Vercel이 자동으로 Vite 프로젝트를 감지하므로 다음 설정이 자동으로 적용됩니다:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

설정을 확인하고 "Deploy" 버튼을 클릭하지 마세요. 먼저 환경 변수를 설정해야 합니다.

### 2.4 환경 변수 설정
1. 프로젝트 설정 화면에서 "Environment Variables" 섹션 찾기
2. 다음 환경 변수들을 추가:

   **변수 1:**
   - Name: `VITE_NEWS_API_KEY`
   - Value: (News API 키 입력)
   - Environment: Production, Preview, Development 모두 선택

   **변수 2:**
   - Name: `VITE_GEMINI_API_KEY`
   - Value: (Gemini API 키 입력)
   - Environment: Production, Preview, Development 모두 선택

3. 각 변수 추가 후 "Save" 클릭

### 2.5 배포 실행
1. 모든 환경 변수를 추가한 후
2. "Deploy" 버튼 클릭
3. 배포가 완료될 때까지 대기 (약 1-2분)

### 2.6 배포 확인
1. 배포가 완료되면 "Visit" 버튼이 나타납니다
2. 클릭하여 배포된 사이트 확인
3. URL 형식: `https://passporter-xxxxx.vercel.app`

## 3단계: 배포 후 확인사항

### 3.1 기능 테스트
- [ ] 초기 화면 로드 확인
- [ ] Globe 및 텍스트 표시 확인
- [ ] News API 동작 확인 (오른쪽 패널)
- [ ] Gemini API 동작 확인 (서류작성 연습, AI와 연습하기)
- [ ] 환경 변수가 올바르게 적용되었는지 확인

### 3.2 News API CORS 문제 해결
프로덕션 환경에서는 `/api/news` Serverless Function을 통해 News API를 호출하도록 설정되어 있습니다. 
개발 환경에서는 `vite.config.js`의 proxy 설정을 사용합니다.

### 3.3 커스텀 도메인 설정 (선택사항)
1. Vercel 대시보드에서 프로젝트 선택
2. "Settings" → "Domains" 클릭
3. 원하는 도메인 입력
4. DNS 설정 안내에 따라 도메인 연결

## 문제 해결

### News API가 작동하지 않는 경우
- News API의 무료 플랜은 localhost에서만 작동합니다
- 프로덕션에서는 Developer 플랜($449/월) 이상이 필요합니다
- 또는 다른 뉴스 API 서비스를 사용하거나, 뉴스 기능을 선택적으로 비활성화할 수 있습니다

### 환경 변수가 적용되지 않는 경우
- Vercel 대시보드에서 환경 변수를 다시 확인
- 배포를 다시 실행 (Redeploy)
- 브라우저 캐시를 지우고 다시 시도

### 빌드 오류가 발생하는 경우
- Vercel 대시보드의 "Deployments" 탭에서 로그 확인
- 로컬에서 `npm run build` 실행하여 오류 확인
- `package.json`의 의존성 확인

## 추가 리소스
- [Vercel 공식 문서](https://vercel.com/docs)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)
- [News API 문서](https://newsapi.org/docs)

