var flour = flour || {};




flour.util = {
    id: 0,
};



/*
|
|
|
*/
flour.util.generateId = function()
{
    flour.util.id ++;
    return flour.util.id;
};



/*
|
|   Throws a flour console error
|
*/
flour.util.throw = function(error)
{
    console.error.apply(this, arguments);
};

flour.util.warn = function(error)
{
    console.warn.apply(this, arguments);
};



/*
|
|   Push location/history state
|
*/
flour.util.pushLocation = function(url)
{
    var state = {};

    state.id = flour.util.generateId();
    state.url = url;

    history.pushState(state, null, url);
    flour.publish('history:state_change', state);
}



/* 
|
|   Event delegation method
|
*/
flour.util.delegateEvent = function(el, eventType, selector, handler, useCapture)
{
    if(typeof useCapture === 'undefined') 
    {
        useCapture = false;
    }

    el.addEventListener(eventType, function(event) 
    {
        var t = event.target;
        while (t && t.matches && t !== this) 
        {
            if (t.matches(selector)) 
            {
                handler(t, event);
                break;
            }

            t = t.parentNode;
        }
    }, useCapture);
};



/* 
|
|   Simple clone object
|
*/
flour.util.cloneObject = function(obj)
{
    let clone = Object.assign({}, obj);
    
    Object.keys(clone).forEach(
        key => (clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
    );

    return Array.isArray(obj) ? (clone.length = obj.length) && Array.from(clone) : clone;
}



/*
|
|   Defer
|
*/
flour.util.defer = function(callback)
{
    setTimeout(function()
    {
        callback();
    }, 0);
};





/*
|
|   Returns true if passed param is an object, else false
|
*/
flour.util.isObject = function(obj)
{
    return (typeof obj == "object") && (obj !== null);
};



/*
|
|   Returns true if passed param is an array, else false
|
*/
flour.util.isArray = function(arr)
{
    return Array.isArray(arr);
};




/*
|
|   Returns true if passed param is an object, else false
|
*/
flour.util.isFunction = function(func) 
{
    return typeof func === 'function';
};



/*
|
|   Returns true is passed param is a string, else false
|
*/
flour.util.isString = function(str)
{
    return (typeof str == 'string' || str instanceof String);
};



/*
|
| This is from https://github.com/AsyncBanana/microdiff
| with a small modification
|
*/
flour.util.diff = function(obj, newObj, options, _stack)
{
    let diffs = [];
    const richTypes = { Date: true, RegExp: true, String: true, Number: true };
    options = options || {};
    const isObjArray = Array.isArray(obj);

    if(!obj){
        obj = {};
    }

    for (const key in obj) 
    {
        const objKey = obj[key];
        const path = isObjArray ? +key : key;
        
        if (!(key in newObj)) 
        {
            diffs.push({
                type: "REMOVE",
                path: [path],
                oldValue: obj[key],
            });
            continue;
        }

        const newObjKey = newObj[key];
        const areObjects = typeof objKey === "object" && typeof newObjKey === "object";
        
        if (objKey && newObjKey && areObjects && !richTypes[Object.getPrototypeOf(objKey).constructor.name] && (!options.cyclesFix || !_stack.includes(objKey))) 
        {
            if(options.shallow === true)
            {
                diffs.push({
                    path: [path],
                    type: "CHANGE",
                    value: newObjKey,
                    oldValue: objKey,
                });
            }
            else
            {
                const nestedDiffs = diff(
                    objKey,
                    newObjKey,
                    options,
                    options.cyclesFix ? _stack.concat([objKey]) : []
                );

                diffs.push.apply(
                    diffs,
                    nestedDiffs.map((difference) => {
                        difference.path.unshift(path);
                        return difference;
                    })
                );
            }
            
        } 
        else if (objKey !== newObjKey && !(areObjects && (isNaN(objKey) ? objKey + "" === newObjKey + "" : +objKey === +newObjKey))) 
        {
            diffs.push({
                path: [path],
                type: "CHANGE",
                value: newObjKey,
                oldValue: objKey,
            });
        }
    }

    const isNewObjArray = Array.isArray(newObj);

    for (const key in newObj) 
    {
        if (!(key in obj)) 
        {
            diffs.push({
                type: "CREATE",
                path: [isNewObjArray ? +key : key],
                value: newObj[key],
            });
        }
    }

    return diffs;
}