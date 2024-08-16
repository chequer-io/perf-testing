#  성능테스트 환경구성 안내
  
QueryPie 제품에 대한 성능테스트를 수행하기 위한 환경을 구성하는 방법을 안내합니다.

# 기본구성

3대의 VM 에 QueryPie, MySQL, Grafana K6 등을 설치하여 성능테스트를 수행합니다.
각 VM 에 설치하고 실행하는 세부 요소는 다음과 같습니다.
- VM #1
    - QueryPie server : 테스트 대상
    - prometheus/node_exporter
- VM #2
    - MySQL server : QueryPie 의 Meta DB, Log DB 를 담당
    - prometheus/node_exporter
- VM #3
    - Grafana : Metric 시각화
    - Prometheus Server
    - prometheus/node_exporter

# 준비할 사항

QueryPie Server, MySQL, Redis 를 설치하고 실행합니다.
이 가운데, 시스템 자원을 주로 사용하는 두가지 소프트웨어, QueryPie Server 와 MySQL 을 서로 다른 VM 에 
설치하여 시스템 이용 지표를 측정하는 것을 권장합니다.

# 성능 테스트 소프트웨어 설치방법

1. 이 디렉토리(perf-testing) 아래의 파일과 디렉토리를 .tar.gz 으로 저장합니다.
    - cd querypie-mono
    - git archive --format=tar.gz -o ../perf-testing.tar.gz HEAD:infra/perf-testing
2. perf-testing.tar.gz 파일을 테스트 대상 서버에 복사하여 옮기고, 압축을 해제합니다.
    - tar zxvf perf-testing.tar.gz

## Node Exporter

리눅스 시스템의 CPU, Memory, Disk IO, Network IO 이용량 지표를 수집하기 위해, 각 VM 에 모두 설치합니다.

- 실행하기
    - cd node-exporter
    - docker-compose up --detach
- 종료하기
    - cd node-exporter
    - docker-compose down

## Prometheus Server

TODO(JK)

## Grafana

TODO(JK)

# 참고자료

- [QueryPie DAC 성능 테스트 시연 - 24년 8월](https://docs.google.com/presentation/d/1zltUQkTRYeWAS4JtlHN1JhZ5c-NcrGzD/edit?usp=sharing&ouid=106854970109490887766&rtpof=true&sd=true)
