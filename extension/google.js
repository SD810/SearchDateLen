//
//
//  다음 PC 페이지용 검색 기간 inject 스크립트
//
//

/**
 * Google 날짜 형식에 맞게 mm/dd/yyyy 꼴의 문자열을 반환
 * @param {*} year 년도
 * @param {*} month 월
 * @param {*} date 일
 */
function getDateStringGoogle(year,month,date){
    return month + '/' + date + '/' + year;
}

/**
 * 날짜 목록을 기간 설정에 집어넣습니다.
 * 
 * *공통 메소드*
 */
function injectDates(){

    var wrapper = document.createElement('div');

    // 다음은 빈 칸을 제시하면 오늘 날짜로 치환하고 입력한 날짜가 한개 뿐이면 종료일자로 생각합니다.
    // 이 때 시작일자가 오늘이 되는 문제를 방지하기 위해 오늘을 빈 칸에 채워넣어야 합니다.
    const today = new Date();

    for(var entry = 0; entry < datesData.length; entry++){
        var dateEntry = datesData[entry];

        

        var fromDate = '';
        var toDate = '';

        var desiredDates = getDesiredDates(dateEntry);
        
        if(desiredDates[DLE_JSON_COL_FROM_DATEOBJ]){
            var dateFromTarget = desiredDates[DLE_JSON_COL_FROM_DATEOBJ];
            fromDate = getDateStringGoogle(dateFromTarget.getFullYear(), (dateFromTarget.getMonth() + 1), dateFromTarget.getDate());
        }else{
            fromDate = getDateStringGoogle(today.getFullYear(), (today.getMonth() + 1), today.getDate());
        }
        if(desiredDates[DLE_JSON_COL_TO_DATEOBJ]){
            var dateToTarget = desiredDates[DLE_JSON_COL_TO_DATEOBJ]
            toDate = getDateStringGoogle(dateToTarget.getFullYear(), (dateToTarget.getMonth() + 1), dateToTarget.getDate());
        }else{
            toDate = getDateStringGoogle(today.getFullYear(), (today.getMonth() + 1), today.getDate());
        }

        // 큰따옴표를 안에다 넣어두면 DOM 삽입시 &quot;으로 자체 이스케이프된다.
        var contentString = [
            "var inputDates = document.querySelector('.cdr_frm');",
            "var from = inputDates.querySelector('.cdr_min');",
            "var to = inputDates.querySelector('.cdr_max');",
            "from.value = '"+fromDate+"';",
            "to.value = '"+toDate+"';",
            "document.querySelector('.cdr_go').click();"
        ].join(' ');
        var aTag = document.createElement('a');
        aTag.classList.add('q');
        aTag.classList.add('qs');
        aTag.setAttribute('href', '#');
        aTag.setAttribute('onclick', contentString);
        aTag.innerHTML = dateEntry[DLE_JSON_COL_NAME];
        var liTag = document.createElement('li');
        liTag.classList.add('hdtbItm');
        liTag.appendChild(aTag);
        wrapper.appendChild(liTag);
    }

    if (wrapper.hasChildNodes) {
        var unescaped = (wrapper.innerHTML);

        // 구글은 각 검색 옵션을 hdtb-mn-c/o 로 통일시켜 클래스만으로는 선택할 수 없다
        // 소속된 객체의 id를 넣고 이것의 상위 객체를 얻자.
        var dateOptions = document.querySelector('#qdr_').parentNode;
        dateOptions.insertAdjacentHTML('beforeend', unescaped);        
    }

}


