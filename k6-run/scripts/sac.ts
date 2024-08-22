// @ts-ignore
import ssh from "k6/x/ssh";
// @ts-ignore
import { check, sleep } from "k6";
// @ts-ignore
import { Counter, Trend } from "k6/metrics";

// 트렌드 메트릭 정의
const connectTime = new Trend("ssh_connection_time");
const pwdCommandTime = new Trend("pwd_command_time");
const lsCommandTime = new Trend("ls_command_time");

// 카운터 메트릭 정의
const successCount = new Counter("ssh_connection_success");
const failureCount = new Counter("ssh_connection_failure");

export function setup() {}

export default function () {
  let start, end, duration;

  try {
    // SSH 연결 속도 측정
    start = new Date(); // 연결 시작 시간
    const connection = ssh.connect({
      username: "ec2-user",
      password: "secret-password",
      host: "host.docker.internal",
      port: 52164,
    });
    end = new Date(); // 연결 완료 시간
    duration = end - start; // 걸린 시간 계산 (밀리초 단위)
    connectTime.add(duration); // 메트릭에 추가

    // 연결 성공 카운트
    successCount.add(1);

    // 연결이 성공적으로 완료된 경우에만 명령어 실행
    if (ssh) {
      // 명령어 실행 속도 측정 (pwd)
      sleep(1);
      start = new Date(); // pwd 명령어 시작 시간
      console.log(ssh.run("pwd"));
      end = new Date(); // pwd 명령어 완료 시간
      duration = end - start; // 걸린 시간 계산
      pwdCommandTime.add(duration); // 메트릭에 추가

      // 명령어 실행 속도 측정 (ls -la)
      sleep(1);
      start = new Date(); // ls -la 명령어 시작 시간
      console.log(ssh.run("ls -la"));
      end = new Date(); // ls -la 명령어 완료 시간
      duration = end - start; // 걸린 시간 계산
      lsCommandTime.add(duration); // 메트릭에 추가

      // close 를 따로 구현해야 할 것 같음
      //connection.close();
    } else {
      console.error("SSH connection failed!");
    }
  } catch (error) {
    // 연결 실패 카운트
    failureCount.add(1);
    console.error(`Error during SSH operations: ${error}`);
  }
}

export function teardown() {
  //ssh.close();
}
