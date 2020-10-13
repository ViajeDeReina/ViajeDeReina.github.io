emojicheck();
hsmstatcheck();
tampercheck();

function hsmstatcheck() {
    var hsmstattxt = document.getElementById("hsmstattxt").innerHTML;
    var hsmstatemoji = document.getElementById("hsmstatemoji");
    var hsmstatdetail = document.getElementById("hsmstatdetail");

    if (hsmstattxt == "Unavaliable") {
        hsmstatemoji.innerHTML = "🟡";
        hsmstatdetail.innerHTML = "접속 오류가 발생했습니다."
    }
    else if (hsmstattxt == "Online") {
        hsmstatemoji.innerHTML = "🟢";
        hsmstatdetail.innerHTML = "정상적으로 연결되었습니다."
    }
    else if (hsmstattxt == "Offline") {
        hsmstatemoji.innerHTML = "⚫";
        hsmstatdetail.innerHTML = "연결이 끊어졌습니다."
    }
    else {
        hsmstatemoji.innerHTML = "🚩";
        hsmstatdetail.innerHTML = "SECURE???"
    }
}

function tampercheck() {
    var tampertxt = document.getElementById("tampertxt").innerHTML;
    var tamperemoji = document.getElementById("tamperemoji");
    var tamperdetail = document.getElementById("tamperdetail");

    if (tampertxt == "Temper") {
        tamperemoji.innerHTML = "🟡";
        tamperdetail.innerHTML = "오류가 발생했습니다. {error_code}"
    }
    else if (tampertxt == "Ok") {
        tamperemoji.innerHTML = "🟢";
        tamperdetail.innerHTML = "장비가 정상적으로 작동하고 있습니다."
    }
    else if (hsmstattxt == "Unknown") {
        tamperemoji.innerHTML = "🚩";
        tamperdetail.innerHTML = "알 수 없는 문제가 발생했습니다."
    }
}

function emojicheck() {
    var statname = document.getElementById("statname").innerHTML;
    var emoji = document.getElementById("emoji");
    var statdetail = document.getElementById("statdetail");

    if (statname == "Unavailable") {
        emoji.innerHTML = "⛔";
        statdetail.innerHTML = "서버와의 접속이 끊어지지 않게 주의하세요.";
    }
    else if (statname == "TempOutOfRange") {
        emoji.innerHTML = "⛔";
        statdetail.innerHTML = "리소스 관리에 문제가 없는지 확인하세요.";
    }
    else if (statname == "BatteryLow") {
        emoji.innerHTML = "🔋";
        statdetail.innerHTML = "배터리가 부족하지 않게, 배터리의 상태를 자주 점검해주세요.";
        
    }
    else if (statname == "EraseButtonPressed") {
        emoji.innerHTML = "⛔";
        statdetail.innerHTML = "기기 조작 시 버튼을 잘못 누르지 않게 주의하세요.";
    }
    else if (statname == "SecurityProcessorWatchdog") {
        emoji.innerHTML = "🐕";
        statdetail.innerHTML = "보안 경계 등급이 상향되었으니 주의하세요.";
    }
    else if (statname == "SecurityProcessorRestart") {
        emoji.innerHTML = "🔄";
        statdetail.innerHTML = "보안 감시 프로그램이 재시작되었습니다.";
    }
    else if (statname == "PowerTooHigh") {
        emoji.innerHTML = "📈";
        statdetail.innerHTML = "기기 온도가 과열되었습니다.";
    }
    else if (statname == "MotionDetected") {
        emoji.innerHTML = "👾";
        statdetail.innerHTML = "외부로부터 공격 시도가 감지되었습니다.";
    }
    else if (statname == "CaseTempered") {
        emoji.innerHTML = "🚩";
        statdetail.innerHTML = "Case Temepered?!";
    }
    else if (statname == "TSPPModule") {
        emoji.innerHTML = "🛑";
        statdetail.innerHTML = "TSPP Module 문제";
    }
    else if (statname == "General") {
        emoji.innerHTML = "⚠";
        statdetail.innerHTML = "일반적인 문제(가 대체 무엇인지??)";
    }
    else {
        emoji.innerHTML = "🛡";
        statdetail.innerHTML = "장비 관리가 적절히 수행되고 있습니다.";
        /*well protected */
    }
}