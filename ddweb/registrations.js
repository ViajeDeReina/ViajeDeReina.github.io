function checkbeforesubmit() {
    var adminId = document.getElementById("adminId").value;
    var pw1 = document.getElementById("password").value;
    var pw2 = document.getElementById("password2").value;
    var name = document.getElementById("name").value;
    var dept = document.getElementById("department").value;
    var mobile = document.getElementById("mobile").value;
    var email = document.getElementById("email").value;
    var use = document.getElementById("use").checked; /* boolean */

    if (adminId.length == 0) {
        alert("ID가 입력되지 않았습니다.");
        return false;
    }
    else if (pw1.length == 0) {
        alert("비밀번호가 입력되지 않았습니다.");
        return false;
    }
    else if (pw1 != pw2) {
        alert("비밀번호를 다시 확인하세요.");
        return false;
    }
    else if (name.length == 0) {
        alert("이름이 입력되지 않았습니다.");
        return false;
    }
    else if (dept.length == 0) {
        alert("부서명이 입력되지 않았습니다.");
        return false;
    }
    else if (mobile.length == 0) {
        alert("휴대전화 번호가 입력되지 않았습니다.");
        return false;
    }
    else if (email.length == 0) {
        alert("E-mail 주소가 입력되지 않았습니다.");
        return false;
    }
    else if (use == false) {
        alert("계정 사용 여부 체크 바랍니다.");
        return false;
    }
    else {
        return true;
    }
}

function hsmcheckbeforesubmit() {
    var hsmtype = document.getElementById("hsmtype").value;
    var hsmip = document.getElementById("hsmip").value;
    var serverip = document.getElementById("serverip").value;
    var serverport = document.getElementById("serverport").value;
    var use = document.getElementById("use").checked; /* boolean */

    if (hsmtype.length == 0) {
        alert("HSM 유형이 입력되지 않았습니다.");
        return false;
    }
    else if (hsmip.length == 0) {
        alert("HSM IP가 입력되지 않았습니다.");
        return false;
    }
    else if (serverip.length == 0) {
        alert("서버 IP가 입력되지 않았습니다.");
        return false;
    }
    else if (serverport.length == 0) {
        alert("서버 PORT가 입력되지 않았습니다.");
        return false;
    }
    else if (use == false) {
        alert("계정 사용 여부 체크 바랍니다.");
        return false;
    }
    else {
        return true;
    }
}

function diff_pw() {
    alert("동일한 비밀번호를 입력해주세요.");
}

function ifsamepw() {
    var pw1 = document.getElementById('password').value;
    var pw2 = document.getElementById('password2').value;
    var comment = " ";
    if (pw2 != pw1) {
        comment = "동일한 비밀번호를 입력해주세요.";
        document.getElementById('pwcomment').innerHTML = comment;
        return 0;
    }
    else if (pw2 == pw1) {
        comment = " ";
        document.getElementById('pwcomment').innerHTML = comment;
        return 1;
    }
}

// function checkbeforesubmit() {

//     var adminId = document.getElementById("adminId").value;
//     var pw1 = document.getElementById("password").value;
//     var pw2 = document.getElementById("password2").value;
//     var comment = document.getElementeById('pwcomment').value;
//     var name = document.getElementById("name").value;
//     var dept = document.getElementById("department").value;
//     var mobile = document.getElementById("mobile").value;
//     var email = document.getElementById("email").value;
//     var use = document.getElementById("use").checked; /* boolean */
//     var everythingisalright = 0;

//     /* ID 확인 */
//     var adminId = document.getElementById("adminId").value;
//     var idok = checknull(adminId, "ID가");
//     everythingisalright = everythingisalright + idok;
//     /* password 확인 */
//     var pw1 = document.getElementById("password").value;
//     var pw2 = document.getElementById("password2").value;
//     var comment = document.getElementeById('pwcomment').value;
//     if (comment != " ") {
//         diff_pw();
//         var pw1ok = 0;
//         var pw2ok = 0;
//     }
//     else {
//         var a = ifsamepw();
//         if (a == true) {
//             var pw1ok = checknull(pw1, "비밀번호가");
//             var pw2ok = checknull(pw2, "비밀번호가");
//             everythingisalright = everythingisalright + pw1ok + pw2ok;
//         }
//         else {
//             diff_pw();
//             var pw1ok = 0;
//             var pw2ok = 0;
//         }
//     }
//     /* 이름, 부서, 모바일, 이메일 확인 */

//     const name = document.getElementById("name").value;
//     const dept = document.getElementById("department").value;
//     const mobile = document.getElementById("mobile").value;
//     const email = document.getElementById("email").value;

//     var nameok = checknull(name, "이름이");
//     var deptok = checknull(dept, "부서명이");
//     var mobok = checknull(mobile, "휴대전화 번호가");
//     var mailok = checknull(email, "E-mail 주소가");
//     everythingisalright = everythingisalright + nameok + deptok + mobok + mailok

//     /* 사용여부 확인 */
//     var useok = 0;
//     const use = document.getElementById("use").checked;
//     if (use == true) {
//         useok = 1;
//         everythingisalright = everythingisalright + useok;
//     }
//     else {
//         alert("계정 사용 여부 체크 바랍니다.");
//     }

//     /* 모두 충족해야 true 반환하고 사용자 등록이 진행됨 */
//     if (everythingisalright == 8) {
//         alert("TRUE");
//         return true;
//     }
//     else {
//         alert("FALSE!");
//         return false;
//     }
// }

    // var everythingisalright = 0;

    // while (everythingisalright != 8) {
    //     /* ID 확인 */
    //     const adminId = document.getElementById("adminId").value;
    //     var idok = checknull(adminId, "ID가");
    //     everythingisalright += idok;
    //     /* password 확인 */
    //     const pw1 = document.getElementById("password").value;
    //     const pw2 = document.getElementById("password2").value;
    //     const comment = document.getElementeById('pwcomment').value;
    //     if (comment != " ") {
    //         diff_pw();
    //     }
    //     else {
    //         var a = ifsamepw();
    //         if (a == true) {
    //             var pw1ok = checknull(pw1, "비밀번호가");
    //             var pw2ok = checknull(pw2, "비밀번호가");
    //             everythingisalright = everythingisalright + pw1ok + pw2ok;
    //         }
    //     }
    //     /* 이름, 부서, 모바일, 이메일 확인 */

    //     const name = document.getElementById("name").value;
    //     const dept = document.getElementById("department").value;
    //     const mobile = document.getElementById("mobile").value;
    //     const email = document.getElementById("email").value;

    //     var nameok = checknull(name, "이름이");
    //     var deptok = checknull(dept, "부서명이");
    //     var mobok = checknull(mobile, "휴대전화 번호가");
    //     var mailok = checknull(email, "E-mail 주소가");
    //     everythingisalright = everythingisalright + nameok + deptok + mobok + mailok

    //     var useok = 0;
    //     /* 사용여부 확인 */
    //     const use = document.getElementById("use").checked;
    //     if (use == true) {
    //         useok = 1;
    //         everythingisalright += useok;
    //     }
    //     else {
    //         alert("계정 사용 여부 체크 바랍니다.");
    //     }
    //     if (everythingisalright == 8) {
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }
    
    
    // /* 모두 충족해야 true 반환하고 사용자 등록이 진행됨 */
    // var everythingisalright = idok + pw1ok + pw2ok + nameok + deptok + mobok + mailok + useok;
    
    // if (everythingisalright == 8) {
    //     return true;
    // }
    // else {
    //     return false;
    // }
//}

// function checknull(elemvalue) {
//     if (elemvalue == " ") {
//         return 0;
//     }
//     else {
//         return 1;
//     }
// }
