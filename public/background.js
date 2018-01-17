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
        }
    }
    
);