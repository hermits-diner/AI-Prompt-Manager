# Netlify에 배포하기

## 1. Netlify 연결 (처음 한 번)

1. **[netlify.com](https://www.netlify.com)** 접속 후 로그인 (또는 GitHub으로 가입)
2. **Add new site** → **Import an existing project**
3. **Deploy with GitHub** 선택
4. **GitHub** 권한 허용 후 **hermits-diner / AI-Prompt-Manager** 저장소 선택
5. **Branch to deploy**: `main` (기본값 그대로)
6. **Build settings** (netlify.toml이 있어서 자동으로 채워짐):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
7. **Deploy site** 클릭

## 2. 배포 완료 후

- 몇 분 뒤 **Site is live** 메시지와 함께 주소가 생성됩니다.  
  예: `https://random-name-12345.netlify.app`
- **Site settings** → **Domain management**에서 주소를 바꾸거나 커스텀 도메인을 연결할 수 있습니다.

## 3. 이후 업데이트

- **main** 브랜치에 `git push` 하면 Netlify가 자동으로 다시 빌드·배포합니다.
- 배포 상태는 Netlify 대시보드 **Deploys** 탭에서 확인할 수 있습니다.

## 문제가 생기면

- **Build failed**: Netlify 대시보드 → **Deploys** → 실패한 배포 클릭 → **Deploy log**에서 에러 메시지 확인
- **페이지가 안 뜸**: `netlify.toml`의 `publish = "dist"` 가 맞는지, 로컬에서 `npm run build` 가 성공하는지 확인
