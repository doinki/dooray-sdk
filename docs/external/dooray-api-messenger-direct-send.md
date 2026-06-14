---
source: https://helpdesk.dooray.com/v2/wapi/shared-tree/9wWo-xwiR66BO5LGshgVTg/pages/2939992834004986234
pageId: "2939992834004986234"
subject: "메신저 1:1 메시지 전송 API"
breadcrumb: "Home / 🔌 Dooray! API / 서비스 API"
dooray_created_at: "2021-02-08T19:00:57+09:00"
dooray_updated_at: "2025-04-08T11:00:39+09:00"
note: |
  이 파일은 .github/workflows/sync-dooray-api-docs.yml 로 자동 갱신됩니다.
  손으로 편집하지 마세요. 업스트림이 갱신되면 bot/dooray-api-docs 브랜치에 PR 이 자동으로 열립니다.
---

# 인증 참고

## API End Point

* 민간 클라우드
    * [https://api.dooray.com](https://api.dooray.com)
* 공공 클라우드
    * [https://api.gov-dooray.com](https://api.gov-dooray.com)

## 인증 토큰

### 개인 API 인증 토큰 발급 과정

* 개인설정 > API > 개인 인증 토큰 메뉴에서 생성합니다.

### 개인 API 인증 토큰 사용 방법

* API 호출시 Authoization 헤더와 함께 사용합니다.
* 실제 요청 시 TOKEN 앞뒤의 { }는 사용하지 않습니다.

```
# 민간 클라우드
$ curl -H 'Authorization: dooray-api {TOKEN}' https://api.dooray.com/project/v1/projects/{project-id}

# 공공 클라우드
$ curl -H 'Authorization: dooray-api {TOKEN}' https://api.gov-dooray.com/project/v1/projects/{project-id}
```

## 개인 API 인증 토큰 권한

* 토큰을 발급 받은 계정과 동일한 권한을 갖습니다.
* API 로 작업한 내용은 해당 사용자가 로그인하여 Dooray 를 직접 사용하는 것과 차이가 없습니다.
* ACL 도 해당 계정에 적용되는 것과 동일하게 적용됩니다. (IP ACL, User ACL)

## 개인 API 인증 토큰 사용 방법

* API 호출시 Authoization 헤더와 함께 사용합니다. (아래 예시는 민간클라우드의 예시입니다. `api.dooray.com`)
* 예

```
$ curl -H 'Authorization: dooray-api {TOKEN}' -H 'Content-Type: application/json' -d '{"text":"Hello World","organizationMemberId":"{ORGANIZATION_MEMBER_ID}"}' https://api.dooray.com/messenger/v1/channels/direct-send
```

# 1:1 메시지 API 가이드

## 준비 사항

1:1 API는 계정과 계정 사이에 메시지를 전송하는 API 입니다.
메시지를 보낼 두레이 계정이 필요합니다.

예시)
만일 고객사 내에 '전자 결재'와 같은 시스템에서 개개인에게 메시지를 전송하기 위해서는 '전자 결재' 시스템에 대응하는 두레이 계정을 만들어야 합니다.
'전자 결재' 시스템 계정을 만든 다음, 그 계정의 API 토큰을 발급 받아서 다음 가이드에 따라 메시지를 전송합니다.

## Step1. 대상 조회

* 멤버 검색 조건:
    * name={}
    * externalEmailAddresses={},{} // max 10개
    * userCode = {}
    * idProviderUserId = {} // id provider에서 제공하는 userId, sso의 경우는 기업에서 제공하는 사번등이 될 수 있음, IAM의 경우에는 UUID(사용자 인지가 어려움)
    * page={} /\* 시작: 0, 기본값: 0 \*/
    * size={} /\* 기본값: 20, 최댓값: 100 \*/
* 요청

```
$ curl -H 'Authorization: dooray-api {TOKEN}' -H 'Content-Type: application/json' https://api.dooray.com/common/v1/members?name=john
```

* 응답

```
{
    "header": {
        "resultCode": 0,
        "resultMessage": "",
        "isSuccessful": true
    },
    "result": [
        {
            "id": "1",
            "userCode": "user1",
            "name": "john",
            "externalEmailAddress": "user1@mail.com"
        }
    ],
    "totalCount": 1
}
```

## Step 2. 메시지 전송

* Step 1의 응답에서 `id`를 요청 필드 `organizationMemberId`로 사용함
* 요청 바디 구성
    * text: 메시지
    * organizationMemberId: 메시지를 보낼 대상의 id

```java
$ curl -H 'Authorization: dooray-api {TOKEN}' -H 'Content-Type: application/json' -d '{"text":"Hello World","organizationMemberId":"1"}' https://api.dooray.com/messenger/v1/channels/direct-send
```

* 응답

```javascript
{
    "header": {
        "resultCode": 0,
        "resultMessage": "",
        "isSuccessful": true
    },
    "result": null
}
```

# API 스펙

## [POST /messenger/v1/channels/direct-send](https://helpdesk.dooray.com/share/pages/9wWo-xwiR66BO5LGshgVTg/2939987647631384419#UE9TVC0vbWVzc2VuZ2VyL3YxL2NoYW5uZWxzL2RpcmVjdC1zZW5k)

### 요청

* 헤더
    * Authorization: dooray-api {TOKEN}
* 바디

```java
{
  "text":"Hello World!!",
  "organizationMemberId" : "1"
}
```

### 응답

* 바디

```javascript
{
    "header": {
        "resultCode": 0,
        "resultMessage": "",
        "isSuccessful": true
    },
    "result": null
}
```

* HTTP 응답 코드
    * 200
    * 401
    * 403
    * 404
    * 409
    * 500
