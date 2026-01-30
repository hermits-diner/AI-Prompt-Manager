# AI 프롬프트 매니저 배포 가이드

이 프로젝트는 **Vite + React** 정적 SPA입니다. 빌드하면 `dist/` 폴더에 HTML, CSS, JS 파일이 생성되며, 이 파일들만 올리면 됩니다.

---

## 1. 로컬에서 빌드하기

```bash
npm run build
```

성공 시 `dist/` 폴더가 생성됩니다. 로컬에서 확인하려면:

```bash
npm run preview
```

브라우저에서 `http://localhost:4173` 등으로 접속해 동작을 확인할 수 있습니다.

---

## 2. 배포 방법 (추천 순)

### A. Vercel (가장 간단)

1. [vercel.com](https://vercel.com) 가입 후 로그인
2. **Add New** → **Project** → GitHub 저장소 연결 또는 `dist` 폴더 업로드
3. **Build Command**: `npm run build`  
   **Output Directory**: `dist`  
   **Install Command**: `npm install`
4. **Deploy** 클릭

- GitHub 연동 시: `main` 브랜치에 푸시할 때마다 자동 배포됩니다.

---

### B. Netlify

1. [netlify.com](https://www.netlify.com) 가입 후 로그인
2. **Add new site** → **Import an existing project** (Git 연결) 또는 **Deploy manually** (폴더 업로드)
3. Git 사용 시:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. **Deploy** 클릭

- 드래그 앤 드롭: 빌드한 `dist` 폴더를 Netlify 화면에 끌어다 놓으면 바로 배포됩니다.

---

### C. GitHub Pages

1. 저장소 이름이 `username.github.io`가 **아닌** 경우, `vite.config.ts`에서 `base`를 저장소 경로로 설정:

   ```ts
   base: '/AI_browser/',  // 저장소 이름에 맞게 변경
   ```

2. 빌드:
   ```bash
   npm run build
   ```

3. `dist` 폴더 내용을 **gh-pages** 브랜치에 푸시하거나, [gh-pages](https://www.npmjs.com/package/gh-pages) 패키지 사용:

   ```bash
   npx gh-pages -d dist
   ```

4. GitHub 저장소 **Settings** → **Pages** → Source를 **gh-pages** 브랜치로 선택 후 저장.

---

### D. Cloudflare Pages

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. 저장소 선택 후:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. **Save and Deploy**

---

### E. 직접 서버에 올리기 (Nginx, Apache 등)

1. 로컬에서 `npm run build` 실행
2. 생성된 `dist/` 폴더 전체를 서버의 웹 루트(예: `/var/www/html`)에 업로드
3. SPA이므로 **모든 경로를 `index.html`로 보내도록** 설정

**Nginx 예시:**

```nginx
server {
  listen 80;
  root /var/www/html;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## 3. 참고 사항

- **데이터 저장**: 프롬프트·카테고리·AI 링크는 브라우저 **localStorage**에만 저장됩니다.  
  → 다른 기기나 브라우저에서는 보이지 않으며, 캐시/데이터 삭제 시 초기화됩니다.
- **환경 변수**: 현재 외부 API 키 등은 사용하지 않으므로 별도 설정은 필요 없습니다.
- **HTTPS**: Vercel, Netlify, Cloudflare Pages, GitHub Pages는 기본적으로 HTTPS를 제공합니다.

이 중에서는 **Vercel** 또는 **Netlify**를 사용하는 방법이 가장 빠르고 간단합니다.
