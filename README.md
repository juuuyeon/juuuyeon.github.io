# 박주연 Design Archive

## 개인 Git 저장소

- 전용 저장소: https://github.com/juuuyeon/juuuyeon.github.io
- 2026-11-20 요청 범위는 **비공개 저장소 생성 및 커밋·푸시**입니다. 공개 전환과 GitHub Pages 배포는 별도이며 자동 배포 workflow는 추가하지 않습니다.
- 사이트 코드, 실제 사이트 자산(public), 패키지 잠금 파일, 빌드·미리보기 도구를 버전 관리합니다.
- node_modules, dist, 개인 조사·이전 소스 사본(research), 과거 배포 자료(deployment), 일회성 로컬 가져오기 도구는 제외합니다. 아래 작업 기록의 해당 경로는 로컬에 보존되어 있습니다.
- 새 환경에서 개발: Node.js 22.12 이상에서 `npm ci --ignore-scripts` 후 `npm run dev`.
- 프로덕션 이미지 빌드에는 Python 3 및 Pillow도 필요합니다. 예: `python3 -m venv .venv`, `source .venv/bin/activate`, `python -m pip install Pillow`, `npm run build`.
- 공개 전환 전에는 소스·Git 이력뿐 아니라 public의 이미지·영상·PDF와 회사 프로젝트 자료의 공개 범위를 검토해야 합니다. 현재 저장소명만으로 사이트가 배포되는 것은 아닙니다.

## 2026-11-20 프로젝트 상세 읽기 경험 정리

- MIT 오픈소스 Futura·Mara·Foundry의 상세 구조를 참고해 기존 공통 상세의 정보 계층과 여백, 목차, 이미지, 다음 프로젝트를 정리했습니다. 제3자 코드·작품을 가져오거나 의존성을 추가하지 않았습니다.
- WITIM Product의 본문 장표 5개는 모바일에서도 읽을 수 있는 웹 본문으로 재구성했고, 원본 장표는 각 섹션에서 펼쳐 볼 수 있습니다. 다른 사례의 장표는 기존 형식을 유지합니다.
- Pretendard, 실제 내용·이미지, 한국어 기본값과 점 커서를 유지했습니다. 외부 배포 없이 로컬만 갱신했습니다.
- 범위·출처·백업·빌드 및 화면 검수: [상세 기록](research/case-study-refresh-20261120/README.md).

## 2026-11-09 GitHub 브랜딩 원본 반영

- 개인 GitHub의 `juuuyeon/witim_ax_studio` 리파인 원본과 `juuuyeon/yeosu_branding` 여수 쇼케이스를 확인했습니다.
- 각 main 커밋을 고정해 이미지·영상 26개를 가져왔습니다. 다운로드 파일의 Git blob SHA와 SHA256을 확인했습니다.
- 리파인: 컬러 표지, Essence·Balance·Refine, Cream·Taupe·Ink, 데스크톱 스크롤 영상, 모바일 화면 4개를 추가했습니다.
- 여수: 전후 로고, Flow 6색, 모션 시안, 적용 목업 9개를 연결했습니다. 실제 설치·집행 성과로 표시하지 않습니다.
- 기존 과정 장표는 유지하며, Selected work에서 원본을 활용한 상세 섹션을 볼 수 있습니다.
- 제목과 본문 서체는 사용자 요청대로 Pretendard를 유지합니다. 원본 이미지에 포함된 서체는 보존합니다.
- 원본의 날짜·개인 기여·성과 주장을 새로 확정하지 않았습니다. 여수 원본의 Primary 명칭 Blue와 값 #A24BFF가 불일치해, 이번에는 이름과 값이 확인되는 Flow 01–06만 사용했습니다.
- 두 저장소는 비공개입니다. 이 작업은 로컬 사이트 반영이며 GitHub 변경·push·외부 배포는 없습니다.
- 출처·원본 파일·커밋·해시·검증 기록: `research/github-branding-20261109/`.

## 2026-11-09 Plus X 방식 프로젝트 상세

프로젝트 클릭 시 `/projects/:id`의 독립 페이지가 열립니다. 넓은 16:9 장표를 아래로 이어 읽는 방식입니다. 분석 자료의 짧은 소개 → 판단 근거·설계 관계 → 큰 적용 이미지 흐름을 반영했습니다.

- 14개 항목에 독립 상세 제공. 기존 66쪽 포트폴리오 중 10개 사례의 53개 본문 장표를 연결했습니다.
- 나머지 4개 관련 작업은 확인된 작품 갤러리와 작업 설명을 제공합니다.
- 원본 장표의 Pretendard, 42px 메인 제목, 도형·연결선·이미지를 유지하고 1920px 기준으로 비례 축소합니다.
- 모바일은 별도의 읽기용 제목과 장표 내부 가로 스크롤을 제공합니다. 전체 페이지는 가로로 넘치지 않습니다.
- 목차 이동, 다음 프로젝트, 작업 목록 복귀, 이전 `?project=` 링크 호환을 제공합니다.
- 카드뉴스 추가 이미지 18장·영상 2개·템플릿 및 기존 갤러리를 유지합니다.
- 데스크톱 14개 경로·목차 대상, 390px 모바일, 장표가 참조하는 이미지 41개 HTTP 200, 프로덕션 빌드를 확인했습니다.
- 시각 검수 표본: 여수 브랜드·Refine·카드뉴스. 모든 원본 장표의 콘텐츠 전수 재검수를 뜻하지 않습니다.
- 출처·원본 해시·경로 검사·화면 캡처: `research/plusx-case-pages-20261109/`.
- WITIM 앱 소스 변경 및 외부 배포는 하지 않았습니다. 아래 이전 검증의 상세 dialog 항목은 이번 변경 전 기록입니다.

## 2026-11-09 카드뉴스 자동화 작업 추가

- Orca 탭 `08a56e81-d6ef-498b-b00e-25a990ed98c4`의 제작 기록을 확인했습니다.
- WITIM Stories에 정보형·퀴즈형·영상 소개형 3편, 카드 이미지 18장과 영상 2개를 추가했습니다.
- 11월 6일 편집 원본과 연결되는 11월 7일 Figma 내보내기본을 사용했습니다. 기존 작업 이미지 3장은 보존했습니다.
- 7종 템플릿 개요와 편집 가능한 Figma 원본 링크를 연결했습니다.
- 영상 원작은 @seoah_0919의 서아네 ep.22이며, 카드 편집·자동화 설계와 구분해 표기했습니다.
- 직접 보기: http://localhost:4178/projects/cardnews
- 출처·파일 해시·화면 검수 기록: `research/cardnews-addition-20261109/`.
- 추가 에셋 21개 HTTP 200, 원본 이미지 해시 일치, 카드 넘기기와 영상 2개 재생 확인. 빌드 통과.

실제 작업을 모아 보는 로컬 포트폴리오 홈페이지. 별도 프로젝트로 생성했으며 WITIM 소스·브랜치는 변경하지 않았습니다.

## 보기

- 로컬: http://localhost:4178/
- 같은 네트워크: http://172.30.1.48:4178/ (현재 Mac의 IP. 다른 네트워크에서는 바뀔 수 있음)
- 외부 배포하지 않았습니다.

```sh
npm ci --ignore-scripts
npm run dev
```

프로덕션 출력은 `npm run build` → `dist/`. React 19.3.1 / Vite 8.3.6 / Motion 14.9.1 / Lucide React 1.69.0 사용. 설치 버전은 package-lock.json에 고정되어 있습니다.

## 구성

- `src/main.jsx`: 홈과 /projects, 검색/분류, 그리드·목록
- `src/style.css`: Pretendard 기반 반응형 레이아웃
- `src/FluidScene.jsx`: 포인터 반응 WebGL 배경
- `src/interactions.jsx`: Lenis, 메뉴, 텍스트 롤링과 등장 효과
- `src/CaseStudyPage.jsx`, `src/case-study.css`: 프로젝트별 독립 상세 페이지
- `src/LandscapeScene.jsx`, `src/case-scenes.json`: 원본 장표의 텍스트·도형·이미지 렌더러
- `src/ProjectDetail.jsx`, `src/detail.css`: 공용 표지 및 이전 상세 구현 보존
- `src/projects.json`: 작품 및 설명·갤러리·관련 작업 데이터
- `public/work/`: 실제 작품 52개 이미지 사본
- `public/editions/`: 179쪽·36쪽·9월20쪽·11월6일 최신66쪽 포트폴리오 PDF
- `research/`: 출처, 조사 범위, 렌더 및 검사 기록

## 포함 범위

현재 10개 사례와 4개 관련 작업 묶음, 총14개 갤러리 항목을 제공합니다. 관련 캠페인은 독립적인 성과 사례로 중복 집계하지 않습니다.

| 작품 | 분류 | 원본 |
| --- | --- | --- |
| 여수새고막 브랜드 | Brand | `/Users/sumin/프로젝트/YEOSU SAEGOMAK_rebranding/showcase/public/brand/img/목업_img` |
| WITIM 업무 협업 UX | Product | `2026-11-05-plusx-rebuild/assets/p015,p017,p006` |
| Refine 브랜딩·웹 | Brand | 위 assets의 `p112,p121,p122,p124` |
| WITIM 랜딩/AX STUDIO | Web | WITIM `output/portfolio-v10/assets/landing-*.png` |
| 여수새고막 웹·어드민 | Web | 위 assets의 `p090,p102,p104` |
| WITIM 디자인 시스템 | System | 위 assets의 `p020,p036,detail-button` |
| WITIM Stories | Content | 위 assets의 `p130,p141` |
| 스토어 이미지 툴킷 | System | 위 assets의 `p164,p166` |
| 명함 제작 시스템 | System | 위 assets의 `p148,p159` |
| WITIM 측정·운영 UX | Product | v9 cases.json의 측정 설계; 웹 표지는 개념 도식 |
| WITIM CPP 모집 광고 | Content | `output/witim-cpp-recruitment-timi-20261026-v2/images` |
| 금요일 오후5시 만화 | Content | `output/witim-performance-comic-20261026-v1/images` |
| 엄지 반응 만화 | Content | `output/witim-thumbsup-comic-20261026-v2/images` |
| WITIM 채용 경험 | Web | `output/careers-20261019` |

이전 작업: 원본 Figma `UrCUYlf1pYFsBa4R035D54`의 `2025_포폴` 메타데이터에서 JNJ 디자인 시스템, 게임 아이템 거래 앱의 실재를 확인해 링크로 연결했습니다. JNJ의 위드랜드 컴포넌트는 독립 프로젝트로 추가하지 않았습니다. 과거 인터뷰·성과 수치를 검증 없이 재사용하지 않았습니다.

### 범위와 한계

- 현재10개는 `/Users/sumin/Desktop/개인 포트폴리오/2026-11-03-시각화-v9/cases.json`의 내용 기반.
- 9월20쪽과 11월버전들은 같은 프로젝트를 다르게 구성한 포트폴리오 버전입니다.
- SSD의 w.dot 12개항목은 소스가 더미임을 명시하므로 제외했습니다. Plus X 타사 레퍼런스도 본인 작품으로 넣지 않았습니다.
- Desktop/Downloads/프로젝트에서 과거 JNJ·게임앱 관련 파일명 및 추출 가능 PDF1,124개 텍스트를 추가 검색했지만 대응 원본은 찾지 못했습니다. 스캔PDF OCR 전수검사는 아닙니다.
- 구Figma 메타데이터 1회 읽기 후 원본파일 Starter 플랜 MCP 한도가 소진됐습니다. Ego 브라우저 원본링크는 로그인 요청 화면이었습니다. 두 이전작업의 대표이미지는 추가하지 못했으며, 현재 파일의66장과 별개입니다.
- 홈페이지가 알려지지 않은 모든 과거 프로젝트를 빠짐없이 확보했다는 의미는 아닙니다. 현재 확인 가능한 자료에서 실재 확인된 작업을 포함했습니다.
- 공개 배포 전 원본 Figma의 공유 권한과 최종 공개할 작품·기여 설명 검토가 필요합니다. 여기서는 로컬 열람만 제공합니다.

## 검증

`research/verification.json`, desktop/mobile PNG 참조.

- localhost/LAN 및 PDF4개 HTTP200.
- 1440px desktop /390px mobile 가로넘침 없음.
- 분류 Brand2개 /검색Refine1개, 목록전환, 검색무결과/초기화14개.
- 상세 딥링크, Escape닫기, Tab/Shift+Tab포커스순환, 모바일고정닫기 검증.
- reduced-motion에서 전환/스크롤모션 비활성화 확인.
- 참조 이미지 파일 누락0. 실제브라우저 렌더에서 깨진이미지0.
- 프로덕션build성공. Vite8이 Motion/Lucide의 `use client` 모듈지시문에 경고하지만 SPA출력은 정상 생성됨.
- 화면샘플은 홈/작업목록/아카이브/Refine·여수상세를 검수했습니다. 모든 원본장표의 내용검수를 의미하지 않습니다.

## 2026-11-06 최신 장표 동기화

`2026-11-06-plusx-figma/portfolio-plusx-20261106.pdf`를 `/editions/portfolio-20261106.pdf`로 복사해 네 번째 PDF로 연결했습니다. 66쪽, Pretendard42 메인 제목과20개 시각화가 반영된 버전이며 기존179/36/20쪽 버전은 보존했습니다.

## 2026-11-09 CRZ 구조·인터랙션 재구성

[CRZ Studio](https://www.crz.studio/)의 실제 브라우저 화면을 확인하고, 큰 워드마크 → 소개 → 작품 그리드 → 분야별 행 → 하단 화면 구조를 적용했습니다. 전체 화면 메뉴의 블러·마퀴, 작품 호버의 보조 이미지, 문자별 롤링 링크, 스크롤 등장과 관성 스크롤을 재현했습니다. 콘텐츠는 박주연의 기존 프로젝트와 포트폴리오 아카이브를 사용합니다. 원본의 연락 폼은 연결되지 않은 폼을 만들지 않고 아카이브로 대체했습니다.

검정·실버 유체 배경은 직접 작성한 WebGL 셰이더이며 CRZ 원본 시뮬레이션을 복사한 것은 아닙니다. Lenis를 추가 설치했고 잠금 파일에 버전을 기록했습니다. Pretendard와 실제 작업 이미지, PDF 4개를 유지합니다.

- 현재 검증: `research/crz-qa/verification.json`, 같은 폴더의 화면 캡처.
- 관찰·구현 기준: `research/crz-reference/implementation-plan.md`.
- 변경 전 복원용 사본: `research/pre-crz-backup/`.
- 배경은 최대 약 31fps, DPR 1.2로 제한합니다. 숨겨진 탭에서는 렌더를 쉬고 모션 줄이기에서는 정지합니다.
- 메뉴 포커스 이동·순환·Escape, 모바일 상세 닫기, 검색·분류·목록 전환을 확인했습니다.
- 빌드 경고는 Lucide의 use client 지시문 2건이며 빌드 결과는 정상입니다.


## 2026-11-11 내부 자료 열람 전환

여수 디자인 장표·IA·운영 가이드와 카드뉴스 템플릿을 `public/resources/`의 내부 HTML/PDF로 연결했습니다.
Figma 실제 원본에서 이전 포트폴리오 39장과 여수 웹·어드민·가이드·IA 132개를 추가했습니다. 내부 뷰어 9개와 PDF 9개로 열람하며, 검색·분류·확대·목록 복귀를 지원합니다. 원본 확인에 따라 JNJ 디자인 시스템 표기는 WITHLAND 디자인 시스템으로 수정했습니다.
상세 범위와 검증: `research/internal-content-20261111/README.md`.

## 2026-11-11 수정 가능한 콘텐츠와 WebP 배포

현재 콘텐츠는 계속 수정할 포트폴리오 뼈대입니다. 원본을 보존하고 `npm run build`에서 WebP 변환·경로 교체·배포 파일 선별을 자동 수행합니다. 이미지 293개를 변환했고 전체 배포본은 약 399MB에서 315MB로 줄었습니다.

내용 교체 방법: `deployment/CONTENT-UPDATES.md`. 최적화 검증: `research/webp-optimization/README.md`.

## 2026-11-12 AI 숏폼

주연 바이럴의 원본 숏폼 9편을 `/projects/shortform`에 추가했습니다. 홈과 Content 목록에서 접근하며 영상 선택·재생·전체 화면·구간 이동을 지원합니다. 1080×1920 원본 해상도와 오디오는 유지하고, 웹 영상은 약 143.7MB에서 114.3MB로 압축했습니다. 제목·설명·순서는 `src/shortform-films.json`에서 교체합니다. 검증 및 출처는 `research/shortform-20261112/README.md`입니다.
