// 格式化歌曲时间
export function showNum(n) {
    let formatN = parseInt(n);
    if (formatN < 10 && formatN >= 0) {
        return "0" + formatN.toString();
    } else if (formatN >= 10) {
        return formatN.toString();
    }
}
// 格式化时间戳
export function formatDate(date) {
    var date = new Date(date);
    var YY = date.getFullYear() + '-';
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    // var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    // var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    // var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return YY + MM + DD;
    //+" "+hh + mm + ss;
}
export function JINGqueformatDate(date) {
    var date = new Date(date);
    var YY = date.getFullYear() + '-';
    var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) //+ ':';
    // var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return YY + MM + DD + " " + hh + mm;
}
// 防抖函数
export function debonuce(fnName, delay) {
    let timer = null;
    return () => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout((e) => {
            //this[fnName](e);
            console.log(this);
        }, delay);
    }
}
