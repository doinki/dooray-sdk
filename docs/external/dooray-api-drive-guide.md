---
source: https://helpdesk.dooray.com/v2/wapi/shared-tree/9wWo-xwiR66BO5LGshgVTg/pages/2939993203869661812
pageId: "2939993203869661812"
subject: "드라이브 API 활용 가이드"
breadcrumb: "Home / 🔌 Dooray! API / 서비스 API"
dooray_created_at: "2021-02-08T19:01:41+09:00"
dooray_updated_at: "2025-04-28T13:10:32+09:00"
note: |
  이 파일은 .github/workflows/sync-dooray-api-docs.yml 로 자동 갱신됩니다.
  손으로 편집하지 마세요. 업스트림이 갱신되면 bot/dooray-api-docs 브랜치에 PR 이 자동으로 열립니다.
---

## 기본

### End Point

* 퍼블릭 환경
    * [https://api.dooray.com](https://api.dooray.com)
* 공공 환경
    * [https://api.gov-dooray.com](https://api.gov-dooray.com)
* 금융 환경
    * [https://api.dooray.co.kr](https://api.dooray.co.kr)
###

* 사용자별 최대 요청수: 초당 20

### 인증

#### 개인 API 인증 토큰 사용 방법

* API 호출시 Authoization 헤더와 함께 사용합니다.
* 실제 요청 시 TOKEN 앞뒤의 { }는 사용하지 않습니다.

```
$ curl -H 'Authorization: dooray-api {TOKEN}' {End Point}/drive/v1/drives
```

### 사용자 개인 드라이브 목록

#### GET /drive/v1/drives?type=private

* 응답 예시

``` javascript
{
  "header": {
    "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
  },
  "result": [
    {
      "id": "123456789",
      "project": {
        "id": null
      },
      "name": "내 드라이브",
      "type": "private"
    }
  ],
  "totalCount": 1
}
```

### 특정 드라이브의 특정 폴더내 item 확인

#### GET /drive/v1/drives/{drive-id}/files?parentId={folder-id}

* parentId: root폴더의 경우
    * `parentId=root` 가능
    * GET /drive/v1/drives/{drive-id}/files?parentId=root
* parameters

``` javascript
type=folder|file /* 타입 필터, 없으면 folder, file 모두 반환됨 */
parentId={} 
page={}
size={}
```

* 요청 예시

``` javascript
    - /drive/v1/drives/123456789/files?parentId=root // root(최상위) 폴더 조회 
    - /drive/v1/drives/123456789/files?parentId=1000 // parentId 하위 폴더와 파일 조회
    - /drive/v1/drives/123456789/files?parentId=1000&type=folder // parentId 하위 폴더 조회
    - /drive/v1/drives/123456789/files?parentId=1000&type=file&page=0&size=10 // parentId 하위 파일 조회, 페이지 번호 0번 10개 항목
```

* 응답 예시

``` javascript
{
  "header": {
    "isSuccessful": true,
        "resultCode": 0,
        "resultMessage": ""
  },
  "result": [
    {
      "id": "1000",
      "name": "foo",
      "version": 0,
      "createdAt": "2018-02-07T08:03:02Z",
      "updatedAt": "2018-02-07T08:03:02Z",
      "hasFolders": false,
      "mimeType": "application/vnd.dooray-drive.folder",
      "size": 1000,
      "annotations": {},
      "creator": {},
      "lastUpdater": {},
      "type": "folder",
      "subType": "users"
    },
    {
      "id": "2000",
      "name": "sample.txt",
      "version": 0,
      "createdAt": "2019-03-29T10:45:25Z",
      "updatedAt": "2019-08-01T02:03:11Z",
      "hasFolders": null,
      "mimeType": "text/plain",
      "size": 26,
      "annotations": {},
      "creator": {},
      "lastUpdater": {},
      "type": "file",
      "subType": "doc"
    }
  ],
  "totalCount": 2
}
```

### 특정 드라이브 - 특정 폴더 - 특정 파일의 content download

### GET /drive/v1/drives/{drive-id}/files/{file-id}?media=raw

* 요청 > 307(Redirect) 응답 확인 > Location 필드의 값으로 재 요청 필요
* 요청 예시

1. `GET /drive/v1/drives/123456789/files/2000?media=raw`

```
HTTP/1.1 307 Temporary Redirect
...
Location: https://file-api.dooray.com/downloads/drive/v1/drives/123456789/files/2000?media=raw
```

2. `GET https://file-api.dooray.com/downloads/drive/v1/drives/123456789/files/2000?media=raw`

``` javascript
HTTP/1.1 200 OK
Content-Type: text/plain;charset=UTF-8
Content-Length: 26
...
Content-Disposition: attachment; filename="sample.txt"

abcdefghijklmnopqrstuvwxyz
```

### 특정 드라이브 - 특정 폴더 - 특정 파일의 content upload

### POST /drive/v1/drives/{driveId}/files?parentId={parentId}

* 파라미터
    * parentId: 파일을 업로드하는 폴더 ID (필수값)
    * 파일목록 응답중 type이 folder
* 요청 > 307(Redirect) 응답 확인 > Location 필드의 값으로 재 요청 필요
* 요청 예시

1. `POST /drive/v1/drives/{driveId}/files?parentId={parentId}`

``` sh
curl -v -X POST "https://api.dooray.com/drive/v1/drives/{}/files?parentId={}" \
    -H "Authorization: dooray-api {token}" \
    -H "Content-Type: multipart/form-data; boundary=boundary" \
    -F "file=@/file/path/to/upload/file.png;filename=file.png;type=image/png"

---

< HTTP/2 307 
...
< location: https://file-api.dooray.com/uploads/drive/v1/drives/{}/files?parentId={}
< x-request-id: xxxxxx
<
```

2. `1` 응답으로 HTTP/1.1 307 Temporary Redirect 응답을 합니다.
응답 헤더중 `Location`: 값 `https://file-api.dooray.com/uploads/drive/v1/drives/{driveId}/files?parentId={parentId}` 로 재요청 되어야합니다.

``` sh
curl -v -X POST "https://file-api.dooray.com/uploads/drive/v1/drives/{}/files?parentId={}" \
    -H "Authorization: dooray-api {token}" \
    -H "Content-Type: multipart/form-data; boundary=boundary" \
    -F "file=@/file/path/to/upload/file.png;filename=file.png;type=image/png"
```

3. `2`의 응답결과 아래와 같은 응답이 나옵니다.

``` javascript
{
   "header":{
      "resultCode":0,
      "resultMessage":"",
      "isSuccessful":true
   },
   "result":{
      "id":"",
      ...
   }
}
```
<br>
<br>
### 특정 드라이브 - 특정 폴더 - 특정 파일의 content update

### PUT /drive/v1/drives/{driveId}/files/{fileId}?media=raw
<br>
* 파라미터
    * media: raw
* 요청 > 307(Redirect) 응답 확인 > Location 필드의 값으로 재 요청 필요
* 요청 예시

1. `PUT /drive/v1/drives/{driveId}/files/{fileId}?media=raw`

``` sh
curl -v -X PUT "https://api.dooray.com/drive/v1/drives/{}/files/{}?media=raw" \
    -H "Authorization: dooray-api {token}" \
    -H "Content-Type: multipart/form-data; boundary=boundary" \
    -F "file=@/file/path/to/upload/file.png;filename=file.png;type=image/png"

---

< HTTP/2 307 
...
< location: https://file-api.dooray.com/uploads/drive/v1/drives/{}/files/{}
< x-request-id: xxxxxx
<
```

2. `1` 응답으로 HTTP/1.1 307 Temporary Redirect 응답을 합니다.
응답 헤더중 `Location`: 값 `https://file-api.dooray.com/uploads/drive/v1/drives/{driveId}/files/{}` 로 재요청 되어야합니다.

``` sh
curl -v -X PUT "https://file-api.dooray.com/uploads/drive/v1/drives/{}/files/{}" \
    -H "Authorization: dooray-api {token}" \
    -H "Content-Type: multipart/form-data; boundary=boundary" \
    -F "file=@/file/path/to/upload/file.png;filename=file.png;type=image/png"
```

3. `2`의 응답결과 아래와 같은 응답이 나옵니다.

``` javascript
{
   "header":{
      "resultCode":0,
      "resultMessage":"",
      "isSuccessful":true
   },
   "result":{
      "id":"",
      "version": 
   }
}
```
