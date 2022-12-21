
// 0 ~ 8 表示筒子 9 ~ 17表示条子  18 ~ 26表示万
// 东27 西28 南29 北30 中31 发32 白33

type Pai = number;
type laiZiInfo = Array<Pai>;
type Holds = Array<Pai>;

interface SeatData {
    holds: Holds,
    countMap: {
        [pai: string]: number
    }
}


function checkSingle(seatData: SeatData, laiZiInfo: laiZiInfo): boolean {
    var holds: Holds = seatData.holds;
    var oldLaiZiInfo: laiZiInfo = laiZiInfo.slice();
    var selected: Pai = -1;
    var c: number = 0;
    for (var i = 0; i < holds.length; ++i) {
        var pai: Pai = holds[i];
        c = seatData.countMap[pai];
        if (c != 0) {
            selected = pai;
            break;
        }
    }
    //如果没有找到剩余牌，则表示匹配成功了
    if (selected == -1) {
        return true;
    }
    //否则，进行匹配
    if (c == 3) {
        //直接作为一坎
        seatData.countMap[selected] = 0;
        var ret: boolean = checkSingle(seatData, laiZiInfo);
        //立即恢复对数据的修改
        seatData.countMap[selected] = c;
        if (ret == true) {
            return true;
        }
    } else if (c == 4) {
        //直接作为一坎
        seatData.countMap[selected] = 1;
        var ret: boolean = checkSingle(seatData, laiZiInfo);
        //立即恢复对数据的修改
        seatData.countMap[selected] = c;
        //如果作为一坎能够把牌匹配完，直接返回TRUE。
        if (ret == true) {
            return true;
        }
    }

    //按单牌处理
    var ret: boolean = matchSingle(seatData, selected, laiZiInfo);
    laiZiInfo = oldLaiZiInfo.slice();
    if (ret == true) {
        return true;
    }

    //含癞子处理开始
    if (laiZiInfo.length < 1) {
        return false;
    }
    //否则，进行匹配
    if (c + laiZiInfo.length >= 3) {
        laiZiInfo.splice(0, 3 - c);
        //直接作为一坎
        seatData.countMap[selected] = 0;
        var ret: boolean = checkSingle(seatData, laiZiInfo);
        //立即恢复对数据的修改
        seatData.countMap[selected] = c;
        laiZiInfo = oldLaiZiInfo.slice();
        if (ret == true) {
            return true;
        }
    } else if (c + laiZiInfo.length >= 4) {
        laiZiInfo.splice(0, 4 - c);
        //直接作为一坎
        seatData.countMap[selected] = 1;
        var ret: boolean = checkSingle(seatData, laiZiInfo);
        //立即恢复对数据的修改
        seatData.countMap[selected] = c;
        laiZiInfo = oldLaiZiInfo.slice();
        //如果作为一坎能够把牌匹配完，直接返回TRUE。
        if (ret == true) {
            return true;
        }
    }

    var ret: boolean = matchSingle(seatData, selected, laiZiInfo);
    laiZiInfo = oldLaiZiInfo.slice();
    return ret;

}

//匹配单张
function matchSingle(seatData: SeatData, selected: Pai, laiZiInfo: laiZiInfo): boolean {
    var oldLaiZiInfo = laiZiInfo.slice();
    //排除 东27 西28 南29 北30 中31 发32 白33
    if (selected > 26 && selected < 34) {
        return false;
    }

    //分开匹配 A-2,A-1,A
    var matched = true;

    //0-8 每种类型一共就张牌
    var v = selected % 9;
    if (v < 2) {
        matched = false;
    } else {
        for (var i = 0; i < 3; ++i) {
            var t = selected - 2 + i;
            var cc = seatData.countMap[t];
            if (cc == 0 || cc == null) {
                matched = false;
                break;
            }
        }
    }
    //匹配成功，扣除相应数值
    if (matched) {
        seatData.countMap[selected - 2]--;
        seatData.countMap[selected - 1]--;
        seatData.countMap[selected]--;
        var ret: boolean = checkSingle(seatData, laiZiInfo);
        laiZiInfo = oldLaiZiInfo.slice();
        seatData.countMap[selected - 2]++;
        seatData.countMap[selected - 1]++;
        seatData.countMap[selected]++;
        if (ret == true) {
            return true;
        }
    }
    //分开匹配 A-1,A,A + 1
    matched = true;
    if (v < 1 || v > 7) {
        matched = false;
    } else {
        for (var i = 0; i < 3; ++i) {
            var t = selected - 1 + i;
            var cc = seatData.countMap[t];
            if (cc == 0 || cc == null) {
                matched = false;
                break;
            }
        }
    }
    //匹配成功，扣除相应数值
    if (matched) {
        seatData.countMap[selected - 1]--;
        seatData.countMap[selected]--;
        seatData.countMap[selected + 1]--;
        var ret: boolean = checkSingle(seatData, laiZiInfo);
        laiZiInfo = oldLaiZiInfo.slice();
        seatData.countMap[selected - 1]++;
        seatData.countMap[selected]++;
        seatData.countMap[selected + 1]++;
        if (ret == true) {
            return true;
        }
    }
    //分开匹配 A,A+1,A + 2
    matched = true;
    if (v > 6) {
        matched = false;
    } else {
        for (var i = 0; i < 3; ++i) {
            var t = selected + i;
            var cc = seatData.countMap[t];
            if (cc == 0 || cc == null) {
                matched = false;
                break;
            }
        }
    }
    //匹配成功，扣除相应数值
    if (matched) {
        seatData.countMap[selected]--;
        seatData.countMap[selected + 1]--;
        seatData.countMap[selected + 2]--;
        var ret: boolean = checkSingle(seatData, laiZiInfo);
        laiZiInfo = oldLaiZiInfo.slice();
        seatData.countMap[selected]++;
        seatData.countMap[selected + 1]++;
        seatData.countMap[selected + 2]++;
        if (ret == true) {
            return true;
        }
    }

    //含癞子处理开始
    if (laiZiInfo.length < 1) {
        return false;
    }
    var useLaiziNum = [];
    //0-8 每种类型一共就张牌
    matched = true;
    var v = selected % 9;
    if (v < 2) {
        matched = false;
    } else {
        for (var i = 0; i < 3; ++i) {
            var t = selected - 2 + i;
            var cc = seatData.countMap[t];
            if (cc == 0 || cc == null) {
                if (laiZiInfo.length > 0) {
                    useLaiziNum.push(t);
                    seatData.countMap[t] = 1;
                    laiZiInfo.splice(0, 1);
                } else {
                    matched = false;
                    break;
                }
            }
        }

    }

    //匹配成功，扣除相应数值
    if (matched) {
        seatData.countMap[selected - 2]--;
        seatData.countMap[selected - 1]--;
        seatData.countMap[selected]--;
        var ret: boolean = checkSingle(seatData, laiZiInfo);
        seatData.countMap[selected - 2]++;
        seatData.countMap[selected - 1]++;
        seatData.countMap[selected]++;
        for (var i = 0; i < useLaiziNum.length; i++) {
            seatData.countMap[useLaiziNum[i]]--;
        }
        laiZiInfo = oldLaiZiInfo.slice();
        if (ret == true) {
            return true;
        }
    } else {
        laiZiInfo = oldLaiZiInfo.slice();
        for (var i = 0; i < useLaiziNum.length; i++) {
            seatData.countMap[useLaiziNum[i]]--;
        }
    }


    var useLaiziNum = [];
    //分开匹配 A-1,A,A + 1
    matched = true;
    if (v < 1 || v > 7) {
        matched = false;
    } else {
        for (var i = 0; i < 3; ++i) {
            var t = selected - 1 + i;
            var cc = seatData.countMap[t];
            if (cc == 0 || cc == null) {
                if (laiZiInfo.length > 0) {
                    useLaiziNum.push(t);
                    seatData.countMap[t] = 1;
                    laiZiInfo.splice(0, 1);
                } else {
                    matched = false;
                    break;
                }
            }
        }
    }
    //匹配成功，扣除相应数值
    if (matched) {
        seatData.countMap[selected - 1]--;
        seatData.countMap[selected]--;
        seatData.countMap[selected + 1]--;
        var ret: boolean = checkSingle(seatData, laiZiInfo);
        seatData.countMap[selected - 1]++;
        seatData.countMap[selected]++;
        seatData.countMap[selected + 1]++;
        for (var i = 0; i < useLaiziNum.length; i++) {
            seatData.countMap[useLaiziNum[i]]--;
        }
        useLaiziNum = [];
        laiZiInfo = oldLaiZiInfo.slice();
        if (ret == true) {
            return true;
        }
    } else {
        laiZiInfo = oldLaiZiInfo.slice();
        for (var i = 0; i < useLaiziNum.length; i++) {
            seatData.countMap[useLaiziNum[i]]--;
        }
    }
    var useLaiziNum = [];
    //分开匹配 A,A+1,A + 2
    matched = true;
    if (v > 6) {
        matched = false;
    } else {
        for (var i = 0; i < 3; ++i) {
            var t = selected + i;
            var cc = seatData.countMap[t];
            if (cc == 0 || cc == null) {
                if (laiZiInfo.length > 0) {
                    useLaiziNum.push(t);
                    seatData.countMap[t] = 1;
                    laiZiInfo.splice(0, 1);
                } else {
                    matched = false;
                    break;
                }
            }
        }
    }
    //匹配成功，扣除相应数值
    if (matched) {
        seatData.countMap[selected]--;
        seatData.countMap[selected + 1]--;
        seatData.countMap[selected + 2]--;
        var ret: boolean = checkSingle(seatData, laiZiInfo);
        seatData.countMap[selected]++;
        seatData.countMap[selected + 1]++;
        seatData.countMap[selected + 2]++;
        for (var i = 0; i < useLaiziNum.length; i++) {
            seatData.countMap[useLaiziNum[i]]--;
        }
        useLaiziNum = [];
        laiZiInfo = oldLaiZiInfo.slice();
        if (ret == true) {
            return true;
        }
    } else {
        laiZiInfo = oldLaiZiInfo.slice();
        for (var i = 0; i < useLaiziNum.length; i++) {
            seatData.countMap[useLaiziNum[i]]--;
        }
    }
    return false;
}