# GitHub에 올리는 방법

로컬에서 Git 저장소는 만들어져 있고, 파일은 스테이징된 상태입니다.  
**아래 순서대로 진행**하면 GitHub에 올릴 수 있습니다.

---

## 1. Git 사용자 정보 설정 (처음 한 번만)

Git에 이름과 이메일이 없으면 커밋이 되지 않습니다. 터미널에서 실행하세요.

```bash
git config --global user.email "본인@이메일.com"
git config --global user.name "본인 이름"
```

---

## 2. 커밋하기

```bash
cd c:\cursor\projects\AI_browser
git commit -m "Initial commit: AI 프롬프트 매니저"
```

---

## 3. GitHub에서 새 저장소 만들기

1. [github.com](https://github.com) 로그인
2. 오른쪽 상단 **+** → **New repository**
3. **Repository name**: 예) `AI_browser` 또는 `ai-prompt-manager`
4. **Public** 선택
5. **"Add a README file"** 등은 체크하지 말고, **Create repository**만 클릭

---

## 4. 원격 저장소 연결 후 푸시

GitHub에서 저장소를 만든 뒤 나오는 안내에서 **"…or push an existing repository from the command line"** 부분을 사용합니다.

```bash
cd c:\cursor\projects\AI_browser
git remote add origin https://github.com/본인아이디/저장소이름.git
git branch -M main
git push -u origin main
```

- `본인아이디`: GitHub 사용자명  
- `저장소이름`: 3번에서 만든 저장소 이름  

예: `https://github.com/honggil-dong/ai-prompt-manager.git`

---

## 요약

| 단계 | 명령 |
|------|------|
| 1 | `git config --global user.email "..."` / `user.name "..."` |
| 2 | `git commit -m "Initial commit: AI 프롬프트 매니저"` |
| 3 | GitHub에서 새 저장소 생성 |
| 4 | `git remote add origin https://github.com/아이디/저장소.git` → `git branch -M main` → `git push -u origin main` |

이후에는 수정 후 `git add .` → `git commit -m "메시지"` → `git push` 로 올리면 됩니다.

---

## 한글 커밋 메시지 (GitHub에서 깨지지 않게)

Windows 터미널 기본 인코딩이 CP949라서, 한글 커밋 메시지가 GitHub에서 깨질 수 있습니다.

**방법 1 – 스크립트 사용 (권장)**  
프로젝트 루트에서:

```powershell
git add .
.\scripts\commit-ko.ps1 -m "한글 커밋 메시지"
git push
```

**방법 2 – 터미널에서 UTF-8 설정 후 커밋**  
PowerShell에서:

```powershell
chcp 65001
git add .
git commit -m "한글 커밋 메시지"
git push
```

이 저장소에는 이미 `i18n.commitEncoding=utf-8` 이 설정되어 있어, UTF-8로 저장된 메시지는 GitHub에서 정상 표시됩니다.
