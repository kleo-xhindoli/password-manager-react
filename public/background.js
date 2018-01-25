var state = {};
var master = null;

chrome.storage.local.get('master', (res) => {
    if (res.master) {
        state.isSetMaster = true;
    }
})

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        switch(request.action) {
            case 'GET_STATE':
                sendResponse(state);
                break;
            case 'SET_STATE':
                Object.keys(request.params).forEach((key) => {
                    state[key] = request.params[key];
                })
                console.log(state);
                sendResponse(state);
                break;
            case 'SET_MASTER':
                master = request.value
                sendResponse(master);
                break;
            case 'GET_MASTER':
                sendResponse(master);
                break;
            case 'GET_CURRENT_DOMAIN':
                chrome.tabs.getSelected(null, (tab) => {
                    const domain = _getDomainFromUrl(tab.url);
                    sendResponse(domain);
                });
                return true; //needed to let chrome know that the message will be sent async
        }
    }
    
);


function _getDomainFromUrl(url) {
    let domain = '';
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove "?"
    domain = domain.split('?')[0];

    return domain;
}
