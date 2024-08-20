# 이 디렉토리에 위치한 TypeScript 파일을 JavaScript 파일로 변환합니다.

DOCKER_RUN = docker run --rm -v $(shell pwd):/app evanw/esbuild:latest
TYPESCRIPT_FILES = $(wildcard *.ts)
JAVASCRIPT_FILES = $(TYPESCRIPT_FILES:%.ts=%.js)
ESBUILD_OPTS = --platform=node --bundle --external:"k6/*" --external:"k6"

# 기본적으로 모든 TypeScript 파일을 JavaScript 로 변환
all: $(JAVASCRIPT_FILES)

# 각 TypeScript 파일을 대응되는 JavaScript 파일로 변환
%.js: %.ts
	$(DOCKER_RUN) esbuild $< $(ESBUILD_OPTS) --outfile=$@

# 생성된 모든 JavaScript 파일을 삭제
clean:
	rm -f $(JAVASCRIPT_FILES)

.PHONY: all clean
