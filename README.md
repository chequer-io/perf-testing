#  성능테스트 환경구성 안내
  
QueryPie 제품에 대한 성능테스트를 수행하기 위한 환경을 구성하는 방법을 안내합니다.

# 성능테스트를 위한 소프트웨어 구성 예시

3대의 VM 에 QueryPie, MySQL, Grafana K6 등을 설치하여 성능테스트를 수행합니다.
각 VM 에 설치하고 실행하는 세부 요소는 다음과 같습니다.

- VM #1
    - QueryPie Server : 테스트 대상
    - prometheus/node_exporter
- VM #2
    - MySQL Server : QueryPie 의 Meta DB, Log DB 를 담당
    - Redis Server : QueryPie 의 Redis cache 를 담당
    - prometheus/node_exporter
- VM #3
    - Grafana : Metric 시각화
    - Prometheus Server
    - prometheus/node_exporter

# 준비할 사항

QueryPie Server, MySQL, Redis 를 설치하고 실행합니다.
이 가운데, 시스템 자원을 주로 사용하는 두가지 소프트웨어, QueryPie Server 와 MySQL 을 서로 다른 VM 에 
설치하여 시스템 이용 지표를 측정하는 것을 권장합니다.

Redis 의 시스템 이용 지표를 상세하게 살펴보려는 경우, 다른 리눅스 시스템에 분리하여 설치할 수 있습니다.

# 성능 테스트 소프트웨어 설치방법

1. 이 디렉토리(perf-testing) 아래의 파일과 디렉토리를 .tar.gz 으로 저장합니다.
    - cd querypie-mono
    - git archive --format=tar.gz -o ../perf-testing.tar.gz HEAD:infra/perf-testing
2. perf-testing.tar.gz 파일을 테스트 대상 서버에 복사하여 옮기고, 압축을 해제합니다.
    - tar zxvf perf-testing.tar.gz

## Node Exporter

리눅스 시스템의 CPU, Memory, Disk IO, Network IO 이용량 지표를 수집하기 위해, 각 VM 에 모두 설치합니다.
docker-compose.yml 을 변경하지 않아도 됩니다. 별도의 설정파일이 필요하지 않습니다.

- 실행하기
    - cd node-exporter
    - docker-compose up --detach
- 종료하기
    - cd node-exporter
    - docker-compose down

## Prometheus Server

Node Exporter 를 통해 리눅스 시스템의 이용량 지표를 수집하고, 
Grafana-K6 성능 테스트 프로그램의 작동 지표를 저장하는 API 를 제공합니다. 모든 지표는 Prometheus server 의
시계열 데이터베이스(Time Series Database)에 저장됩니다. Grafana dashboard 는 Prometheus 에 저장된
데이터를 Dashboard, Chart 로 시각화합니다.

Prometheus Server 가 올바르게 작동하기 위해서는, 제공되는 prometheus.yml 설정파일을 적절히 편집하여야 합니다.
설정파일을 변경할 부분은, Node Exporter 가 작동하는 리눅스 시스템의 IP Address 를 적절히 지정하는 것입니다.
지표를 수집해야 하는 대상 리눅스 시스템의 수가 3개가 아닌 경우, 그에 맞추어 대상을 추가하거나 삭제할 수 있습니다.

Prometheus 의 Management API 를 이용해, 실행상태를 검사하고, 재시작할 수 있습니다. `prometheus.yml`을
변경한 후, docker-compose down, docker-compose up 을 수행하지 않고, 재시작 API 를 호출하는 것을
권장합니다. docker-compose down 을 수행하는 경우, 수집된 데이터가 보관된 Volume 이 삭제되어, 지표 데이터를
잃어버리게 됩니다. 재시작 API 를 호출하는 경우, 수집된 데이터가 보관된 Volume 을 유지한 상태로, Server Process
를 재시작하여 변경된 설정을 반영하게 됩니다.
[Management API Reference](https://prometheus.io/docs/prometheus/latest/management_api/)
를 참고하세요.

- 설정하기
  - cd prometheus
  - vi etc/prometheus/prometheus.yml
- 실행하기
    - cd prometheus
    - docker-compose up --detach
- 종료하기
    - cd prometheus
    - docker-compose down
- 실행상태 검사하기
    - `curl http://localhost:9090/-/ready`
- 설정파일 변경 후, container 를 유지한 상태에서, Prometheus server process 를 재시작하기
    - `curl -X POST http://localhost:9090/-/reload`

## Grafana

TODO(JK)

# 참고자료

- [QueryPie DAC 성능 테스트 시연 - 24년 8월](https://docs.google.com/presentation/d/1zltUQkTRYeWAS4JtlHN1JhZ5c-NcrGzD/edit?usp=sharing&ouid=106854970109490887766&rtpof=true&sd=true)
