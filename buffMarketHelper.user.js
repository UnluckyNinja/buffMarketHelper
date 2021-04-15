// ==UserScript==
// @name            网易BUFF价格比例(找挂刀)插件
// @namespace       https://greasyfork.org/zh-CN/users/412840-newell-gabe-l
// @description     找挂刀？批量购买？找玄学？不如先整个小帮手帮你，问题反馈QQ群544144372
// @version         2.1.9
// @note            更新于2021年4月15日13:06:28
// @author          Pronax
// @copyright       2021, Pronax
// @supportURL      https://jq.qq.com/?_wv=1027&k=U8mqorxQ
// @feedback-url    https://jq.qq.com/?_wv=1027&k=U8mqorxQ
// @license         AGPL-3.0
// @match           https://buff.163.com/market/goods*
// @match           https://buff.163.com/market/?game=*
// @icon            https://gitee.com/pronax/buffMarketHelper/raw/feature/Wingman.png
// @run-at          document-body
// @grant           GM_xmlhttpRequest
// @grant           GM_addStyle
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_info
// @grant           GM_registerMenuCommand
// ==/UserScript==

(function () {

    'use strict';

    const steanOrderScaleTemp = "<span class=\"f_12px f_Bold l_Right\" style=\"margin-top: inherit;\"></span>";
    const steanOrderNumberTemp = "<span class=\"f_12px c_Gray f_Bold l_Right\" style=\"margin-top: inherit;\"></span>";
    const steanOrderNumberErrorTemp = "<span class=\"f_12px c_Gray f_Bold l_Right\" style=\"margin-top: inherit;color:#e45302 !important\"></span>";
    const g_rgCurrencyData = { "AED": { "strCode": "AED", "eCurrencyCode": 32, "strSymbol": "AED", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "ARS": { "strCode": "ARS", "eCurrencyCode": 34, "strSymbol": "ARS$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": " " }, "AUD": { "strCode": "AUD", "eCurrencyCode": 21, "strSymbol": "A$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "BGN": { "strCode": "BGN", "eCurrencyCode": 42, "strSymbol": "лв", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "BRL": { "strCode": "BRL", "eCurrencyCode": 7, "strSymbol": "R$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": " " }, "BYN": { "strCode": "BYN", "eCurrencyCode": 36, "strSymbol": "Br", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "CAD": { "strCode": "CAD", "eCurrencyCode": 20, "strSymbol": "CDN$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "CHF": { "strCode": "CHF", "eCurrencyCode": 4, "strSymbol": "CHF", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": " " }, "CLP": { "strCode": "CLP", "eCurrencyCode": 25, "strSymbol": "CLP$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": " " }, "CNY": { "strCode": "CNY", "eCurrencyCode": 23, "strSymbol": "¥", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "COP": { "strCode": "COP", "eCurrencyCode": 27, "strSymbol": "COL$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": " " }, "CRC": { "strCode": "CRC", "eCurrencyCode": 40, "strSymbol": "₡", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": "" }, "CZK": { "strCode": "CZK", "eCurrencyCode": 44, "strSymbol": "Kč", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "DKK": { "strCode": "DKK", "eCurrencyCode": 45, "strSymbol": "kr.", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "EUR": { "strCode": "EUR", "eCurrencyCode": 3, "strSymbol": "€", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ",", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": "" }, "GBP": { "strCode": "GBP", "eCurrencyCode": 2, "strSymbol": "£", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "HKD": { "strCode": "HKD", "eCurrencyCode": 29, "strSymbol": "HK$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "HRK": { "strCode": "HRK", "eCurrencyCode": 43, "strSymbol": "kn", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "HUF": { "strCode": "HUF", "eCurrencyCode": 46, "strSymbol": "Ft", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "IDR": { "strCode": "IDR", "eCurrencyCode": 10, "strSymbol": "Rp", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": " " }, "ILS": { "strCode": "ILS", "eCurrencyCode": 35, "strSymbol": "₪", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "INR": { "strCode": "INR", "eCurrencyCode": 24, "strSymbol": "₹", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "JPY": { "strCode": "JPY", "eCurrencyCode": 8, "strSymbol": "¥", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "KRW": { "strCode": "KRW", "eCurrencyCode": 16, "strSymbol": "₩", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "KWD": { "strCode": "KWD", "eCurrencyCode": 38, "strSymbol": "KD", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "KZT": { "strCode": "KZT", "eCurrencyCode": 37, "strSymbol": "₸", "bSymbolIsPrefix": false, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": "" }, "MXN": { "strCode": "MXN", "eCurrencyCode": 19, "strSymbol": "Mex$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "MYR": { "strCode": "MYR", "eCurrencyCode": 11, "strSymbol": "RM", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "NOK": { "strCode": "NOK", "eCurrencyCode": 9, "strSymbol": "kr", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": " " }, "NXP": { "strCode": "NXP", "eCurrencyCode": 9001, "strSymbol": "원", "bSymbolIsPrefix": false, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "NZD": { "strCode": "NZD", "eCurrencyCode": 22, "strSymbol": "NZ$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "PEN": { "strCode": "PEN", "eCurrencyCode": 26, "strSymbol": "S/.", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "PHP": { "strCode": "PHP", "eCurrencyCode": 12, "strSymbol": "P", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "PLN": { "strCode": "PLN", "eCurrencyCode": 6, "strSymbol": "zł", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ",", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": "" }, "QAR": { "strCode": "QAR", "eCurrencyCode": 39, "strSymbol": "QR", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "RMB": { "strCode": "RMB", "eCurrencyCode": 9000, "strSymbol": "刀币", "bSymbolIsPrefix": false, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": "", "strSymbolAndNumberSeparator": " " }, "RON": { "strCode": "RON", "eCurrencyCode": 47, "strSymbol": "lei", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "RUB": { "strCode": "RUB", "eCurrencyCode": 5, "strSymbol": "pуб.", "bSymbolIsPrefix": false, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": "", "strSymbolAndNumberSeparator": " " }, "SAR": { "strCode": "SAR", "eCurrencyCode": 31, "strSymbol": "SR", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "SEK": { "strCode": "SEK", "eCurrencyCode": 33, "strSymbol": "kr", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "SGD": { "strCode": "SGD", "eCurrencyCode": 13, "strSymbol": "S$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "THB": { "strCode": "THB", "eCurrencyCode": 14, "strSymbol": "฿", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "TRY": { "strCode": "TRY", "eCurrencyCode": 17, "strSymbol": "TL", "bSymbolIsPrefix": false, "bWholeUnitsOnly": false, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": " " }, "TWD": { "strCode": "TWD", "eCurrencyCode": 30, "strSymbol": "NT$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": " " }, "UAH": { "strCode": "UAH", "eCurrencyCode": 18, "strSymbol": "₴", "bSymbolIsPrefix": false, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": "" }, "USD": { "strCode": "USD", "eCurrencyCode": 1, "strSymbol": "$", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": ",", "strSymbolAndNumberSeparator": "" }, "UYU": { "strCode": "UYU", "eCurrencyCode": 41, "strSymbol": "$U", "bSymbolIsPrefix": true, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": "" }, "VND": { "strCode": "VND", "eCurrencyCode": 15, "strSymbol": "₫", "bSymbolIsPrefix": false, "bWholeUnitsOnly": true, "strDecimalSymbol": ",", "strThousandsSeparator": ".", "strSymbolAndNumberSeparator": "" }, "ZAR": { "strCode": "ZAR", "eCurrencyCode": 28, "strSymbol": "R", "bSymbolIsPrefix": true, "bWholeUnitsOnly": false, "strDecimalSymbol": ".", "strThousandsSeparator": " ", "strSymbolAndNumberSeparator": " " } }
    var steam_lowest_sell_order_detail = 0;     // 商品详情页专用-steam最低出售价
    var steam_highest_buy_order_detail = 0;     // 商品详情页专用-steam最高求购价
    var helper_config = loadConfig();
    var displayCurrency = g_rgCurrencyData[getDisplayCurrency()];
    var steamCurrency = g_rgCurrencyData[helper_config.steamCurrency];
    var steamConnection = undefined;
    var steamFailedTimes = 0;
    var market_color_high = [];
    var market_color_low = [];
    var itemCount = 0;
    var itemNum = 0;
    var needSort;

    // 设置界面
    GM_addStyle(".helper-setting input[type=number]{max-width:70px}input[type=\"number\"]{-moz-appearance:textfield}.helper-setting-shadow{position:fixed;justify-content:center;align-items:center;display:none;z-index:100;top:0;right:0;bottom:0;left:0;margin:0;background:#00000066}.helper-setting{background:#fff;border-radius:5px;padding:40px 54px;top:25%}.w-Checkbox.helper-setting-option>span:first-child{margin:0!important;font-size:14px}.helper-setting-steamConnection i.icon{margin-left:0!important}.helper-setting .list_tb span,.helper-setting .list_tb i.icon{margin-left:12px}.helper-setting .icon_status_progressing{animation:rotate-L 1.5s linear infinite;-webkit-animation:rotate-L 1.5s linear infinite}");
    $("body").append('<div class="cont_main helper-setting-shadow"><div class="helper-setting"><b>基础设定</b><span id="helper-version" style="float: right;">插件版本：</span><table class="list_tb"><tbody><tr><td class="t_Left c_Gray">STEAM连接性：</td><td class="t_Left helper-setting-steamConnection"><span class="c_Yellow"><i class="icon icon_status_waiting"></i>未知</span></td><td class="t_Right"><a href="javascript:void(0);" id="helper-setting-checkBtn" class="i_Btn i_Btn_small">检测</a></td></tr><tr><td class="t_Left c_Gray" width="120">覆盖排序规则 <i class="icon icon_qa j_tips_handler" data-title="说明：" data-content="开启后使用buff排序（比如当你按价格排序时）比例排序规则重置为默认，不再按比例排序（刷新页面后会恢复保存的规则）" data-direction="right"></i></td><td class="t_Left"><span><div id="helper-setting-stickerSort" class="w-Checkbox helper-setting-option" data-option-target="overrideSortRule" value=""><span value="true"><i class="icon icon_checkbox"></i>启用 </span></div></span></td><td class="t_Right"></td></tr><tr><td class="t_Left c_Gray" width="120">完成后排序 <i class="icon icon_qa j_tips_handler" data-title="说明：" data-content="选择排序时机是否是在所有饰品信息都加载完成后进行排序" data-direction="right"></i></td><td class="t_Left"><span><div id="helper-setting-sortAfterAllDone" class="w-Checkbox helper-setting-option" data-option-target="sortAfterAllDone" value=""><span value="true"><i class="icon icon_checkbox"></i>启用 </span></div></span></td><td class="t_Right"></td></tr><tr><td class="t_Left c_Gray">默认排序规则</td><td class="t_Left"><span><div id="helper-setting-sortRule" class="w-Select helper-setting-option" data-option-target="needSort" style="width: 130px; visibility: visible;"><h3 style="margin:0;font-weight:normal;">不排序</h3><i class="icon icon_drop"></i><ul style="width: 130px;"><li value="null">不排序</li><li value="buff-sort_asc">按buff比例从低到高</li><li value="buff-sort_desc">按buff比例从高到低</li><li value="order-sort_asc">按求购比例从低到高</li><li value="order-sort_desc">按求购比例从高到低</li></ul></div></span></td><td class="t_Right"></td></tr><tr><td class="t_Left c_Gray">steam参考货币 </td><td class="t_Left"><span><div id="helper-setting-currency" class="w-Select helper-setting-option" data-option-target="steamCurrency" style="width: 120px; visibility: visible;"><h3 style="margin:0;font-weight:normal;">默认</h3><i class="icon icon_drop"></i><ul style="width: 120px;height: 200px;overflow: auto;" class="steam-currency-selector"></ul></div></span></td><td class="t_Center"><i class="icon icon_qa j_tips_handler" style="margin-left: 0;" data-title="&lt;p class=&quot;c_Red&quot;&gt;没有特殊需求就不要改&lt;/p&gt;" data-content="选择获取steam数据时使用什么货币，buff价格依旧是人民币，乱改会导致比例错误。默认为CNY（￥）" data-direction="right"></i><span><div id="helper-setting-currencyDisplayMode" class="w-Select helper-setting-option" data-option-target="currencyDisplayMode" style="width: 80px; visibility: visible;"><h3 style="margin:0;font-weight:normal;">默认</h3><i class="icon icon_drop"></i><ul style="width: 80px;"><li value="strCode">缩写</li><li value="strSymbol">符号</li></ul></div></span></td></tr><tr><td class="t_Left c_Gray">请求超时时间 <i class="icon icon_qa j_tips_handler" data-title="关于超时时间：" data-content="默认值为10000（10秒）<br/>如果你可以访问steam市场但是却经常提示你无法连接到steam时，你应该增大这个值。" data-direction="right"></i></td><td class="t_Left" style="position: relative;"><span><input type="number" id="helper-setting-ajaxTimeout" data-option-target="ajaxTimeOut" class="i_Text helper-setting-option" min="1000" max="60000" step="100"></span><span class="c_DGray">ms</span></td><td class="t_Right"></td></tr><tr><td class="t_Left c_Gray">渐变色（市场）</td><td class="t_Center" style="position: relative;"><span class="c_DGray">最小 <input type="color" id="helper-setting-marketColorLow" data-option-target="marketColorLow" class="helper-setting-option"></span><i class="icon icon_qa j_tips_handler" data-title="" data-content="渐变最小值：比例越接近最小值（默认是0.63）会越趋近这个颜色<br/>渐变最大值：比例越接近最大值（默认是1）会越趋近这个颜色" data-direction="bottom"></i></td><td class="t_Center"><span class="c_DGray">最大 <input type="color" id="helper-setting-marketColorHigh" data-option-target="marketColorHigh" class="helper-setting-option"></span></td></tr><tr><td class="t_Left c_Gray">比例极值 </td><td class="t_Center" style="position: relative;"><span class="c_DGray">最小 <input type="number" id="helper-setting-minRange" data-option-target="minRange" class="i_Text helper-setting-option" min="0" max="1" step="0.01"></span><i class="icon icon_qa j_tips_handler" data-title="" data-content="比例最小值：小于等于这个值的比例会直接渲染成最小值渐变色<br/>比例最大值：大于等于这个值的比例会直接渲染成最大值渐变色" data-direction="bottom"></i></td><td class="t_Center"><span class="c_DGray">最大 <input type="number" id="helper-setting-maxRange" data-option-target="maxRange" class="i_Text helper-setting-option" min="1" max="100"></span></td></tr><tr><td class="t_Center" colspan="3"><a href="https://jq.qq.com/?_wv=1027&k=U8mqorxQ">问题反馈QQ群：544144372</a></td></tr></tbody></table></div></div>');
    initCurrency();
    $("#helper-version").text($("#helper-version").text() + GM_info.script.version);
    $("#helper-setting-checkBtn").click(() => { checkSteamConnection() });
    $(".helper-setting-shadow").click(function (e) {
        if (e.target == this) {
            $(this).fadeOut();
        }
    });
    $(".helper-setting").change(function (e) {
        let target = e.target;
        let optionTarget = target.dataset.optionTarget;
        let val = target.getAttribute("value") ? target.getAttribute("value") : target.value;
        helper_config[optionTarget] = val;
        GM_setValue("helper_config", helper_config);
        if (optionTarget == "currencyDisplayMode") {
            initCurrency();
        }
        init();
    });
    GM_registerMenuCommand('打开设置面板', () => {
        openSettingPanel();
    });


    function initCurrency() {
        let list = $(".steam-currency-selector>li");
        if (list.length == 0) {
            for (let key in g_rgCurrencyData) {
                $(".steam-currency-selector").append("<li value=" + g_rgCurrencyData[key].strCode + ">" + g_rgCurrencyData[key][helper_config.currencyDisplayMode] + "</li>");
            }
        } else {
            for (let li of list) {
                let jq = $(li);
                jq.text(g_rgCurrencyData[jq.attr("value")][helper_config.currencyDisplayMode]);
            }
        }
    }

    function syncCurrency() {
        steamCurrency = g_rgCurrencyData[helper_config.steamCurrency];
        $("#helper-setting-currencyDisplayMode").attr("value", helper_config.currencyDisplayMode);
        $("#helper-setting-currencyDisplayMode>h3").text($("#helper-setting-currencyDisplayMode li[value=" + helper_config.currencyDisplayMode + "]").addClass("on").text());
        $("#helper-setting-currency").attr("value", steamCurrency.strCode);
        $("#helper-setting-currency>h3").text($("#helper-setting-currency li[value=" + helper_config.steamCurrency + "]").addClass("on").text());
    }

    function openSettingPanel() {
        updateSteamStatus();
        $(".helper-setting-shadow").css({
            "opacity": 0,
            "display": "flex"
        }).animate({ opacity: '1' }, 300);
    }

    function getDisplayCurrency() {
        let currencyList = { "/¥/": "CNY", "/\\$/": "USD", "/€/": "EUR", "/₽/": "RUB" };
        let text = $(".w-Counter-input").text();
        for (let key in currencyList) {
            if (eval(key).test(text)) {
                return currencyList[key];
            }
        }
    }

    function parseColor() {
        market_color_high = helper_config.marketColorHigh.match(/[0-9a-f]{2}/ig);
        market_color_low = helper_config.marketColorLow.match(/[0-9a-f]{2}/ig);
        for (let i = 2; i >= 0; i--) {
            market_color_high[i] = parseInt(market_color_high[i], 16);
            market_color_low[i] = parseInt(market_color_low[i], 16);
        }
    }

    function failedSteamConnection() {
        if (++steamFailedTimes > (itemNum >> 2)) {
            steamConnection = false;
        }
        console.log("？",steamFailedTimes);
    }

    function updateSteamStatus() {
        if (steamConnection === undefined) {
        } else if (steamConnection) {
            if (!$(".helper-setting-steamConnection>.c_Green").text()) {
                $(".helper-setting-steamConnection").html("<span class=\"c_Green\"><i class=\"icon icon_status_success\"></i>正常</span>");
            }
        } else {
            $(".helper-setting-steamConnection").html("<span class=\"c_DRed\"><i class=\"icon icon_status_failed\"></i>无法连接</span>");
        }
    }

    function sortGoods(sortRule, isAsc) {
        $("#j_list_card>ul>li").sort(function (a, b) {
            let av = $(a).attr(sortRule) - 0;
            let bv = $(b).attr(sortRule) - 0;
            let result = 0;
            if (isAsc) {
                result = av - bv;
            } else {
                result = bv - av;
            }
            return result === NaN ? 0 : result;
        }).appendTo("#j_list_card>ul");
    }

    function loadConfig() {
        let config = GM_getValue("helper_config");
        if (config) {
            return config;
        }
        return {
            maxRange: 1,
            minRange: 0.63,
            needSort: null,
            ajaxTimeOut: 10000,
            // reverseSticker: false,
            overrideSortRule: false,
            sortAfterAllDone: true,
            marketColorLow: "#ff1e1e",
            marketColorHigh: "#5027ff",
            steamCurrency: g_rgCurrencyData["CNY"],
            currencyDisplayMode: "strCode"
        };
    }

    function syncSort() {
        needSort = helper_config.needSort;
        $("#helper-setting-sortRule>h3").text($("#helper-setting-sortRule li[value=" + helper_config.needSort + "]").addClass("on").text());
        $("#helper-sort-text").text($(".buff-helper-sort li[data-value=" + helper_config.needSort + "]").text());
    }

    function init() {
        // if (helper_config.reverseSticker) {
        //     $("#helper-setting-reverseSticker").attr("value", helper_config.reverseSticker).children(":first").addClass("on");
        // }
        if (helper_config.overrideSortRule) {
            $("#helper-setting-stickerSort").attr("value", helper_config.overrideSortRule).children(":first").addClass("on");
        }
        if (helper_config.sortAfterAllDone) {
            $("#helper-setting-sortAfterAllDone").attr("value", helper_config.sortAfterAllDone).children(":first").addClass("on");
        }
        if (helper_config.needSort) {
            syncSort();
        }
        $("#helper-setting-maxRange").val(helper_config.maxRange);
        $("#helper-setting-minRange").val(helper_config.minRange);
        $("#helper-setting-ajaxTimeout").val(helper_config.ajaxTimeOut);
        $("#helper-setting-marketColorLow").val(helper_config.marketColorLow);
        $("#helper-setting-marketColorHigh").val(helper_config.marketColorHigh);
        updateSteamStatus();
        syncCurrency();
        parseColor();
    }

    function addHelperBtn() {
        if ($(".floatbar>ul").length == 0) {
            setTimeout(() => { addHelperBtn(); }, 100);
            return;
        }
        if ($("#buff_tool_nextpage").length != 0) { return; }
        // 设置按钮
        $(".floatbar>ul").prepend("<li><a id='buff_tool_setting'><i class='icon icon_menu_setting'></i><p>设置</p></a></li>");
        $("#buff_tool_setting").click(function () {
            openSettingPanel();
        }).parent().css("cursor", "pointer");
        // 下一页按钮
        $(".floatbar>ul").prepend("<li><a id='buff_tool_nextpage'><i class='icon icon_slide_right2' style='height: 40px;width: 39px;'></i><p>下一页</p></a></li>");
        $("#buff_tool_nextpage").click(function () {
            $(".page-link.next").click();
            $("#sort_scale").removeClass();
        }).parent().css("cursor", "pointer");
    }

    function checkSteamConnection() {
        $(".helper-setting-steamConnection").html("<span class=\"c_Blue\"><i class=\"icon icon_status_progressing\"></i>检测中</span>");
        $("#helper-setting-checkBtn").css("visibility", "hidden");
        let startTime = new Date().getTime();
        let endTime = 0;
        steamConnection = undefined;
        GM_xmlhttpRequest({
            url: "https://steamcommunity.com/market/",
            method: "get",
            timeout: helper_config.ajaxTimeOut,
            onload: function (res) {
                if (res && res.status == 200) {
                    endTime = new Date().getTime();
                    changeSteamStatus(true);
                } else {
                    console.log("检测steam连接性出错：状态错误", res);
                    changeSteamStatus(false);
                }
            },
            onerror: function (err) {
                console.log("检测steam连接性出错：连接错误", err);
                changeSteamStatus(false);
            },
            ontimeout: function () {
                console.log("检测steam连接性出错：尝试超时");
                changeSteamStatus(false);
            }
        });

        function changeSteamStatus(status) {
            steamConnection = status;
            if (status) {
                $(".helper-setting-steamConnection").html("<span class=\"c_Green\"><i class=\"icon icon_status_success\"></i>正常</span><span class=\"c_DGray f_12px\">" + (endTime - startTime) + "ms</span>");
            } else {
                $(".helper-setting-steamConnection").html("<span class=\"c_DRed\"><i class=\"icon icon_status_failed\"></i>无法连接</span>");
            }
            $("#helper-setting-checkBtn").css("visibility", "visible");
        }
    }


    // 保留2位小数
    function roundToTwo(num) {
        return Math.round(num * 100) / 100;
    }

    function getWithoutFeePrice(originPrice) {
        return roundToTwo(originPrice / 1.15);
    }

    function getScale(originPrice, withFeePrice) {
        return roundToTwo(originPrice / (withFeePrice / 1.15));
    }

    function gradient(max, min, f) {
        if (f == "∞") { return max; }
        if (f >= helper_config.maxRange || f <= helper_config.minRange) {
            f = f >= helper_config.maxRange ? 1 : 0;
        } else {
            f = (f - helper_config.minRange) / (helper_config.maxRange - helper_config.minRange);
        }
        return max >= min ? f * (max - min) + min : (1 - f) * (min - max) + max;
    }

    function getUrlParam(name, url) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        let result;
        if (url) {
            result = url.substr(34).match(reg);  //匹配目标参数
        } else {
            result = window.location.search.substr(1).match(reg);  //匹配目标参数
        }
        if (result != null) return unescape(result[2]); return null; //返回参数值
    }

    function updateProgressBar(ID, progress, option) {
        let bar = $("#helper-progress-bar-" + ID);
        if (!progress && !option) {
            bar.width(++itemCount / itemNum * 100 + "%")
        } else {
            let widthP = Math.round(bar.width() / document.body.clientWidth * 100);
            switch (option) {
                case "set":
                    bar.width(progress + "%");
                    break;
                default:
                case "add":
                    itemCount++;
                    widthP += progress;
                    bar.width(widthP + "%");
                    break;
                case "sub":
                    itemCount--;
                    widthP -= progress;
                    bar.width(widthP < 0 ? 0 : widthP + "%");
                    break;
            }
        }
        if (itemCount >= itemNum) {
            itemCount = 0;
            $("#helper-loading-" + ID).remove();
            bar.fadeOut(500);
        }
    }

    function paintingGradient(scale, target, position, targetTemplate) {
        let template;
        if (targetTemplate) {
            template = targetTemplate;
        } else {
            template = '<strong class="f_Strong price_scale" style="float: right;"></strong>';
        }
        let red = gradient(market_color_high[0], market_color_low[0], scale);
        let green = gradient(market_color_high[1], market_color_low[1], scale);
        let blue = gradient(market_color_high[2], market_color_low[2], scale);
        switch (position) {
            case 1:
                $(target).before($(template).css("color", "rgb(" + red + "," + green + "," + blue + ")").text(scale));
                break;
            case 2:
                $(target).prepend($(template).css("color", "rgb(" + red + "," + green + "," + blue + ")").text(scale));
                break;
            case 3:
                $(target).append($(template).css("color", "rgb(" + red + "," + green + "," + blue + ")").text(scale));
                break;
            case 4:
                $(target).after($(template).css("color", "rgb(" + red + "," + green + "," + blue + ")").text(scale));
                break;
            default:
                $(target).append($(template).css("color", "rgb(" + red + "," + green + "," + blue + ")").text(scale));
        }
    }

    function getItemId(buff_item_id, steamLink) {
        return new Promise(function (resolve, reject) {
            let steam_item_id = GM_getValue(buff_item_id);
            if (steam_item_id) {
                resolve(steam_item_id);
                return;
            } else if (steam_item_id === null) {
                reject({ status: 404, statusText: "物品不在货架上" });
            }
            GM_xmlhttpRequest({
                url: steamLink,
                method: "get",
                timeout: helper_config.ajaxTimeOut,
                onload: function (res) {
                    if (res.status == 200) {
                        let html = res.response;
                        try {
                            steam_item_id = html.match(/(?<=Market_LoadOrderSpread\(\s)\d+(?=\s\);)/)[0];
                        } catch (error) {
                            steamConnection = true;
                            GM_setValue(buff_item_id, null);
                            res.status = 404;
                            res.statusText = "物品不在货架上";
                            console.log("获取itemID状态异常：", res);
                            reject(res);
                            return;
                        }
                        GM_setValue(buff_item_id, steam_item_id);
                        resolve(steam_item_id);
                    } else {
                        console.log("获取itemID状态异常：", res);
                        reject(res);
                    }
                },
                onerror: function (err) {
                    console.log("获取itemID错误：", err);
                    reject(err);
                },
                ontimeout: function () {
                    failedSteamConnection();
                    let err = { "status": 408, "statusText": "无法访问steam" };
                    console.log("获取itemID超时：", err);
                    reject(err);
                }
            });
        });
    }

    function getSteamOrderList(buff_item_id, steamLink) {
        return new Promise(function (resolve, reject) {
            if (!steamConnection && steamConnection != undefined) {
                let err = { "status": 408, "statusText": "无法访问steam" };
                reject(err);
                return;
            }
            getItemId(buff_item_id, steamLink).then(function onFulfilled(steam_item_id) {
                GM_xmlhttpRequest({
                    url: window.location.protocol + "//steamcommunity.com/market/itemordershistogram?country=CN&language=schinese&currency=" + steamCurrency.eCurrencyCode + "&item_nameid=" + steam_item_id + "&two_factor=0",
                    method: "get",
                    timeout: helper_config.ajaxTimeOut,
                    onload: function (res) {
                        if (res.status == 200) {
                            steamConnection = true;
                            resolve(JSON.parse(res.response));
                        } else {
                            console.log("访问steamorder状态异常：", res);
                            reject(res);
                        }
                    },
                    onerror: function (err) {
                        console.log("访问steamorder列表出错：", err);
                        reject(err);
                    },
                    ontimeout: function () {
                        failedSteamConnection();
                        let err = { "status": 408, "statusText": "无法访问steam" };
                        console.log("访问steamorder列表超时：", err);
                        reject(err);
                    }
                });
            }).catch(function onRejected(err) {
                reject(err);
            });
        });
    }

    function getProtectionRules(currencyCode) {
        switch (currencyCode) {
            case 1:             // 美元
            case 3:             // 欧元
            case 23:            // 人民币
                break;
            case 5:             // 卢布
                break;
        }
    }

    function marketListLoadData(item, good, randomID, secendTry) {
        let target = $(good).find("p>strong.f_Strong")[0];
        let error = false;
        let buff_item_id = item.id;                                 // buff商品ID
        let buff_buy_num = item.buy_num;                            // buff求购数量
        let buff_buy_max_price = item.buy_max_price;                // buff求购最高价
        let buff_sell_num = item.quick_price;                       // buff出售数量
        let buff_sell_min_price = item.sell_min_price;              // buff出售最低价
        let steam_price_cny = item.goods_info.steam_price_cny;      // buff提供的steam国区售价
        let steam_market_url = item.steam_market_url;               // steam市场链接
        let buff_sell_reference_price = item.sell_reference_price;  // buff出售参考价(没卵用)
        let steam_highest_buy_order = 0;                                // steam最高求购价
        let steam_lowest_sell_order = 0;                                // steam最低出售价
        $(good).attr("data-order-sort", Infinity);
        getSteamOrderList(buff_item_id, steam_market_url, secendTry).then(function onFulfilled(json) {
            steam_highest_buy_order = json.highest_buy_order / 100;
            steam_lowest_sell_order = json.lowest_sell_order / 100;
            let orderNumber = $(json.buy_order_summary)[0].innerText;
            let steamOrderScale = getScale(buff_sell_min_price, steam_highest_buy_order);
            $(good).attr("data-order-sort", steamOrderScale);
            $(target).after($(steanOrderNumberTemp).text(orderNumber + "┊"));
            paintingGradient(steamOrderScale, target, 4, steanOrderScaleTemp);
        }).catch(function onRejected(err) {
            switch (err.status) {
                case 429:
                    steamConnection = true;
                    err.statusText = "请求次数过多";
                    break;
                case 500:
                    if (!secendTry) {
                        console.log("自动重试状态异常项目");
                        error = true;
                        return;
                    }
                    err.statusText = "内部服务器错误";
                    break;
                case 0:
                    failedSteamConnection();
                    err.statusText = "无法访问steam";
                    break;
            }
            $(target).after($(steanOrderNumberErrorTemp).text(err.statusText));
        }).finally(() => {
            if (error) {
                marketListLoadData(item, good, randomID, true);
                return;
            }
            let lowest_sell_price = steam_lowest_sell_order ? steam_lowest_sell_order : steam_price_cny;
            let withoutFeePrice = getWithoutFeePrice(lowest_sell_price);
            let scale = getScale(buff_sell_min_price, lowest_sell_price);
            $(good).attr("data-buff-sort", scale);
            if (withoutFeePrice > 10000 || buff_sell_min_price > 10000) {  // 防止价格太长换行
                withoutFeePrice = Math.round(withoutFeePrice);
                scale = scale > 10 ? Math.round(scale) : Math.round(scale * 10) / 10;
            }
            if (scale === Infinity) {
                withoutFeePrice = "";
                scale = "∞";
            }
            if(displayCurrency.eCurrencyCode!=5){
                $(target).append($("<span class=\"f_12px f_Bold c_Gray\"></span>").css("margin-left", "5px").text(withoutFeePrice));
            }
            paintingGradient(scale, target, 3);
            if (needSort && (helper_config.sortAfterAllDone ? itemCount == itemNum - 1 : true)) {
                let arr = needSort.split("_");
                sortGoods("data-" + arr[0], arr[1] == "asc");
            }
            updateProgressBar(randomID);
        });
    }

    // 商品详情
    window.buff_csgo_goods_scale_plugin_load = function (data) {
        // 检测商品是否加载完成
        if ($("#market-selling-list").length == 0) {
            setTimeout(buff_csgo_goods_scale_plugin_load, 100);
            return;
        }
        if ($("#market-selling-list").hasClass("calculated") || data.total_count == 0) { return; }
        $(".detail-cont").append("<i class=\"icon icon_uploading helper-loading\" style='margin: 5px;'></i>");
        let price_list = $(".f_Strong");
        let isLogined = $("#navbar-cash-amount").length == 1;
        let isFirstTime = $(".good_scale").length == 0;
        let steamLink = document.getElementsByClassName("detail-summ")[0].lastElementChild.href;
        let buff_item_id = getUrlParam("goods_id");
        let items = data.items;
        let steam_price_cny = data.goods_infos[buff_item_id].steam_price_cny;
        let steam_price_without_fee = 0;            // steam卖出实收      
        steamFailedTimes = items.length;
        let pm = new Promise(function (resolve, reject) {
            if (isFirstTime) {
                getSteamOrderList(buff_item_id, steamLink).then(function onFulfilled(json) {
                    steam_highest_buy_order_detail = json.highest_buy_order / 100;
                    steam_lowest_sell_order_detail = json.lowest_sell_order / 100;
                    $(".detail-cont").append("<div id='steam_order'>" + json.buy_order_summary + "</div>");
                }).catch(function onRejected(err) {
                    switch (err.status) {
                        case 429:
                            steamConnection = true;
                            err.statusText = "请求次数过多";
                            break;
                        case 500:
                            err.statusText = "内部服务器错误，请稍后重试";
                            break;
                        case 0:
                            failedSteamConnection();
                        case 408:
                            err.statusText = "访问steam超时，请检查steam市场连接性";
                            break;
                    }
                    $(".detail-cont").append("<div id='steam_order_error'>" + err.statusText + "</div>");
                }).finally(() => {
                    resolve();
                });
            } else {
                reject();
            }
        });
        pm.catch(e => { }).finally(function onFulfilled() {
            $(".helper-loading").remove();
            $(".list_tb_csgo>tr>th:nth-child(5)").after('<th style="width: 45px;" class="t_Left"><span>比例<i class="icon icon_order"></i></span></th>');
            steam_price_without_fee = getWithoutFeePrice(steam_lowest_sell_order_detail ? steam_lowest_sell_order_detail : steam_price_cny);
            for (let i = 0; i < items.length; i++) {
                let buff_sell_price = items[i].price;
                let scale = roundToTwo(buff_sell_price / steam_price_without_fee);
                if (scale === Infinity) {
                    scale = "∞";
                }
                if (!i) {
                    $(".f_Strong .hide-usd")[0].innerText = steam_price_without_fee;
                    let color;
                    switch (true) {
                        case scale > 0.9: color = "#a0ffc5"; break;
                        case scale > 0.8: color = "#b8ff8a"; break;
                        case scale > 0.74: color = "#fff054"; break;
                        case scale > 0.67: color = "#ff7e15"; break;
                        default: color = "#ff0049"; break;
                    }
                    if (isFirstTime) {
                        $(".detail-summ>a").prop("href", $(".detail-summ>a").prop("href") + "?buffPrice=" + buff_sell_price);
                        $(".market_commodity_orders_header_promote:last").after("<small class='market_listing_price_with_fee'>" + getScale(buff_sell_price, steam_highest_buy_order_detail) + "</small>");
                        $(price_list[isLogined ? 1 : 0]).append($("<big class='good_scale' style='color: " + color + ";margin-left: 6px'>" + scale + "</big>"));
                    } else {
                        $(".detail-summ>a").prop("href", $(".detail-summ>a").prop("href").replace(/\d{0,6}[.]?\d{0,2}$/, buff_sell_price));
                        $(".good_scale").text(scale).css("color", color);
                        $(".market_listing_price_with_fee").text(getScale(buff_sell_price, steam_highest_buy_order_detail));
                    }
                }
                if (scale > 10) {  // 防止价格太长换行
                    scale = scale > 100 ? Math.round(scale) : Math.round(scale * 10) / 10;
                }
                $(price_list[i + (isLogined ? 2 : 1)]).parents("td").after('<td class="t_Left"><div style="display: table-cell;"><b class="seller_scale">' + scale + '</b></div></td>');
            }
            $("#market-selling-list").addClass("calculated");
        });
    }

    // 市场目录
    window.buff_csgo_list_scale_plugin_load = function (items) {
        // 检测商品是否加载完成
        if ($("#j_list_card>ul>li").length == 0) {
            setTimeout(buff_csgo_list_scale_plugin_load, 100);
            return;
        }
        if ($("#j_list_card").hasClass("calculated")) { return; }
        $(".list_card li>p>span.l_Right").removeClass("l_Right").addClass("l_Left");
        let randomID = Math.round(Math.random() * 1000);
        let goods = $("#j_list_card>ul>li");
        itemNum = items.length;
        // 添加进度条
        $(".tab>li.on").append("<i id=helper-loading-" + randomID + " class=\"icon icon_uploading helper-loading\"></i>");
        $(".market-list .blank20").prepend('<div id=helper-progress-bar-' + randomID + ' class="helper-progress-bar"></div>');
        for (let i = 0; i < goods.length; i++) {
            $(goods[i]).attr("data-default-sort", i);
            marketListLoadData(items[i], goods[i], randomID);
        }
        $("#j_list_card").addClass("calculated");
    }

    if (location.pathname === "/market/goods") {
        GM_addStyle(".icon_payment_alipay{background-position:-417px -331px}.icon_payment_others{background-position:-510px 0}.market_commodity_orders_header_promote {color: whitesmoke;}#steam_order{margin-top:5px}#steam_order_error{margin-top:5px;font-size: medium;font-weight: bold;color: #ff1e3e;}.market_listing_price_with_fee{color: #d4b527;font-size: 12px;margin-left: 6px;}");
        $(document).ajaxSuccess(function (event, status, header, result) {
            if (header.url.startsWith("/api/market/goods/sell_order") && result.data) {
                steamFailedTimes = 0;
                // 批量购买（未完成）
                // if ($("#helper-bulk-buy").length == 0) {
                //     $("#batch-buy-btn").after($('<a href="javascript:" class="i_Btn i_Btn_mid" id="helper-bulk-buy">批量购买</a>'));
                // }
                buff_csgo_goods_scale_plugin_load(result.data);
            }
        });
    } else if (location.pathname === "/market/") {
        // 样式
        GM_addStyle("#sort_scale{display:inline-block;padding:0 6px 0 16px;cursor:pointer;height:32px;margin-left:5px;line-height:32px;text-align:center;border-radius:4px;min-width:60px;border:1px solid #45536c;color:#63779b;vertical-align:middle}#sort_scale.enabled{background:#45536c;color:#fff}.list_card li h3{margin: 8px 12px 9px;}.list_card li>p>span.l_Left{margin-top:inherit}.list_card li>p>strong.f_Strong{display:block;font-size:20px;min-height:20px;}");
        GM_addStyle(".helper-loading{position:absolute;margin:11px}.helper-progress-bar{height:20px;background:linear-gradient(90deg,rgb(22 122 193 / 70%) 0,rgb(51 177 159 / 50%) 70%,transparent);width:0;z-index:1000}");
        // 翻页和设置按钮
        addHelperBtn();
        // 排序按钮
        $(".block-header>.l_Right").append($('<div class="w-Select-Multi w-Select-scroll buff-helper-sort" style="visibility: visible; width: 140px;"><h3 id="helper-sort-text">比例排序</h3><i class="icon icon_drop"></i><ul style="width: 140px;"><li data-value="null">默认</li><li data-value="buff-sort_asc"><span class="w-Order_asc">buff比例从低到高<i class="icon icon_order"></i></span></li><li data-value="buff-sort_desc"><span class="w-Order_des">buff比例从高到低<i class="icon icon_order"></i></span></li><li data-value="order-sort_asc"><span class="w-Order_asc">求购比例从低到高<i class="icon icon_order"></i></span></li><li data-value="order-sort_desc"><span class="w-Order_des">求购比例从高到低<i class="icon icon_order"></i></span></li></ul></div>'));
        var sortBtnTimeout;
        $(".buff-helper-sort").click(function () {
            $(this).addClass("on");
            clearTimeout(sortBtnTimeout);
        }).mouseleave(function () {
            let t = $(this);
            if (t.hasClass("on")) {
                sortBtnTimeout = setTimeout(() => t.removeClass("on"), 300);
            }
        });
        $(".buff-helper-sort li").click(function (e) {
            e.stopPropagation();
            needSort = this.dataset.value;
            if (this.dataset.value == "null") {
                $("#helper-sort-text").text("比例排序");
                sortGoods("data-default-sort", true);
            } else {
                $("#helper-sort-text").text(this.innerText);
                let arr = this.dataset.value.split("_");
                sortGoods("data-" + arr[0], arr[1] == "asc");
            }
            $(".buff-helper-sort").removeClass("on");
        });
        // 设置初始化
        init();
        setTimeout(() => {
            // 修改buff排序时重置比例排序规则
            $("div[name='sort_by']").change(function () {
                if (helper_config.overrideSortRule && this.getAttribute("value")) {
                    needSort = this.dataset.value;
                    $("#helper-sort-text").text("默认");
                }
            });
        }, 500);
        $(document).ajaxSend(function (event, status, header, result) {
            if (header.url.startsWith("/api/market/goods")) {
                $(".helper-progress-bar").remove();
                $(".helper-loading").remove();
            }
        });
        $(document).ajaxSuccess(function (event, status, header, result) {
            if (header.url.startsWith("/api/market/goods") && result.data.items) {
                steamFailedTimes = 0;
                buff_csgo_list_scale_plugin_load(result.data.items);
            }
        });
    }

})();