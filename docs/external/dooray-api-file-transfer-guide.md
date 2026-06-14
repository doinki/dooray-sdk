---
source: https://helpdesk.dooray.com/v2/wapi/shared-tree/9wWo-xwiR66BO5LGshgVTg/pages/3817617091196252578
pageId: "3817617091196252578"
subject: "파일 업/다운로드 관련 API 가이드"
breadcrumb: "Home / 🔌 Dooray! API / 서비스 API"
dooray_created_at: "2024-06-03T16:23:41+09:00"
dooray_updated_at: "2026-05-21T17:05:05+09:00"
note: |
  이 파일은 .github/workflows/sync-dooray-api-docs.yml 로 자동 갱신됩니다.
  손으로 편집하지 마세요. 업스트림이 갱신되면 bot/dooray-api-docs 브랜치에 PR 이 자동으로 열립니다.
---

# 파일 업/다운로드 관련 서비스 API 가이드

## 파일 업/다운로드 API

* Project > Projects > Posts
    * POST /project/v1/projects/{project-id}/posts/{post-id}/files - 업무에 첨부파일 업로드
    * GET /project/v1/projects/{project-id}/posts/{post-id}/files - 업무의 첨부파일 목록 조회
    * GET /project/v1/projects/{project-id}/posts/{post-id}/files/{file-id}?media=raw - 업무의 첨부파일 다운로드
* Drive > Drives > Files
    * POST /drive/v1/drives/{drive-id}/files?parentId={} - 드라이브에 파일 업로드
    * GET /drive/v1/drives/{drive-id}/files/{file-id}?media=raw - 드라이브의 파일 다운로드
    * PUT /drive/v1/drives/{drive-id}/files/{file-id}?media=raw - 드라이브의 파일 수정
* Wiki > Files
    * POST /wiki/v1/wikis/{wiki-id}/pages/{pageId}/files - 위키 페이지에 파일 업로드
    * POST /wiki/v1/wikis/{wikiId}/files - 위키에 파일 업로드

각 API의 상세 사용 방법은 [서비스 API](https://helpdesk.dooray.com/share/pages/9wWo-xwiR66BO5LGshgVTg/2939987647631384419) 문서를 참고해 주시기 바랍니다.

## 동작 과정

1. 서비스 API 문서에 명시된 API 주소로 요청
2. 307 응답과 location 헤더의 value(URL)를 확인
3. 전달받은 location(URL)로 Authorization, 파일 정보를 포함하여 재요청

### 업로드 예제

**1\. 서비스 API 문서에 명시된 API 주소로 요청**

```shell
$ curl -X POST 'https://api.dooray.com/project/v1/projects/3718869279517138805/posts/3817609631288388768/files' \
--header 'Authorization: dooray-api {서비스 API token}' \
--form 'file=@"/Users/nhn/image.gif"' \
--include
```

**2\. 307 응답과 location 헤더의 value(URL)를 확인**

```
HTTP/2 307
...
location: https://file-api.dooray.com/uploads/project/v1/projects/3718869279517138805/posts/3817609631288388768/files
```

**3\. 전달받은 location(URL)로 Authorization, 파일 정보를 포함하여 재요청**

```shell
$ curl -X POST 'https://file-api.dooray.com/uploads/project/v1/projects/3718869279517138805/posts/3817609631288388768/files' \
--header 'Authorization: dooray-api {서비스 API token}' \
--form 'file=@"/Users/nhn/image.gif"'

{"header":{"resultCode":0,"resultMessage":"","isSuccessful":true},"result":{"id":"3817615263301153584"}}
```

* 응답의 `result.id` 가 업로드된 파일의 ID 입니다.

**4\. 업무에 첨부파일이 정상 업로드되었는지 확인**

![Inline-image-2024-11-11 16.16.48.821.png](/share/tree/9wWo-xwiR66BO5LGshgVTg/pages/3817617091196252578/attach-files/3934302526405512581)

### 다운로드 예제

업로드와 마찬가지로 raw 파일 다운로드는 307 리다이렉트를 거칩니다. 위 업로드 예제에서 업로드한 파일을 다시 다운로드하는 경우입니다.

**1\. 첨부파일 목록을 조회하여 file-id를 확인**

```shell
$ curl -X GET 'https://api.dooray.com/project/v1/projects/3718869279517138805/posts/3817609631288388768/files' \
--header 'Authorization: dooray-api {서비스 API token}'

{"header":{"resultCode":0,"resultMessage":"","isSuccessful":true},"result":[{"id":"3817615263301153584","name":"image.gif","size":12345,"mimeType":"image/gif"}],"totalCount":1}
```

* `result[].id` 가 다운로드에 사용할 file-id 입니다. (목록 조회는 리다이렉트 없이 바로 응답)

**2\. 서비스 API 문서에 명시된 API 주소로 요청**

```shell
$ curl -X GET 'https://api.dooray.com/project/v1/projects/3718869279517138805/posts/3817609631288388768/files/3817615263301153584?media=raw' \
--header 'Authorization: dooray-api {서비스 API token}' \
--include
```

**3\. 307 응답과 location 헤더의 value(URL)를 확인**

```
HTTP/2 307
...
location: https://file-api.dooray.com/downloads/project/v1/projects/3718869279517138805/posts/3817609631288388768/files/3817615263301153584?media=raw
```

**4\. 전달받은 location(URL)로 Authorization을 포함하여 재요청, 응답 본문을 파일로 저장**

```shell
$ curl -X GET 'https://file-api.dooray.com/downloads/project/v1/projects/3718869279517138805/posts/3817609631288388768/files/3817615263301153584?media=raw' \
--header 'Authorization: dooray-api {서비스 API token}' \
--output image.gif
```

* `--output {파일명}` 으로 응답 본문을 파일로 저장합니다.

**5\. 파일이 정상 다운로드되었는지 확인**

## FAQ

**1\. Authorization 헤더 정보를 포함해서 요청했는데, 401 응답을 받았어요.**

-> 자동 리다이렉트 기능이 켜져 있는 경우, 동작 과정 1번 요청 시 자동으로 location 헤더 정보로 재요청을 보내게 됩니다. 이때, Authorization 헤더와 request body를 누락한 채 요청하여 401 응답을 받을 수 있습니다.

예) Postman 자동 리다이렉트 설정 off
![Inline-image-2024-11-11 16.17.12.623.png](/share/tree/9wWo-xwiR66BO5LGshgVTg/pages/3817617091196252578/attach-files/3934302727207966377)

**2\. 매번 location URL로 다시 요청하는 게 번거로워요. (curl)**

-> curl에서는 `--location-trusted` 옵션으로 리다이렉트를 자동으로 따라가면서 Authorization 헤더를 다음 호스트(file-api.dooray.com)까지 유지하여, 한 번의 명령으로 처리할 수 있습니다.

```shell
$ curl -X GET --location-trusted 'https://api.dooray.com/project/v1/projects/{project-id}/posts/{post-id}/files/{file-id}?media=raw' \
--header 'Authorization: dooray-api {서비스 API token}' \
--output image.gif
```

* `-L` / `--location` 만 사용하면 호스트가 바뀔 때 Authorization 헤더가 제거되어 401 응답을 받습니다. 반드시 `--location-trusted` 를 사용해야 합니다.
* `--location-trusted` 는 인증 정보를 리다이렉트된 호스트로 함께 전송하므로, 신뢰할 수 있는 주소에 대해서만 사용하시기 바랍니다.
