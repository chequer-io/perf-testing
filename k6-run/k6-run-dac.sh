#!/usr/bin/env bash

set -o nounset -o errexit -o errtrace -o pipefail
set -o xtrace

K6_PROMETHEUS_RW_SERVER_URL=http://host.docker.internal:9090/api/v1/write
K6_PROMETHEUS_RW_TREND_AS_NATIVE_HISTOGRAM=true
K6_PROMETHEUS_RW_TREND_STATS="min,p(25),med,p(75),p(90),p(95),p(99),max"

DOCKER_RUN="docker run --rm -it -v $(pwd):/app \
  -e K6_PROMETHEUS_RW_SERVER_URL=${K6_PROMETHEUS_RW_SERVER_URL} \
  -e K6_PROMETHEUS_RW_TREND_AS_NATIVE_HISTOGRAM=${K6_PROMETHEUS_RW_TREND_AS_NATIVE_HISTOGRAM} \
  -e K6_PROMETHEUS_RW_TREND_STATS=${K6_PROMETHEUS_RW_TREND_STATS}"

${DOCKER_RUN} custom-k6 run \
  --out experimental-prometheus-rw \
  --stage 0s:0,1s:1,20s:1,10s:30,30s:30,10s:60,30s:60,10s:90,1m:90,10s:60,30s:60,10s:30,30s:30,10s:1,\
30s:1,10s:30,30s:30,10s:60,30s:60,10s:30,30s:30,10s:1,\
30s:1,10s:30,30s:30,10s:1,30s:1,10s:0 \
scripts/dac.js

${DOCKER_RUN} custom-k6 run \
  --out experimental-prometheus-rw \
  --stage 0s:0,1s:1,\
30s:1,10s:30,30s:30,10s:60,30s:60,10s:30,30s:30,10s:1,\
30s:1,10s:30,30s:30,10s:1,30s:1,10s:0 \
scripts/dac.js

