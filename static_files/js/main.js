'use strict';

const dq = x => document.querySelector(x);
const dqAll = x => document.querySelectorAll(x);
const dc = x => document.createElement(x);
const wi = window.innerHeight;
let body = dq('body');
let header = dq('#header');
let inheader = dq('#inheader');
let inheaderli = dqAll('.inheaderli');
let container = dq('#container');
let finish = true;
let respage = 1;
const baseurl = '/result';
let scrollTop = dq('#wrapper').scrollTop;
let preDown = dq('#wrapper').scrollTop;
let preUp = dq('#wrapper').scrollTop;

// begin mobile compatible
function isscroll() {
    // monitor the window, return the contents after the 2nd page
    if (wi + dq('#wrapper').scrollTop >= dq('#wrapper').scrollHeight - 23 && finish && dq('#loading') && getquery('q')) {
        finish = false;
        dq('#loading').style.display = 'block';
        setTimeout(function () {
            console.log('Page ' + respage + ' success!');
            getquery('column') ? loaditems(baseurl + '?page=' + respage + '&column=' + getquery('column') + '&q=' + getquery('q')) : loaditems(baseurl + '?page=' + respage + '&column=1' + '&q=' + getquery('q'));
            finish = true;
            dq('#loading').style.display = 'none';
        }, 350)
    }
    hideHeader();
}

function mobile_compatible() {
    function resize() {
        if (window.innerWidth < 818) {
            if (dq('.head')) {
                dq('.head').style.fontSize = '40px';
            }
            if (dq('.big')) {
                dq('.big').style.fontSize = '25px';
            }
            if (dq('.sub')) {
                dq('.sub').style.fontSize = '36px';
            }
            header.style.display = 'none';
            dq('#mobinav').style.display = 'block';
            container.style.minHeight = 'calc(100% - 240px)';
            if (dq('#schbar')) {
                dq('#schbar').style.display = 'none';
            }
            if (dq('#la-1')) {
                dq('#la-1').style.display = 'none';
                dq('#la-2').style.display = 'block';
            }
        } else if (window.innerWidth >= 818) {
            if (dq('.head')) {
                dq('.head').style.fontSize = '60px';
            }
            if (dq('.big')) {
                dq('.big').style.fontSize = '35px';
            }
            if (dq('.sub')) {
                dq('.sub').style.fontSize = '48px';
            }
            header.style.display = 'block';
            dq('#mobinav').style.display = 'none';
            container.style.minHeight = 'calc(100% - 190px)';
            if (dq('#schbar')) {
                dq('#schbar').style.display = 'inline-block';
            }
            if (dq('#la-1')) {
                dq('#la-2').style.display = 'none';
                dq('#la-1').style.display = 'block';
            }
        }

        if (window.innerWidth < 1100) {
            container.style.maxWidth = 'calc(' + window.innerWidth.toString() + ' - 20px)';
            // container.style.left = '0';
            container.style.marginLeft = '25px';
        } else {
            container.style.maxWidth = '1050px';
            // container.style.left = 'calc(50% - ' + container.offsetWidth.toString() + 'px / 2 - 25px)';
            container.style.marginLeft = 'calc(50% - ' + container.offsetWidth.toString() + 'px / 2)';
        }

        // modify the width of the header.html 211228
        if (wi < dq('#wrapper').scrollHeight) {
            dq('#header').style.width = 'calc(100% - 12px)';
        } else {
            dq('#header').style.width = '100%';
        }

        dq('#imgdiv').style.height = `${window.innerHeight}px`;

    }

    resize();
    isscroll();

    window.onresize = () => resize();
    dq('#wrapper').onscroll = () => isscroll();

    if (dq('#mobibtn')) {
        dq('#mobibtn').onclick = () => {
            header.style.display = 'block';
            header.style.width = '300px';
            header.style.height = 'calc(100% - 15px)';
            header.style.position = 'absolute';
            inheader.style.textAlign = 'start';
            for (let i = 0; i < inheaderli.length; i++) {
                inheaderli[i].style.display = 'block';
                inheaderli[i].style.marginTop = '8px';
            }
            dq('#mobiclose').style.display = 'block';
        }
    }
    dq('#mobiclose').onclick = () => {
        window.innerWidth < 818 ? header.style.display = 'none' : header.style.display = 'block';
        header.style.width = '100%';
        header.style.height = '45px';
        header.style.position = 'static';
        inheader.style.textAlign = 'center';
        for (let i = 0; i < inheaderli.length; i++) {
            inheaderli[i].style.display = 'inline-block';
            inheaderli[i].style.marginTop = '0px';
        }
        dq('#mobiclose').style.display = 'none';
    }
    // end mobile compatible
}

mobile_compatible();

// the formats of notes pages are as below
if (dq('.mdtemp')) {
    container.style.maxWidth = '1050px';
    // container.style.left = 'calc(50% - ' + container.offsetWidth.toString() + 'px / 2 - 25px)';
    container.style.marginLeft = 'calc(50% - ' + container.offsetWidth.toString() + 'px / 2)';
    // the hash keys of every subtitles are as below
    let h2s = dqAll('h2');
    let h3s = dqAll('h3');
    let h4s = dqAll('h4');
    let h5s = dqAll('h5');
    let h2as = [];
    let h3as = [];
    let h4as = [];
    let h5as = [];
    let pcodeynk = [];

    for (let k = 0; k < h2s.length; k++) {
        h2s[k].setAttribute('id', 'h2' + k.toString());
        h2as.push(dc('a'));
        h2as[k].textContent = '\xa0\xa0\xa0\xa0#';
        h2as[k].setAttribute('style', 'color: #777; font-size: 38px; font-weight: 400; text-decoration: none;');
        h2as[k].setAttribute('class', 'tthash');
        h2as[k].setAttribute('href', '#h2' + k.toString());
        h2as[k].onmouseover = () => h2as[k].setAttribute('style', 'color: #65ff65; font-size: 38px; font-weight: 800; text-decoration: none;');
        h2as[k].onmousedown = () => h2as[k].setAttribute('style', 'color: rgb(255, 144, 101); font-size: 38px; font-weight: 900; text-decoration: none;');
        h2as[k].onmouseout = () => h2as[k].setAttribute('style', 'color: #777; font-size: 38px; font-weight: 400; text-decoration: none;');
        h2s[k].appendChild(h2as[k]);
    }
    for (let k = 0; k < h3s.length; k++) {
        h3s[k].setAttribute('id', 'h3' + k.toString());
        h3as.push(dc('a'));
        h3as[k].textContent = '\xa0\xa0\xa0\xa0#';
        h3as[k].setAttribute('style', 'color: #777; font-size: 34px; font-weight: 400; text-decoration: none;');
        h3as[k].setAttribute('class', 'tthash');
        h3as[k].setAttribute('href', '#h3' + k.toString());
        h3as[k].onmouseover = () => h3as[k].setAttribute('style', 'color: #65ff65; font-size: 34px; font-weight: 800; text-decoration: none;');
        h3as[k].onmousedown = () => h3as[k].setAttribute('style', 'color: rgb(255, 144, 101); font-size: 34px; font-weight: 900; text-decoration: none;');
        h3as[k].onmouseout = () => h3as[k].setAttribute('style', 'color: #777; font-size: 34px; font-weight: 400; text-decoration: none;');
        h3s[k].appendChild(h3as[k]);
    }
    for (let k = 0; k < h4s.length; k++) {
        h4s[k].setAttribute('id', 'h4' + k.toString());
        h4as.push(dc('a'));
        h4as[k].textContent = '\xa0\xa0\xa0\xa0#';
        h4as[k].setAttribute('style', 'color: #777; font-size: 28px; font-weight: 400; text-decoration: none;');
        h4as[k].setAttribute('class', 'tthash');
        h4as[k].setAttribute('href', '#h4' + k.toString());
        h4as[k].onmouseover = () => h4as[k].setAttribute('style', 'color: #65ff65; font-size: 28px; font-weight: 800; text-decoration: none;');
        h4as[k].onmousedown = () => h4as[k].setAttribute('style', 'color: rgb(255, 144, 101); font-size: 28px; font-weight: 900; text-decoration: none;');
        h4as[k].onmouseout = () => h4as[k].setAttribute('style', 'color: #777; font-size: 28px; font-weight: 400; text-decoration: none;');
        h4s[k].appendChild(h4as[k]);
    }
    for (let k = 0; k < h5s.length; k++) {
        h5s[k].setAttribute('id', 'h5' + k.toString());
        h5as.push(dc('a'));
        h5as[k].textContent = '\xa0\xa0\xa0\xa0#';
        h5as[k].setAttribute('style', 'color: #777; font-size: 26px; font-weight: 400; text-decoration: none;');
        h5as[k].setAttribute('class', 'tthash');
        h5as[k].setAttribute('href', '#h5' + k.toString());
        h5as[k].onmouseover = () => h5as[k].setAttribute('style', 'color: #65ff65; font-size: 26px; font-weight: 800; text-decoration: none;');
        h5as[k].onmousedown = () => h5as[k].setAttribute('style', 'color: rgb(255, 144, 101); font-size: 26px; font-weight: 900; text-decoration: none;');
        h5as[k].onmouseout = () => h5as[k].setAttribute('style', 'color: #777; font-size: 26px; font-weight: 400; text-decoration: none;');
        h5s[k].appendChild(h5as[k]);
    }

    // below are the linenums of the large codeblocks

    // the yank buttons of the non code block
    let pcodes = dqAll('p > code');
    let non_block_copy_icon = [];
    for (let k = 0; k < pcodes.length; k++) {
        pcodeynk.push(dc('button'));
        // pcodeynk[k].textContent = '<i class="far fa-copy"></i>';
        non_block_copy_icon.push(dc('i'));
        non_block_copy_icon[k].setAttribute('class', 'far fa-copy');
        pcodeynk[k].appendChild(non_block_copy_icon[k]);
        pcodeynk[k].onclick = () => {
            navigator.clipboard.writeText(pcodes[k].textContent).then(function () {
                /* clipboard successfully set */
                let tmpok = dc('span');
                tmpok.textContent = '复制成功！';
                tmpok.style.color = '#f00';
                pcodeynk[k].after(tmpok);
                tmpok.style.fontSize = '15px';
            }, function () {
                /* clipboard write failed */
                let tmpok = dc('span');
                tmpok.textContent = '复制失败！';
                tmpok.style.color = '#00f';
                pcodeynk[k].after(tmpok);
                tmpok.style.fontSize = '15px';
            });
        }
        pcodes[k].before(pcodeynk[k]);
    }
}
// 文章页面格式结束
// 日期格式化输出
Date.prototype.format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
            );
        }
    }
    return fmt;
}
//展示搜索结果开始
//query返回的是请求的字段
function getquery(query) {
    let params = window.location.search.substring(1);
    let paramarray = params.split('&');
    for (let i = 0; i < paramarray.length; i++) {
        let pair = paramarray[i].split('=');
        if (pair[0] === query) {
            return pair[1];
        }
    }
    return false;
}

if (getquery('column') <= 6 && getquery('column') >= 1 && dq('#schcolumn')) {
    dq('#schcolumn').setAttribute('value', getquery('column'));
}
//这里展示的是首页
if (getquery('q') && dq('#schq') && dq('#mobischq')) {
    dq('#schq').setAttribute('value', decodeURIComponent(getquery('q')));
    dq('#mobischq').setAttribute('value', decodeURIComponent(getquery('q')));
    getquery('column') ? loaditems(baseurl + '?page=' + respage + '&column=' + getquery('column') + '&q=' + getquery('q')) : loaditems(baseurl + '?page=' + respage + '&column=1' + '&q=' + getquery('q'));
}

// 这里一定要传入uri解码后的数据
function makehighlight(text, displaynum, query, nodename) {
    let afterh = [];
    // 把数据存入afterh中
    while (text.search(RegExp(query, 'i')) !== -1) {
        if (text.search(RegExp(query, 'i')) === 0) {
            afterh.push(text.slice(0, query.length));
            text = text.slice(query.length);
        } else {
            afterh.push(text.slice(0, text.search(RegExp(query, 'i'))));
            text = text.slice(text.search(RegExp(query, 'i')));
        }
    }
    afterh.push(text);
    // console.log(afterh);
    // begin to show the contents
    let blspan = [];
    let redspan = [];
    for (let j = 0; j < afterh.length; j++) {
        if (afterh[j].search(RegExp(query, 'i')) === 0) {
            redspan.push(dc('span'));
            redspan[redspan.length - 1].style.color = '#d00';
            redspan[redspan.length - 1].style.backgroundColor = '#fbe54e';
            redspan[redspan.length - 1].style.fontWeight = '700';
            redspan[redspan.length - 1].textContent = afterh[j];
            dq(nodename + displaynum).appendChild(redspan[redspan.length - 1]);
        } else {
            blspan.push(dc('span'));
            blspan[blspan.length - 1].textContent = afterh[j];
            dq(nodename + displaynum).appendChild(blspan[blspan.length - 1]);
        }
    }
}

function loaditems(queryurl) {
    document.title = '关于“' + decodeURIComponent(getquery('q')) + '”的搜索结果';
    let pagelabel = dc('div');
    pagelabel.setAttribute('class', 'pagelabel');
    let resblock = [];
    let resnum = [];
    let restitle = [];
    let resdes = [];
    let reshref = [];
    let resdetail = [];
    let resdate = [];
    let resdelta = [];
    fetch(queryurl)
        .then(res => {
            if (res.ok) {
                res.json().then(data => {
                    pagelabel.textContent = 'Page\xa0' + data.page;
                    container.appendChild(pagelabel);
                    let displaynum;
                    for (let i = 0; i < data.res.length; i++) {
                        displaynum = i + (12 * respage) - 12;
                        resblock.push(dc('a'));
                        resblock[i].setAttribute('class', 'resblock');
                        resblock[i].setAttribute('href', '/go/' + data.res[i].id);
                        resblock[i].setAttribute('target', '_blank');
                        if (getquery('column')) {
                            resblock[i].style.width = 'calc(' + 100 / getquery('column') + '% - 20px)';
                        } else {
                            resblock[i].style.width = 'calc(100% - 20px)';
                        }
                        resnum.push(dc('div'));
                        resnum[i].setAttribute('class', 'resnum');
                        restitle.push(dc('div'));
                        restitle[i].setAttribute('class', 'restitle');
                        resdes.push(dc('div'));
                        resdes[i].setAttribute('class', 'resdes');
                        reshref.push(dc('div'));
                        reshref[i].setAttribute('class', 'reshref');
                        resdetail.push(dc('div'));
                        resdetail[i].setAttribute('class', 'resdetail');
                        resdate.push(dc('span'));
                        resdate[i].setAttribute('class', 'resdate');
                        resdelta.push(dc('a'));
                        resdelta[i].setAttribute('class', 'resdelta');
                        resnum[i].textContent = displaynum + 1;
                        // restitle[i].textContent = data.res[i].title;
                        // resdes[i].textContent = data.res[i].description;
                        reshref[i].textContent = data.res[i].href;
                        resdate[i].textContent = new Date(parseInt(data.res[i].id.substring(0, 8), 16) * 1000).format('yyyy-M-d h:mm:ss');
                        resdelta[i].textContent = '详细信息';
                        resdelta[i].setAttribute('href', "JavaScript: window.open('/detail?oid=" + data.res[i].id + "&q=" + getquery('q') + "','详细信息','toolbar=no,location=no,status=no,menubar=no,revisable=no,width=750,height=600');");
                        resblock[i].setAttribute('id', 'resblock' + displaynum);
                        restitle[i].setAttribute('id', 'restitle' + displaynum);
                        resdes[i].setAttribute('id', 'resdes' + displaynum);
                        resdetail[i].setAttribute('id', 'resdetail' + displaynum);
                        container.appendChild(resblock[i]);
                        dq('#resblock' + displaynum).appendChild(resnum[i]);
                        dq('#resblock' + displaynum).appendChild(restitle[i]);
                        makehighlight(data.res[i].title, displaynum, decodeURIComponent(getquery('q')), '#restitle');
                        dq('#resblock' + displaynum).appendChild(resdes[i]);
                        makehighlight(data.res[i].description, displaynum, decodeURIComponent(getquery('q')), '#resdes');
                        dq('#resblock' + displaynum).appendChild(reshref[i]);
                        dq('#resblock' + displaynum).appendChild(resdetail[i]);
                        dq('#resdetail' + displaynum).appendChild(resdate[i]);
                        dq('#resdetail' + displaynum).appendChild(resdelta[i]);
                    }
                    respage++;
                    isscroll();
                })
            } else {
                if (res.status === 404) {
                    const err5 = dc('div');
                    err5.textContent = '已经到最后一页了或结果没找到';
                    err5.style.color = '#e00';
                    err5.style.textAlign = 'center';
                    container.appendChild(err5);
                } else {
                    const err3 = dc('div');
                    err3.textContent = '网络请求失败，状态码:' + res.status + ': ' + res.statusText;
                    err3.style.color = '#e00';
                    err3.style.textAlign = 'center';
                    container.appendChild(err3);
                }
            }
        })
        .catch(error => {
            const err4 = dc('div');
            err4.textContent = '网络不通或服务器无法响应' + error;
            err4.style.color = '#e00';
            err4.style.textAlign = 'center';
            container.appendChild(err4);
        })
}

if (wi > dq('#wrapper').scrollHeight && dq('#loading')) {
    isscroll();
    // setTimeout(isscroll(), 250);
}
// end show results of search

// the detailed pages
if (dq('.detail')) {
    fetch('/detdes?oid=' + getquery('oid'))
        .then(res => {
            if (res.ok) {
                res.json().then(data => {
                    dq('#detoid').textContent = data._id.$oid;
                    dq('#detdate').textContent = new Date(parseInt(data._id.$oid.substring(0, 8), 16) * 1000).format('yyyy-M-d h:mm:ss');
                    dq('#dethref').textContent = data.href;
                    dq('#dethref').setAttribute('href', '/go/' + getquery('oid'));
                    dq('#dethref').setAttribute('target', '_blank');
                    makehighlight(data.title, '', decodeURIComponent(getquery('q')), '#dettitle');
                    makehighlight(data.description, '', decodeURIComponent(getquery('q')), '#detdes');
                })
            } else {
                const err3 = dc('div');
                err3.textContent = '网络请求失败，状态码:' + res.status + ': ' + res.statusText;
                err3.style.color = '#e00';
                err3.style.textAlign = 'center';
                dq('#detdes').appendChild(err3);
            }
        })
}

// the hue bar of the header
let isDarkTheme = 0;

function getCookie(key) {
    let myCookies = document.cookie.split('; ');
    for (let i = 0; i < myCookies.length; i++) {
        let cookiePair = myCookies[i].split('=');
        if (cookiePair[0] === key) {
            return cookiePair[1];
        }
    }
    return false;
}

function changeHue(value, isdark) {
    document.cookie = `hue_rotate_value=${value.toString()};secure`;
    document.cookie = `is_dark_theme=${isdark.toString()};secure`;
    body.style.filter = 'invert(' + isdark + ') hue-rotate(' + value + 'deg)';
    let imgs = document.querySelectorAll('img');
    for (let i = 0; i < imgs.length; i++) {
        imgs[i].style.filter = 'invert(' + isdark + ') hue-rotate(' + (-Number(value)).toString() + 'deg)';
    }
}

function changeTheme() {
    if (isDarkTheme === 0) {
        dq('#change-theme-i').className = 'fas fa-sun';
        isDarkTheme = 1;
    } else {
        dq('#change-theme-i').className = 'fas fa-moon';
        isDarkTheme = 0;
    }
    Number(dq('#hue-rotate').value) < 180 ? dq('#hue-rotate').value = Number(dq('#hue-rotate').value) + 180 : dq('#hue-rotate').value = Number(dq('#hue-rotate').value) - 180;
    changeHue(Number(dq('#hue-rotate').value), isDarkTheme);
}

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    dq('#change-theme-i').className = 'fas fa-sun';
    isDarkTheme = 1;
    dq('#hue-rotate').value = 180;
} else {
    dq('#change-theme-i').className = 'fas fa-moon';
    isDarkTheme = 0;
}

if (getCookie('hue_rotate_value')) {
    dq('#hue-rotate').value = Number(getCookie('hue_rotate_value'));
}
if (getCookie('is_dark_theme')) {
    isDarkTheme = Number(getCookie('is_dark_theme'));
    if (isDarkTheme === 1) {
        dq('#change-theme-i').className = 'fas fa-sun';
    } else {
        dq('#change-theme-i').className = 'fas fa-moon';
    }
}

changeHue(dq('#hue-rotate').value, isDarkTheme);

function hueRotateInput() {
    changeHue(dq('#hue-rotate').value, isDarkTheme);
}

// end of the hue bar of the header

// use translate3d to the header
function hideHeader() {
    if (dq('#wrapper').scrollTop >= scrollTop) {
        dq('#header').style.transform = `translate3d(0, -${dq('#wrapper').scrollTop - preDown}px, 0)`;
        if (dq('#wrapper').scrollTop > scrollTop) {
            preUp = dq('#wrapper').scrollTop;
        }
    } else {
        if (preUp - dq('#wrapper').scrollTop < 60) {
            // console.log(preUp, dq('#wrapper').scrollTop);
            dq('#header').style.transform = `translate3d(0, ${-60 + preUp - dq('#wrapper').scrollTop}px, 0)`;
        } else {
            dq('#header').style.transform = 'translate3d(0, 0, 0)';
        }
        preDown = dq('#wrapper').scrollTop;
    }
    scrollTop = dq('#wrapper').scrollTop;
}

// to show the images
let imgsInContainer = dqAll('#container img');
for (let i = 0; i < imgsInContainer.length; i++) {
    imgsInContainer[i].setAttribute('onclick', `imgsOnclick('${imgsInContainer[i].attributes.src.nodeValue}')`);
}

function imgsOnclick(src) {
    dq('#imgdiv').style.display = 'block';
    dq('#imgshow').setAttribute('src', src);
}

dq('#imgshow').onclick = () => {
    dq('#imgdiv').style.display = 'none';
}