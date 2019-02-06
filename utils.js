//
//
//  공통으로 사용되는 유틸리티 함수들
//
//

function getTwoDigitNumber(number){
    return ((number < 10) ? '0' + number : number);
}

//https://stackoverflow.com/a/22279245
// 따옴표, 태그 & 탈출요법
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }
function unescapeHtml(safe) {
    return safe
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
}

// div/span 태그에 클래스를 정해둔 DOM 객체를 반환
// inner를 내부에 넣음, appendStr를 뒤에 붙임
function getClassedTag(tagType, className = '', inner = '', appendStr = null){
    var tag = document.createElement(tagType);
    tag.setAttribute('class', className);

    if(isNode(inner) || isElement(inner)){
        tag.appendChild(inner);
    }else{
        tag.innerHTML = inner;
    }

    if(appendStr){
        tag.innerHTML = tag.innerHTML + appendStr;
    }
    return tag;
}



//https://stackoverflow.com/a/384380
// DOM Node는 true
function isNode(o){
    return (
        typeof Node === "object" ? o instanceof Node : 
        o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
    );
}  
// DOM Element는 true    
function isElement(o){
    return (
        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
        o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
    );
}

// 입력받은 날짜로 현재 날짜를 조정
function setDateFromNow(year, month, date){
    var dateTarget = new Date();
    alertAndLog("searchDateLen: [utils] setting "+year+"years "+month+"months "+date+"days from "+
        dateTarget.getFullYear()+"-"+getTwoDigitNumber(dateTarget.getMonth() + 1)+"-"+getTwoDigitNumber(dateTarget.getDate()));
    dateTarget.setFullYear(dateTarget.getFullYear() - year);
    dateTarget.setMonth(dateTarget.getMonth() - month);
    dateTarget.setDate(dateTarget.getDate() - date);
    alertAndLog("searchDateLen: [utils] got "+dateTarget.getFullYear()+"-"+getTwoDigitNumber(dateTarget.getMonth() + 1)+"-"+getTwoDigitNumber(dateTarget.getDate()));
    return dateTarget;
}

// 입력받은 날짜 그대로 현재날짜로. 단, 0인건 현재날짜를 기준으로
function setDateExactTry(year, month, date){
    var dateTarget = new Date();
    alertAndLog("searchDateLen: [utils] trying to set "+year+"-"+getTwoDigitNumber(month)+"-"+getTwoDigitNumber(date)+" into "+
        dateTarget.getFullYear()+"-"+getTwoDigitNumber(dateTarget.getMonth() + 1)+"-"+getTwoDigitNumber(dateTarget.getDate()));
    if(year > 0) {
        dateTarget.setFullYear(year);
    }
    if(month > 0) {
        dateTarget.setMonth(month-1);
    }
    if(date > 0 ){
        dateTarget.setDate(date);
    }
    alertAndLog("searchDateLen: [utils] got "+dateTarget.getFullYear()+"-"+getTwoDigitNumber(dateTarget.getMonth() + 1)+"-"+getTwoDigitNumber(dateTarget.getDate()));
    return dateTarget;
}

// 입력받은 날짜 그대로 현재날짜로.
// 단,
function setDateHybrid(year, month, date){
    var dateTarget = new Date();
    alertAndLog("searchDateLen: [utils] trying to set "+year+"-"+getTwoDigitNumber(month)+"-"+getTwoDigitNumber(date)+" into "+
        dateTarget.getFullYear()+"-"+(dateTarget.getMonth() + 1)+"-"+dateTarget.getDate());
    
    //
    if(year >= 100) {
        dateTarget.setFullYear(year);
    }
    if(month > 0) {
        dateTarget.setMonth(month-1);
    }
    if(date > 0){
        dateTarget.setDate(date);
    }
    alertAndLog("searchDateLen: [utils] got "+dateTarget.getFullYear()+"-"+getTwoDigitNumber(dateTarget.getMonth() + 1)+"-"+getTwoDigitNumber(dateTarget.getDate()));
    return dateTarget;
}

// checkVal 값과 value가 같으면 selected 를 붙여 나오는 option 태그 생성
function getSelectedOptionTag(label, value, checkVal){
    var optionTag = document.createElement('option');
    optionTag.setAttribute('value', value);
    
    if(checkVal == value){
        optionTag.setAttribute('selected','selected');
    }

    optionTag.innerHTML = label;

    return optionTag;
}

// number 입력칸 생성
function getInputNumberTag(nameAndId, maxValue = 9999, value = 0){

    var inputTag = document.createElement('input');
    inputTag.setAttribute('type', 'number');
    inputTag.setAttribute('name', nameAndId);
    inputTag.setAttribute('id', nameAndId);
    inputTag.setAttribute('min', 0);
    inputTag.setAttribute('max', maxValue);
    inputTag.setAttribute('value', value);

    return inputTag;
}

// 일반 입력칸 생성
function getInputTextTag(nameAndId, isHidden = false, value = ''){

    var inputTag = document.createElement('input');
    inputTag.setAttribute('type', isHidden ? 'hidden' : 'text');
    inputTag.setAttribute('name', nameAndId);
    inputTag.setAttribute('id', nameAndId);
    inputTag.setAttribute('value', value);

    return inputTag;
}

/**
 * 입력 수가 범위 내인지 확인하도록 이벤트리스너에 연결합니다.
 * min과 max 속성을 활용
 * 
 * @param {*} inputNumber 숫자 입력을 받는 input 태그의 HtmlNode
 */
function bindValidateInputNumber(inputNumber){
    var success = false;
    if(isNode(inputNumber) || isElement(inputNumber)){
        var minVal = inputNumber.getAttribute('min');
        var maxVal = inputNumber.getAttribute('max');

        // 수를 비교해야하므로 미리 수로 변환해둔다.
        if(!isNaN(minVal)){
            minVal = parseInt(minVal,10);
        }
        if(!isNaN(maxVal)){
            maxVal = parseInt(maxVal,10);
        }

        inputNumber.addEventListener('focusout', function () {
            validateInputNumber(inputNumber, minVal, maxVal);
        });
        success = true;
    }
    if(success){
        alertAndLog('searchDateLen: [utils] bindValidateInputNumber(#'+inputNumber.getAttribute('id')+')');
    }else{
        alertAndLog('searchDateLen: [utils] bindValidateInputNumber failed as this is not Node or Element');
    }
}

/**
 * 입력 수가 범위 내인지 확인하고 초과하는 값은 minVal 또는 maxVal로 대체합니다.
 * 
 * @param {*} inputNumber 숫자 입력을 받는 input 태그의 HtmlNode
 * @param {*} minVal 최소값
 * @param {*} maxVal 최대값
 */
function validateInputNumber(inputNumber, minVal, maxVal){
    
    var elementId = inputNumber.getAttribute('id');
    var value = inputNumber.value;
    alertAndLog('searchDateLen: [utils] validating input number area (#'+elementId+') as : ' + minVal + ' <= ' + value + ' <= ' + maxVal);

    // 수가 아니면 0으로 설정 후 종료.
    if(isNaN(value))
    {
        alertAndLog('searchDateLen: [utils] input number area (#'+elementId+') value is NaN');

        // 숫자 입력 input 태그에 value로 값 추출시 + 기호는 무시된다. - 기호는 음수.
        value = 0;
    }else{
        //문자열을 수로 변환하지 않으면 99 > 11111 이 성립하게 된다.
        value = parseInt(value,10);
    }

    // 최소값 미만시 minVal 값으로, 최대값 초과시 maxVal 값으로. 
    if(value < minVal){
        alertAndLog('searchDateLen: [utils] input number area (#'+elementId+') value is under ' + minVal);
        value = minVal;
    }else if(value > maxVal){
        alertAndLog('searchDateLen: [utils] input number area (#'+elementId+') value is over ' + maxVal);
        value = maxVal;
    }else{
        alertAndLog('searchDateLen: [utils] input number area (#'+elementId+') value is satisfying condition');
    }

    inputNumber.value = value;
}