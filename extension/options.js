//
//
//  options.html 에서 사용할 설정 관련 스크립트
//
//


// 확장기능 내에서 inline javascript가 동작하지 않으므로 직접 이벤트 리스너로 추가해야한다
document.addEventListener('DOMContentLoaded', function () {
    alertAndLog('searchDateLen: [options] DOMContentLoaded');
    
    loadOptions();
    
    populateOnceInputBtn();

    populateResetBtn();
});


/**
 * 스토리지에 저장된 값을 읽어와 options.html 초기화
 */
function loadOptions(){
    loadStorage(function(){
        initData();
        populateVersionNo(getVersionNo());
        pupulateDebugFlag();
        populateList();
        prepareInput();
    });
};


/**
 * 버전 정보 넣기
 * @param {*} verText 
 */
function populateVersionNo(verText){     
    document.getElementById('versionNo').innerHTML = verText;
}

/**
 * 개발자 모드 체크
 */
function pupulateDebugFlag(){
    var ckbDevMode = document.getElementById('ckbDebugMode');
    ckbDevMode.checked = isDebug;
    ckbDevMode.addEventListener('change', function () {
        isDebug = ckbDevMode.checked;
        saveAndReload();
    });
}

/**
 * dates 목록을 꾸린다.
 */
function populateList(){
    alertAndLog('searchDateLen: [options] preparing datesList for '+datesData.length+' item(s).');
    // datesList ul
    var datesList = document.querySelector('.datesList');
    //var divClear = getClassedTag('div', 'clear', '');

    // reset datesList;
    datesList.innerHTML = '';

    for(var entryNo = 0; entryNo < datesData.length; entryNo++){
        // 실제 데이터
        var dateEntry = datesData[entryNo];

        // 항목 컨테이너
        var liTag = getClassedTag('li', 'dateEntry entryHover clearfix', '');

        // 종류에 따라 표시방식 대응
        var isAbsoluteDate = false;
        var isFromDate = false;
        var isToDate = false;
        var visibleType = '';
        switch(dateEntry[DLE_JSON_COL_TYPE]){
        case DLE_TYPE_REL_FROM: //'rel_from':
            isFromDate = true;
            visibleType = LABEL_DLE_TYPES_REL_FROM;
            
            break;
        case DLE_TYPE_REL_TO: //'rel_to':
            isToDate = true;
            visibleType = LABEL_DLE_TYPES_REL_TO;
            
            break;
        case DLE_TYPE_REL_RANGE: //'rel_range':
            isFromDate = true;
            isToDate = true;
            visibleType = LABEL_DLE_TYPES_REL_RANGE;

            break;
        case DLE_TYPE_ABS_FROM: //'abs_from':
            isAbsoluteDate = true;
            isFromDate = true;
            visibleType = LABEL_DLE_TYPES_ABS_FROM;
            
            break;
        case DLE_TYPE_ABS_TO: //'abs_to':
            isAbsoluteDate = true;
            isToDate = true;
            visibleType = LABEL_DLE_TYPES_ABS_TO;

            break;
        case DLE_TYPE_ABS_RANGE: //'abs_range':
            isAbsoluteDate = true;
            isFromDate = true;
            isToDate = true;
            visibleType = LABEL_DLE_TYPES_ABS_RANGE;

            break;
        }

        

        // 데이터를 그대로 표시
        var divDateNo = getClassedTag('div', 'dateNoInternal', entryNo);
        var divDateName = getClassedTag('div', 'dateName', dateEntry[DLE_JSON_COL_NAME]);
        var divDateType = getClassedTag('div', 'dateType', visibleType);
        var divDateTypeInternal = getClassedTag('div', 'dateTypeInternal', dateEntry[DLE_JSON_COL_TYPE]);



        // 버튼들이 놓일 곳
        var divDateAction = getClassedTag('div', 'dateAction', '');
        // 한 칸 위로 버튼
        var btnActMoveUp = document.createElement('button');
        btnActMoveUp.setAttribute('type','button');
        btnActMoveUp.setAttribute('entryNo', entryNo);
        btnActMoveUp.innerHTML = '▲';
        btnActMoveUp.addEventListener('click', function () {
            actionMoveUpDateEntry(this.getAttribute('entryNo'));
        });
        divDateAction.appendChild(btnActMoveUp);
        //한 칸 아래로 버튼
        var btnActMoveDown = document.createElement('button');
        btnActMoveDown.setAttribute('type','button');
        btnActMoveDown.setAttribute('entryNo', entryNo);
        btnActMoveDown.innerHTML = '▼';
        btnActMoveDown.addEventListener('click', function () {
            actionMoveDownDateEntry(this.getAttribute('entryNo'));
        });
        divDateAction.appendChild(btnActMoveDown);
        // 수정 버튼
        var btnActModify = document.createElement('button');
        btnActModify.setAttribute('type','button');
        btnActModify.setAttribute('entryNo', entryNo);
        btnActModify.innerHTML = '수정';
        btnActModify.addEventListener('click', function () {
            selectListEntry(this.getAttribute('entryNo'));
            prepareInput(this.getAttribute('entryNo'));
        });
        divDateAction.appendChild(btnActModify);
        // 삭제 버튼
        var btnActDelete = document.createElement('button');
        btnActDelete.setAttribute('type','button');
        btnActDelete.setAttribute('entryNo', entryNo);
        btnActDelete.innerHTML = '삭제';
        btnActDelete.addEventListener('click', function () {
            actionRemoveDateEntry(this.getAttribute('entryNo'));
        });
        divDateAction.appendChild(btnActDelete);



        // 날짜 wrapper
        var divLabelDate = getClassedTag('li', 'clearfix', '');

        var divLabelFromYear = getClassedTag('div', 'label_year', 
            getClassedTag('span', 'from_year', dateEntry[DLE_JSON_COL_FROM_YEAR]));
        var divLabelFromMonth = getClassedTag('div', 'label_month',
            getClassedTag('span', 'from_month', dateEntry[DLE_JSON_COL_FROM_MONTH]));
        var divLabelFromDate = getClassedTag('div', 'label_date', 
            getClassedTag('span', 'from_date', dateEntry[DLE_JSON_COL_FROM_DATE]));
        var divLabelToYear = getClassedTag('div', 'label_year', 
            getClassedTag('span', 'to_year', dateEntry[DLE_JSON_COL_TO_YEAR]));
        var divLabelToMonth = getClassedTag('div', 'label_month',
            getClassedTag('span', 'to_month', dateEntry[DLE_JSON_COL_TO_MONTH]));
        var divLabelToDate = getClassedTag('div', 'label_date', 
            getClassedTag('span', 'to_date', dateEntry[DLE_JSON_COL_TO_DATE]));
        
        
        if( ! isAbsoluteDate){
            // 상대적인 기간 (1년 6개월 전 등)
            divLabelFromYear.innerHTML = divLabelFromYear.innerHTML + '년';
            divLabelFromMonth.innerHTML = divLabelFromMonth.innerHTML + '개월';
            divLabelFromDate.innerHTML = divLabelFromDate.innerHTML + '일';
            divLabelToYear.innerHTML = divLabelToYear.innerHTML + '년';
            divLabelToMonth.innerHTML = divLabelToMonth.innerHTML + '개월';
            divLabelToDate.innerHTML = divLabelToDate.innerHTML + '일';
        }else{
            // 절대적인 기간 (2018년 6월 이전 등)
            divLabelFromYear.innerHTML = divLabelFromYear.innerHTML + '년';
            divLabelFromMonth.innerHTML = divLabelFromMonth.innerHTML + '월';
            divLabelFromDate.innerHTML = divLabelFromDate.innerHTML + '일';
            divLabelToYear.innerHTML = divLabelToYear.innerHTML + '년';
            divLabelToMonth.innerHTML = divLabelToMonth.innerHTML + '월';
            divLabelToDate.innerHTML = divLabelToDate.innerHTML + '일';
        }

        // 날짜(계산됨) div
        var desiredDates = getDesiredDates(dateEntry);
        var fromDateStr = '';
        var toDateStr = '';
        if(desiredDates[DLE_JSON_COL_FROM_DATEOBJ]){
            var dateFromTarget = desiredDates[DLE_JSON_COL_FROM_DATEOBJ];
            fromDateStr = dateFromTarget.getFullYear()+'-'+getTwoDigitNumber(dateFromTarget.getMonth() + 1)+'-'+getTwoDigitNumber(dateFromTarget.getDate());
        }
        if(desiredDates[DLE_JSON_COL_TO_DATEOBJ]){
            var dateToTarget = desiredDates[DLE_JSON_COL_TO_DATEOBJ]
            toDateStr = dateToTarget.getFullYear()+'-'+getTwoDigitNumber(dateToTarget.getMonth() + 1)+'-'+getTwoDigitNumber(dateToTarget.getDate());
        }
        
        var divLabelFromDateCalc = getClassedTag('div', 'label_date_calc', '(오늘 기준 '+fromDateStr+' ~ '+toDateStr+')');


        if(isFromDate){
            divLabelDate.appendChild(divLabelFromYear);
            divLabelDate.appendChild(divLabelFromMonth);
            divLabelDate.appendChild(divLabelFromDate);
        }
        divLabelDate.appendChild(getClassedTag('div','label_tick','~'));
        if(isToDate){
            divLabelDate.appendChild(divLabelToYear);
            divLabelDate.appendChild(divLabelToMonth);
            divLabelDate.appendChild(divLabelToDate);
        }


        // 항목에 내용 삽입
        liTag.appendChild(divDateNo);
        liTag.appendChild(divDateName);
        liTag.appendChild(divLabelDate);
        liTag.appendChild(divDateType);
        liTag.appendChild(divDateTypeInternal);
        liTag.appendChild(divLabelFromDateCalc);
        liTag.appendChild(divDateAction);

        // li 태그에 클릭하면 수정되도록 준비
        // this를 써서 이 객체에 해당되는 것만 사용하도록 해야한다.
        // for 문 사용시 변수 이름 그대로 사용했다간 마지막 번호로 가게 될테니.
        //liTag.addEventListener('click', function () {
        //    prepareInput(this.querySelector('.dateNoInternal').innerHTML);
        //});
        
        // 목록에 항목 삽입
        datesList.appendChild(liTag);
    }

    alertAndLog('searchDateLen: [options] finished datesList for '+datesData.length+' item(s).');
}



/**
 * 선택된 항목만 강조합니다.
 * @param {*} entryNo 
 */
function selectListEntry(entryNo){
    var dateEntries = document.querySelectorAll('.dateEntry');
    for(var eNo = 0; eNo < dateEntries.length; eNo++){
        var dateNoInternal = dateEntries[eNo].querySelector('.dateNoInternal');
        if(dateNoInternal){
            //클래스가 두 번 추가될 수 있으므로 없애는건 무조건 하자
            dateEntries[eNo].classList.remove("selected_dateEntry");
            
            if(dateNoInternal.innerHTML == entryNo){
                dateEntries[eNo].classList.add("selected_dateEntry");
            }
        }
    }
}



/**
 * 입력/수정 란을 준비한다.
 * @param {*} entryNo 항목 번호. 있는 항목이라면 수정 상태로 값을 읽어온다
 */
function prepareInput(entryNo = -1){
    alertAndLog('searchDateLen: [options] preparing input area. as entryNo: '+entryNo);

    // inputEntry div
    var inputEntry = document.querySelector('#inputEntry');

    // reset inputEntry;
    inputEntry.innerHTML = '';

    var dateEntry = null;
    var submitBtnTxt = '';

    if(datesData && (0 <= entryNo && entryNo < datesData.length)){
        alertAndLog('searchDateLen: [options] processing entry with entryNo '+entryNo);
        // datesData 가 있고 해당 원소가 범위 안
        dateEntry = datesData[entryNo];
        //버튼 텍스트 설정
        submitBtnTxt = '수정';
    }else{
        alertAndLog('searchDateLen: [options] There\'s no entry with entryNo '+entryNo);
        // datesData 가 비어있거나 해당 원소가 범위 밖
        // 생성하자
        dateEntry = {}; // new obj
        dateEntry[DLE_JSON_COL_NAME] = '';
        dateEntry[DLE_JSON_COL_TYPE] = DLE_TYPE_REL_FROM;
        dateEntry[DLE_JSON_COL_FROM_YEAR] = 0;
        dateEntry[DLE_JSON_COL_FROM_MONTH] = 0;
        dateEntry[DLE_JSON_COL_FROM_DATE] = 0;
        dateEntry[DLE_JSON_COL_TO_YEAR] = 0;
        dateEntry[DLE_JSON_COL_TO_MONTH] = 0;
        dateEntry[DLE_JSON_COL_TO_DATE] = 0;

        // 버튼 텍스트 설정
        submitBtnTxt = '추가';
    }
    
    // input_no_internal input
    var inputNoInternal = getInputTextTag('input_no_internal', true, entryNo);

    // 이름 영역 div
    var divAreaInName = getClassedTag('div','input_area_name floatLeft','');
    // 이름 레이블 div
    var divInputName = getClassedTag('div','label_input','이름');
    // input_name input
    var inputName = getInputTextTag('input_name', false, dateEntry[DLE_JSON_COL_NAME]);
    // 영역에 태그 삽입
    divAreaInName.appendChild(divInputName);
    divAreaInName.appendChild(inputName);

    // 형식 영역 div
    var divAreaInType = getClassedTag('div','input_area_type floatLeft','');
    // 형식 레이블 div
    var divInputType = getClassedTag('div','label_input','형식');
    // input_type select
    var selectInputType = getClassedTag('select');
    selectInputType.setAttribute('name', 'input_type');
    selectInputType.setAttribute('id', 'input_type');
    // options
    for(var typeNo = 0; typeNo < DLE_TYPES.length; typeNo++){
        selectInputType.appendChild(getSelectedOptionTag(LABEL_DLE_TYPES[typeNo], DLE_TYPES[typeNo], dateEntry[DLE_JSON_COL_TYPE]));
    }
    // 영역에 태그 삽입
    divAreaInType.appendChild(divInputType);    
    divAreaInType.appendChild(selectInputType);

     // 날짜 및 형식 묶어서
     var divAreaInDnT = getClassedTag('div', 'input_area_date_N_type clearfix', '');
     divAreaInDnT.appendChild(divAreaInName);
     divAreaInDnT.appendChild(divAreaInType);



    // 상대적 기간 컨테이너 div
    var divInputDateRel = getClassedTag('div');
    divInputDateRel.setAttribute('id', 'input_date_relative');

    // 시작기간 컨테이너 div
    var divInputRelFrom = getClassedTag('div','clearfix');
    divInputRelFrom.setAttribute('id','input_date_from');
    // 시작기간 레이블 div
    divInputRelFrom.appendChild(getClassedTag('div','label_input','시작기간'));
    // 시작개년 div+input
    divInputRelFrom.appendChild(getClassedTag('div','label_year',
        getInputNumberTag('input_rel_from_year',LIMIT_YEARS_REL_MINIMUM,LIMIT_YEARS_REL_MAXIMUM,dateEntry[DLE_JSON_COL_FROM_YEAR]),'년'));
    // 시작개월 div+input
    divInputRelFrom.appendChild(getClassedTag('div','label_month',
        getInputNumberTag('input_rel_from_month',LIMIT_MONTHS_REL_MINIMUM,LIMIT_MONTHS_REL_MAXIMUM,dateEntry[DLE_JSON_COL_FROM_MONTH]),'개월'));
    // 시작개일 div+input
    divInputRelFrom.appendChild(getClassedTag('div','label_date',
        getInputNumberTag('input_rel_from_date',LIMIT_DAYS_REL_MINIMUM,LIMIT_DAYS_REL_MAXIMUM,dateEntry[DLE_JSON_COL_FROM_DATE]),'일 전부터'));
    // 시작기간 clear div
    divInputRelFrom.appendChild(getClassedTag('div','clear'));
    // 시작기간에 유효성 검사 이벤트 추가
    bindValidateInputNumber(divInputRelFrom.querySelector("#input_rel_from_year"));
    bindValidateInputNumber(divInputRelFrom.querySelector("#input_rel_from_month"));
    bindValidateInputNumber(divInputRelFrom.querySelector("#input_rel_from_date"));
    // 시작기간을 상대기간 DOM에 추가
    divInputDateRel.appendChild(divInputRelFrom);

    // 종료기간 컨테이너 div
    var divInputRelTo = getClassedTag('div','clearfix');
    divInputRelTo.setAttribute('id','input_date_to');
    // 종료기간 레이블 div
    divInputRelTo.appendChild(getClassedTag('div','label_input','종료기간'));
    // 종료개년 div+input
    divInputRelTo.appendChild(getClassedTag('div','label_year',
        getInputNumberTag('input_rel_to_year',LIMIT_YEARS_REL_MINIMUM,LIMIT_YEARS_REL_MAXIMUM,dateEntry[DLE_JSON_COL_TO_YEAR]),'년'));
    // 종료개월 div+input
    divInputRelTo.appendChild(getClassedTag('div','label_month',
        getInputNumberTag('input_rel_to_month',LIMIT_MONTHS_REL_MINIMUM,LIMIT_MONTHS_REL_MAXIMUM,dateEntry[DLE_JSON_COL_TO_MONTH]),'개월'));
    // 종료개일 div+input
    divInputRelTo.appendChild(getClassedTag('div','label_date',
        getInputNumberTag('input_rel_to_date',LIMIT_DAYS_REL_MINIMUM,LIMIT_DAYS_REL_MAXIMUM,dateEntry[DLE_JSON_COL_TO_DATE]),'일 전까지'));
    // 종료기간 clear div
    divInputRelTo.appendChild(getClassedTag('div','clear'));    
    // 종료기간에 유효성 검사 이벤트 추가
    bindValidateInputNumber(divInputRelTo.querySelector("#input_rel_to_year"));
    bindValidateInputNumber(divInputRelTo.querySelector("#input_rel_to_month"));
    bindValidateInputNumber(divInputRelTo.querySelector("#input_rel_to_date"));
    // 종료기간을 상대기간 DOM에 추가
    divInputDateRel.appendChild(divInputRelTo);

    // 상대적 기간 설명
    var divInputRelLabel = getClassedTag('div', 'label_desc','입력 범위: 년('+LIMIT_YEARS_REL_MAXIMUM+'~'+LIMIT_YEARS_REL_MINIMUM+'), 개월('+LIMIT_MONTHS_REL_MAXIMUM+'~'+LIMIT_MONTHS_REL_MINIMUM+'), 일('+LIMIT_DAYS_REL_MAXIMUM+'~'+LIMIT_DAYS_REL_MINIMUM+'). 미래 설정 불가');
    divInputDateRel.appendChild(divInputRelLabel);



    // 절대적 기간 컨테이너 div
    var divInputDateAbs = getClassedTag('div');
    divInputDateAbs.setAttribute('id', 'input_date_absolute');

    // 시작날짜 컨테이너 div
    var divInputAbsFrom = getClassedTag('div','clearfix');
    divInputAbsFrom.setAttribute('id','input_date_from');
    // 시작날짜 레이블 div
    divInputAbsFrom.appendChild(getClassedTag('div','label_input','시작일자'));
    // 시작년도 div+input
    divInputAbsFrom.appendChild(getClassedTag('div','label_year',
        getInputNumberTag('input_abs_from_year',LIMIT_YEARS_HBD_MINIMUM,LIMIT_YEARS_ABS_MAXIMUM,dateEntry[DLE_JSON_COL_FROM_YEAR]),'년'));
    // 시작월 div+input
    divInputAbsFrom.appendChild(getClassedTag('div','label_month',
        getInputNumberTag('input_abs_from_month',LIMIT_MONTHS_ABS_MINIMUM,LIMIT_MONTHS_ABS_MAXIMUM,dateEntry[DLE_JSON_COL_FROM_MONTH]),'월'));
    // 시작일 div+input
    divInputAbsFrom.appendChild(getClassedTag('div','label_date',
        getInputNumberTag('input_abs_from_date',LIMIT_DAYS_ABS_MINIMUM,LIMIT_DAYS_ABS_MAXIMUM,dateEntry[DLE_JSON_COL_FROM_DATE]),'일부터'));
    // 시작일자 clear div
    divInputAbsFrom.appendChild(getClassedTag('div','clear'));
    // 시작일자에 유효성 검사 이벤트 추가
    bindValidateInputNumber(divInputAbsFrom.querySelector("#input_abs_from_year"));
    bindValidateInputNumber(divInputAbsFrom.querySelector("#input_abs_from_month"));
    bindValidateInputNumber(divInputAbsFrom.querySelector("#input_abs_from_date"));
    // 시작일자을 절대기간 DOM에 추가
    divInputDateAbs.appendChild(divInputAbsFrom);


    // 종료일자 컨테이너 div
    var divInputAbsTo = getClassedTag('div','clearfix');
    divInputAbsTo.setAttribute('id','input_date_to');
    // 종료일자 레이블 div
    divInputAbsTo.appendChild(getClassedTag('div','label_input','종료일자'));
    // 종료개년 div+input
    divInputAbsTo.appendChild(getClassedTag('div','label_year',
        getInputNumberTag('input_abs_to_year',LIMIT_YEARS_HBD_MINIMUM,LIMIT_YEARS_ABS_MAXIMUM,dateEntry[DLE_JSON_COL_TO_YEAR]),'년'));
    // 종료개월 div+input
    divInputAbsTo.appendChild(getClassedTag('div','label_month',
        getInputNumberTag('input_abs_to_month',LIMIT_MONTHS_ABS_MINIMUM,LIMIT_MONTHS_ABS_MAXIMUM,dateEntry[DLE_JSON_COL_TO_MONTH]),'월'));
    // 종료개일 div+input
    divInputAbsTo.appendChild(getClassedTag('div','label_date',
        getInputNumberTag('input_abs_to_date',LIMIT_DAYS_ABS_MINIMUM,LIMIT_DAYS_ABS_MAXIMUM,dateEntry[DLE_JSON_COL_TO_DATE]),'일까지'));
    // 종료일자 clear div
    divInputAbsTo.appendChild(getClassedTag('div','clear'));  
    // 종료일자에 유효성 검사 이벤트 추가
    bindValidateInputNumber(divInputAbsTo.querySelector("#input_abs_to_year"));
    bindValidateInputNumber(divInputAbsTo.querySelector("#input_abs_to_month"));
    bindValidateInputNumber(divInputAbsTo.querySelector("#input_abs_to_date"));  
    // 종료일자를 상대기간 DOM에 추가
    divInputDateAbs.appendChild(divInputAbsTo);


    // 절대적 기간 설명
    var divInputAbsLabel = getClassedTag('div', 'label_desc','날짜에 0이 입력되어 있으면 계산시 오늘을 기준으로 0 대신 채웁니다.<br />단, 년도에 한해 ('+LIMIT_YEARS_HBD_MINIMUM+'~'+LIMIT_YEARS_HBD_MAXIMUM+') 범위로 상대적 기간 처럼 사용할 수 있음. 음수는 과거를 뜻하며, 시작일자가 미래인 경우 시작일자와 종료일자가 오늘로부터 1년 전까지 당겨질 수 있습니다.');
    divInputDateAbs.appendChild(divInputAbsLabel);


    // 날짜 입력 영역
    var divAreaInDate = getClassedTag('div','input_area_date','');
    divAreaInDate.appendChild(divInputDateRel);
    divAreaInDate.appendChild(divInputDateAbs);


    //항목 변경시 표시 설정
    selectInputType.addEventListener('change', function () {
        showProperInputDate(this.value, divInputDateRel, divInputDateAbs);
    });
    showProperInputDate(selectInputType.value, divInputDateRel, divInputDateAbs);


    // 페이지에 적용
    inputEntry.appendChild(inputNoInternal);
    inputEntry.appendChild(divAreaInDnT);
    inputEntry.appendChild(divAreaInDate);
    //inputEntry.appendChild(btnInputSubmit); 
    //inputEntry.appendChild(btnInputCancel);
    setInputSubmitBtnTxt(submitBtnTxt);
    

    alertAndLog('searchDateLen: [options] finished preparing input area.');
}


/**
 * 초기화 버튼을 구성합니다.
 */
function populateResetBtn(){
    var btnReset = document.getElementById('btnReset');
    btnReset.addEventListener('click', function () {
        initializeSearchDateLen(function(){
            loadOptions();
        });
    });
}

function populateOnceInputBtn(){

    // 등록(수정/추가) 버튼
    var btnInputSubmit = document.getElementById('btnInputSubmit');
    //var btnInputSubmit = document.createElement('button');
    //btnInputSubmit.setAttribute('type','button');
    //btnInputSubmit.innerHTML = submitBtnTxt;
    // 아래 방법은 content security policy에서 inline javascript를 제한하는 정책을 위배 - 작동 안됨
    //btnInputSubmit.setAttribute('onclick','submitDateEntry();');
    // 대신 addEventListener를 사용하세요
    //btnInputSubmit.removeEventListener('click'); // 하나는 안됨 문법 오류
    btnInputSubmit.addEventListener('click', function () {
        submitDateEntry(document.querySelector('#inputEntry #input_no_internal').value);
    });


    // 취소 버튼    
    var btnInputCancel = document.getElementById('btnInputCancel');
    //var btnInputCancel = document.createElement('button');
    //btnInputCancel.setAttribute('type','button');
    //btnInputCancel.innerHTML = '취소';
    //btnInputCancel.removeEventListener('click'); // 하나는 안됨 문법 오류
    btnInputCancel.addEventListener('click', function () {
        selectListEntry(-1);
        prepareInput(-1);
    });
}

function setInputSubmitBtnTxt(submitBtnText){
    var btnInputSubmit = document.getElementById('btnInputSubmit');
    btnInputSubmit.innerHTML = submitBtnText;
}

/**
 * 선택된 날짜 형식에 따라 상대적/절대적 날짜 항목 입력칸을 표시
 * @param {*} selectedOption 선택된 날짜 형식
 * @param {*} relDiv 상대적 날짜 입력칸 
 * @param {*} absDiv 절대적 날짜 입력칸
 */
function showProperInputDate(selectedOption, relDiv, absDiv){
    var isAbsoluteDate = false;
    var isFromDate = false;
    var isToDate = false;

    switch(selectedOption){
    case DLE_TYPE_REL_FROM: //'rel_from':
        isFromDate = true;

        break;
    case DLE_TYPE_REL_TO: //'rel_to':
        isToDate = true;

        break;
    case DLE_TYPE_REL_RANGE: //'rel_range':
        isFromDate = true;
        isToDate = true;

        break;
    case DLE_TYPE_ABS_FROM: //'abs_from':
        isAbsoluteDate = true;
        isFromDate = true;

        break;
    case DLE_TYPE_ABS_TO: //'abs_to':
        isAbsoluteDate = true;
        isToDate = true;

        break;
    case DLE_TYPE_ABS_RANGE: //'abs_range':
        isAbsoluteDate = true;
        isFromDate = true;
        isToDate = true;
        

        break;
    }

    // 상대적/절대적 입력칸을 선택
    var selectedDiv = null;
    if(isAbsoluteDate){     
        selectedDiv = absDiv;   
        relDiv.classList.add("hidden");
        absDiv.classList.remove("hidden");
    }else{
        selectedDiv = relDiv;
        relDiv.classList.remove("hidden");
        absDiv.classList.add("hidden");
    }

    // 상대적/절대적 전환시 입력칸 초기화나 표시 정리가 이루어지지 않지만
    // 표시할 때 제대로 표시된다.
    // 단, 입력하던 내용을 옮겨주진 않으므로 주의
    if(isFromDate){
        selectedDiv.querySelector('#input_date_from').classList.remove("hidden");
    }else{
        selectedDiv.querySelector('#input_date_from').classList.add("hidden");
    }
    if(isToDate){
        selectedDiv.querySelector('#input_date_to').classList.remove("hidden");
    }else{
        selectedDiv.querySelector('#input_date_to').classList.add("hidden");
    }
}


/**
 * 입력/수정 값을 란에서 읽고 스토리지에 저장한다
 * @param {*} entryNo 항목 번호. -1은 신규 아이템으로 삽입
 */
function submitDateEntry(entryNo = -1){
    alertAndLog('searchDateLen: [options] submitting dateEntry into storage.');

    // inputEntry div
    var inputEntry = document.querySelector('#inputEntry');
    
    // input_name input
    var inputName = inputEntry.querySelector('#input_name');

    // 이름이 입력되지 않으면 저장을 못하게 하자
    inputName.value = inputName.value.trim();
    if(inputName.value == '' || inputName.value.length == 0){
        alert('항목을 저장하려면 이름을 입력해 주세요');
        return false;
    }

    // input_type select
    var selectInputType = inputEntry.querySelector('#input_type');


    // 시작기간
    // 시작개년 div+input
    var inputRelFromYear = inputEntry.querySelector('#input_rel_from_year');
    // 시작개월 div+input
    var inputRelFromMonth = inputEntry.querySelector('#input_rel_from_month');
    // 시작개일 div+input
    var inputRelFromDate = inputEntry.querySelector('#input_rel_from_date');

    // 종료기간
    // 종료개년 div+input
    var inputRelToYear = inputEntry.querySelector('#input_rel_to_year');
    // 종료개월 div+input
    var inputRelToMonth = inputEntry.querySelector('#input_rel_to_month');
    // 종료개일 div+input
    var inputRelToDate = inputEntry.querySelector('#input_rel_to_date');


    // 절대적 기간 컨테이너 div
    // 시작년도 div+input
    var inputAbsFromYear = inputEntry.querySelector('#input_abs_from_year');
    // 시작월 div+input
    var inputAbsFromMonth = inputEntry.querySelector('#input_abs_from_month');
    // 시작일 div+input
    var inputAbsFromDate = inputEntry.querySelector('#input_abs_from_date');

    // 종료날짜
    // 종료년도 div+input
    var inputAbsToYear = inputEntry.querySelector('#input_abs_to_year');
    // 종료월 div+input
    var inputAbsToMonth = inputEntry.querySelector('#input_abs_to_month');
    // 종료일 div+input
    var inputAbsToDate = inputEntry.querySelector('#input_abs_to_date');


    // 객체에 반영
    dateEntry = {}; // new obj
    dateEntry[DLE_JSON_COL_NAME] = inputName.value;
    dateEntry[DLE_JSON_COL_TYPE] = selectInputType.value;

    switch(dateEntry[DLE_JSON_COL_TYPE]){
        case DLE_TYPE_REL_FROM:
        case DLE_TYPE_REL_TO:
        case DLE_TYPE_REL_RANGE:
            dateEntry[DLE_JSON_COL_FROM_YEAR] = inputRelFromYear.value;
            dateEntry[DLE_JSON_COL_FROM_MONTH] = inputRelFromMonth.value;
            dateEntry[DLE_JSON_COL_FROM_DATE] = inputRelFromDate.value;
            dateEntry[DLE_JSON_COL_TO_YEAR] = inputRelToYear.value;
            dateEntry[DLE_JSON_COL_TO_MONTH] = inputRelToMonth.value;
            dateEntry[DLE_JSON_COL_TO_DATE] = inputRelToDate.value;
            break;
        case DLE_TYPE_ABS_FROM:
        case DLE_TYPE_ABS_TO:
        case DLE_TYPE_ABS_RANGE:
            dateEntry[DLE_JSON_COL_FROM_YEAR] = inputAbsFromYear.value;
            dateEntry[DLE_JSON_COL_FROM_MONTH] = inputAbsFromMonth.value;
            dateEntry[DLE_JSON_COL_FROM_DATE] = inputAbsFromDate.value;
            dateEntry[DLE_JSON_COL_TO_YEAR] = inputAbsToYear.value;
            dateEntry[DLE_JSON_COL_TO_MONTH] = inputAbsToMonth.value;
            dateEntry[DLE_JSON_COL_TO_DATE] = inputAbsToDate.value;
            break;
    }
    
    // 신규 항목은 맨 아래쪽에 넣는다.
    if(entryNo < 0){
        entryNo = datesData.length;
    }

    // 데이터에 반영
    datesData[entryNo] = dateEntry;
    
    saveAndReload();
}

/**
 * dateEntry 한 칸 위로 (배열상 앞으로) 이동
 * @param {*} entryNo 옮길 dateEntry
 */
function actionMoveUpDateEntry(entryNo){
    if(entryNo <= 0){
        // 0번 원소는 더 이상 앞으로 갈 수 없음
        return;
    }
    var dateEntry = datesData[entryNo];
    removeDateEntry(entryNo);
    insertDateEntry(--entryNo, dateEntry);
    saveAndReload();
}

/**
 * dateEntry 한 칸 아래로 (배열상 뒤로) 이동
 * @param {*} entryNo 
 */
function actionMoveDownDateEntry(entryNo){
    if(entryNo >= datesData.length-1){
        // length-1 번 원소는 더 이상 뒤로 갈 수 없음
        // 에> 5개인 경우 4번 원소는 더 뒤로 갈 수 없음
        return;
    }
    var dateEntry = datesData[entryNo];
    removeDateEntry(entryNo);
    insertDateEntry(++entryNo, dateEntry);
    saveAndReload();
}

/**
 * 해당 entryNo의 항목을 삭제하고 반영합니다
 * @param {*} entryNo 삭제할 dateEntry 번호
 */
function actionRemoveDateEntry(entryNo){
    removeDateEntry(entryNo);
    saveAndReload();
}


/**
 * 해당 index의 항목을 datesData에서 삭제
 * @param {*} index 항목 번호
 */
function removeDateEntry(index){    
    // index자리 1칸을 기존 배열에서 따로 뽑아내고 빈 공간은 합쳐 갯수 1 감소.
    return datesData.splice(index, 1);
}


/**
 * 해당 index에 item 항목을 datesData에 삽입
 * @param {*} index 항목 번호
 * @param {*} item 각 개별 dateEntry
 */
function insertDateEntry(index, item){
    // 아무 칸도 뽑아내지 않고 index 자리에 끼워 넣는다. 갯수 1 증가
    datesData.splice(index, 0, item);
}


/**
 * 스토리지에 저장하고 페이지를 새로고침합니다.
 */
function saveAndReload(){
    prepareStorage();
    saveStorage(function(){
        // 새로고침
        loadOptions();
    });
}