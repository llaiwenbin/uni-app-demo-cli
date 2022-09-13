/**
 * 检查url参数，
 * @param {Array} requiredList
 * @param {Object} params
 * @param {string} url
 */
export const checkUrlParamsErrorLog = (requiredList, params, url = '') => {
    const inList = Object.keys(params);
    const missList = [];

    for (let i = 0, len = requiredList.length; i < len; i++) {
        if (!inList.includes(requiredList[i])) {
            missList.push(requiredList[i]);
        }
    }
    if (missList.length) {
        // eslint-disable-next-line no-console
        console.error(`跳转${url}页面时缺少参数:${missList.join('，')}`);
    }
};

/**
 * 格式化URL参数
 * @param {string} url
 * @param {Object} params
 * @return {string}
 */
export const formatParams = (url, params) => {
    if (!params) {
        return url;
    }
    const ps = [];
    for (const key of Object.keys(params)) {
        ps.push(`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    }
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + ps.join('&');
};

/**
 * 跳转公用方法
 * @param {string} url
 * @param {object} params
 * @param method
 * @param suc_callback
 * @param fail_callback
 * @return {string|undefined}
 */
export function xeJump({ url, params = {}, method = 'navigateTo', tarbar_pageurl = [], suc_callback, fail_callback }) {
    if (!url) {
        return;
    }
    let newUrl = url;
    if (url[0] === '/') {
        /* 过滤首位的/ */
        newUrl = url.substring(1);
    }
    const pathname = newUrl.split('?')[0];
    const tabBarUrl = tarbar_pageurl; /* Tab页中的路径 */
    // eslint-disable-next-line no-undef
    const page = getCurrentPages();
    const index = page.findIndex(item => item.route === pathname); //页面栈存在当前页

    if (tabBarUrl.includes(pathname)) {
        const jumpMethods = method !== 'navigateTo' ? method : 'switchTab'
        uni[jumpMethods]({
            url: formatParams(url, params),
            success: () => {
                suc_callback && suc_callback();
            },
            fail: () => {
                fail_callback && fail_callback()
            }
        });
        return;
    }
    if (index !== -1) { /* 在页面栈中找到时 */
        const step = page.length - 1 - index;
        const prevPage = page[index];
        prevPage.onShow({
            init: true,
            ...params
        })
        if (step === 0) {
            uni.redirectTo({
                url: formatParams(url, params),
                success: () => {
                    suc_callback && suc_callback()
                }
            })
        } else {

            uni.navigateBack({ delta: step })
        }
        return;
    }
    // eslint-disable-next-line no-magic-numbers
    if (page.length === 10) {
        // 达到页栈最大限制10,改为重定向
        uni.redirectTo({
            url: formatParams(url, params),
            success: () => {
                suc_callback && suc_callback();
            },
            fail: () => {
                fail_callback && fail_callback()
            }
        });
    } else {
        uni[method]({
            url: formatParams(url, params),
            success: () => {
                suc_callback && suc_callback();
            },
            fail: () => {
                fail_callback && fail_callback()
            }
        });
    }
}

