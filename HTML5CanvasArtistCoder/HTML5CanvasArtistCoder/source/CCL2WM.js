var ccl2canvases = [];
var ccl2errors = [];
var uniquenessFail = 1;

function getAllPropsFromObjectClonedInNewObject(o) {
    let props = {};
    for (let prop in o) {
        props[prop] = o[prop];
    }
    return props;
}

function getClonedObjectPropertiesByFindingWithID(id) {
    for (let i = 0; i < ccl2canvases.length; i++) {
        if (ccl2canvases[i].StringCanvasID === id) {
            return getAllPropsFromObjectClonedInNewObject(ccl2canvases[i]);
        }
        for (let j = 0; j < ccl2canvases[i].ArrayWindows.length; j++) {
            if (ccl2canvases[i].ArrayWindows[j].StringWindowID === id) {
                return getAllPropsFromObjectClonedInNewObject(ccl2canvases[i].ArrayWindows[j]);
            }
        }
    }
}

function getPosition(el) {
    let xPos = 0;
    let yPos = 0;

    while (el) {
        if (el.tagName === "BODY") {
            let xScroll = el.scrollLeft || document.documentElement.scrollLeft;
            let yScroll = el.scrollTop || document.documentElement.scrollTop;

            xPos += (el.offsetLeft - xScroll + el.clientLeft);
            yPos += (el.offsetTop - yScroll + el.clientTop);
        } else {
            xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            yPos += (el.offsetTop - el.scrollTop + el.clientTop);
        }

        el = el.offsetParent;
    }
    return {
        x: xPos,
        y: yPos
    };
};

window.addEventListener("scroll", updatePosition, false);

window.addEventListener("resize", updatePosition, false);

window.onclick = function (e) {
    GenericMouseEvent(e, 'CCL2CanvasOnClick');
};

window.onmouseup = function (e) {
    GenericMouseEvent(e, 'CCL2CanvasOnMouseUp');
};

window.onmousedown = function (e) {
    GenericMouseEvent(e, 'CCL2CanvasOnMouseDown');
};

window.onmousemove = function (e) {
    GenericMouseEvent(e, 'CCL2CanvasOnMouseMove');
};

window.ondblclick = function (e) {
    GenericMouseEvent(e, 'CCL2CanvasOnDoubleClick');
};

window.oncontextmenu = function (e) {
    e.preventDefault();
    GenericMouseEvent(e, 'CCL2CanvasOnContextMenu');
    return false;
}

function GenericMouseEvent(e, invokeEventFunctionName) {
    for (let i = 0; i < ccl2canvases.length; i++) {
        if (e.pageX >= ccl2canvases[i].IntX && e.pageX <= ccl2canvases[i].IntX + ccl2canvases[i].IntWidth &&
            e.pageY >= ccl2canvases[i].IntY && e.pageY <= ccl2canvases[i].IntY + ccl2canvases[i].IntHeight) {
            ccl2canvases[i][invokeEventFunctionName](e.pageX - ccl2canvases[i].IntX, e.pageY - ccl2canvases[i].IntY);
        }
    }
};

function updatePosition() {
    for (let i = 0; i < ccl2canvases.length; i++) {
        let position = getPosition(ccl2canvases[i].CCL2Canvas);
        ccl2canvases[i].IntX = position.x;
        ccl2canvases[i].IntY = position.y;
    }
};

var InvalidateAllCanvasesFully = function () {
    for (let i = 0; i < ccl2canvases.length; i++) {
        if (ccl2canvases[i] instanceof ccl2canvas) {
            ccl2canvases[i].InvalidateFullCanvas();
        } else {
            ccl2errors.push('There is a non canvas type in canvases array.');
        }
    }
};

function InvalidateAllCanvasesByWindowRect(x, y, width, height) {
    for (let i = 0; i < ccl2canvases.length; i++) {
        if(ccl2canvases[i].IntX < x + width && ccl2canvases[i].IntX + ccl2canvases[i].IntWidth > x &&
            ccl2canvases[i].IntY < y + height && ccl2canvases[i].IntY + ccl2canvases[i].IntHeight > y) {
            if(ccl2canvases[i].IntX + ccl2canvases[i].IntWidth > x + width) {
                if(ccl2canvases[i].IntY + ccl2canvases[i].IntHeight > y + height) {
                    ccl2canvases[i].InvalidateCanvasByRect(0, 0, x + width - ccl2canvases[i].IntX, y + height - ccl2canvases[i].IntY);
                } else if(ccl2canvases[i].IntY + ccl2canvases[i].IntHeight < y + height) {
                    ccl2canvases[i].InvalidateCanvasByRect(0, y > ccl2canvases[i].IntY ? y - ccl2canvases[i].IntY : 0, 
                        x + width - ccl2canvases[i].IntX, ccl2canvases[i].IntY + ccl2canvases[i].IntHeight - y);
                } else {
                    ccl2canvases[i].InvalidateCanvasByRect(0, 0, x + width - ccl2canvases[i].IntX, ccl2canvases[i].IntHeight);
                }
            } else if(ccl2canvases[i].IntX + ccl2canvases[i].IntWidth < x + width) {
                if(ccl2canvases[i].IntY + ccl2canvases[i].IntHeight > y + height) {
                    ccl2canvases[i].InvalidateCanvasByRect(x > ccl2canvases[i].IntX ? x - ccl2canvases[i].IntX : 0, 0,
                        ccl2canvases[i].IntX + ccl2canvases[i].IntWidth - x, y + height - ccl2canvases[i].IntY);
                } else if(ccl2canvases[i].IntY + ccl2canvases[i].IntHeight < y + height) {
                    ccl2canvases[i].InvalidateCanvasByRect(x > ccl2canvases[i].IntX ? x - ccl2canvases[i].IntX : 0,
                        y > ccl2canvases[i].IntY ? y - ccl2canvases[i].IntY : 0, 
                        ccl2canvases[i].IntX + ccl2canvases[i].IntWidth - x, ccl2canvases[i].IntY + ccl2canvases[i].IntHeight - y);
                } else {
                    ccl2canvases[i].InvalidateCanvasByRect(x > ccl2canvases[i].IntX ? x - ccl2canvases[i].IntX : 0,
                        0, ccl2canvases[i].IntX + ccl2canvases[i].IntWidth - x, ccl2canvases[i].IntHeight);
                }
            } else {
                if(ccl2canvases[i].IntY + ccl2canvases[i].IntHeight > y + height) {
                    ccl2canvases[i].InvalidateCanvasByRect(0, 0, ccl2canvases[i].IntWidth, y + height - ccl2canvases[i].IntY);
                } else if(ccl2canvases[i].IntY + ccl2canvases[i].IntHeight < y + height) {
                    ccl2canvases[i].InvalidateCanvasByRect(0, y > ccl2canvases[i].IntY ? y - ccl2canvases[i].IntY : 0, 
                        ccl2canvases[i].IntWidth, ccl2canvases[i].IntY + ccl2canvases[i].IntHeight - y);
                } else {
                    ccl2canvases[i].InvalidateCanvasByRect(0, 0, ccl2canvases[i].IntWidth, ccl2canvases[i].IntHeight);
                }
            }
        }
    }
};

var ccl2canvas = function (intWidth, intHeight, boolFillBrowserClientWindowArea) {
    this.StringCanvasID = null;
    this.CCL2Canvas = null;
    this.Context = null;
    this.IntX = 0;
    this.IntY = 0;
    this.IntWidth = intWidth;
    this.IntHeight = intHeight;
    this.ArrayWindows = [];
    this.BoolFillBrowserClientWindowArea = boolFillBrowserClientWindowArea;
    this.Errors = [];
};

ccl2canvas.prototype.CreateCCL2CanvasWithJson = function (o) {
    let c = new ccl2canvas();
    for (let prop in c) {
        if (prop != 'StringCanvasID' && o[prop]) {
            c[prop] = o[prop];
            delete o[prop];
        } else {
            switch (prop) {
                case 'IntWidth':
                    delete o[prop];
                    break;
                case 'IntHeight':
                    delete o[prop];
                    break;
                case 'BoolFillBrowserClientWindowArea':
                    c.BoolFillBrowserClientWindowArea = false;
                    delete o[prop];
                    break;
            }
        }
    }
    if (o['StringCanvasID']) {
        c.SetStringCanvasID(o['StringCanvasID']);
        delete o['StringCanvasID'];
    } else {
        c.Errors.push('No StringCanvasID property and value provided to CreateCCL2CanvasWithJson');
    }
    for (let oprop in o) {
        c.Errors.push('Unknown property named ' + oprop + ' with value ' + o[oprop] + ' provided to CreateCCL2CanvasWithJson');
    }
    c.InitCCL2Canvas();
    return c;
};

function NameAlreadyExistsInArrayForPropertyFunction(arr, propName, name) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][propName] === name) {
            return true;
        }
    }
    return false;
}

ccl2canvas.prototype.SetStringCanvasID = function (name) {
    if (name && typeof name === 'string' && name.length > 0) {
        if (NameAlreadyExistsInArrayForPropertyFunction(ccl2canvases, 'StringCanvasID', name)) {
            let altName = name + '_UniquenessFailSoAppendingIndex_' + uniquenessFail++;
            this.Errors.push('The canvas id ' + name + ' is already in use so using this id ' + altName + ' instead.');
            StringCanvasID = altName;
        } else {
            StringCanvasID = name;
        }
    } else {
        StringCanvasID = 'DummyStringCanvasIDAsInvalidNameProvided_' + uniquenessFail++;
        this.Errors.push('The name provided to SetStringCanvasID was invalid so using the id ' + StringCanvasID + ' instead.');
    }
};

ccl2canvas.prototype.InitCCL2Canvas = function () {
    this.CCL2Canvas = document.getElementById(StringCanvasID);
    if (this.BoolFillBrowserClientWindowArea) {
        this.CCL2Canvas.width = document.body.clientWidth;
        this.CCL2Canvas.height = document.body.clientHeight;
        this.IntWidth = this.CCL2Canvas.width;
        this.IntHeight = this.CCL2Canvas.height;
    } else {
        if (!this.IntWidth) {
            this.IntWidth = this.CCL2Canvas.clientWidth;
        }
        if(!this.IntHeight) {
            this.IntHeight = this.CCL2Canvas.clientHeight;
        }
    }
    let position = getPosition(this.CCL2Canvas);
    this.IntX = position.x;
    this.IntY = position.y;
    if (this.CCL2Canvas.getContext) {
        this.Context = this.CCL2Canvas.getContext('2d');
        if (!this.Context) {
            this.Errors.push('Failed to get context for canvas element id ' + StringCanvasID);
        }
    } else {
        this.Errors.push('The element id ' + StringCanvasID + ' is not a HTML canvas element.');
    }
    ccl2canvases.push(this);
};

ccl2canvas.prototype.InvalidateFullCanvas = function () {
    this.Context.clearRect(0, 0, this.IntWidth, this.IntHeight);
    for (let i = 0; i < this.ArrayWindows.length; i++) {
        if (this.ArrayWindows[i] instanceof ccl2window) {
            if (this.ArrayWindows[i].FunctionWindowDraw && typeof this.ArrayWindows[i].FunctionWindowDraw === 'function') {
                this.ArrayWindows[i].FunctionWindowDraw();
                if (this.ArrayWindows[i].ChildWindows && this.ArrayWindows[i].ChildWindows.length > 0) {
                    this.Context.save();
                    this.Context.rect(this.ArrayWindows[i].intX, this.ArrayWindows[i].IntY, this.ArrayWindows[i].IntWidth, this.ArrayWindows[i].IntHeight);
                    this.Context.clip();
                    this.ArrayWindows[i].DrawChildWindows();
                    this.Context.restore();
                }
            } else {
                this.Errors.push('The canvas with element id ' + StringCanvasID + ' has a window object with WindowID ' +
                    this.ArrayWindows[i].StringWindowID + ' that has a non function for drawing defined.');
            }
        } else {
            this.Errors.push('Canvas element with id ' + StringCanvasID + ' has a non window object in ArrayWindows.');
        }
    }
};

function RedrawCCL2Window(wnd) {
    if (!wnd.BoolTransparentBackground) {
        wnd.Context.clearRect(wnd.IntX, wnd.IntY, wnd.IntWidth, wnd.IntHeight);
    }
    if (wnd.FunctionWindowDraw && typeof wnd.FunctionWindowDraw === 'function') {
        wnd.FunctionWindowDraw();
        if (wnd.HasVerticalScrollbar) {
            wnd.DrawVerticalScrollbar();
        }
        if (wnd.HasHorizontalScrollbar) {
            wnd.DrawHorizontalScrollbar();
        }
    } else {
        this.Errors.push('The canvas with element id ' + StringCanvasID + ' has a window object with WindowID ' +
            wnd.StringWindowID + ' that has no function for drawing defined.');
    }
}

ccl2canvas.prototype.InvalidateCanvasByRect = function (x, y, width, height) {
    let modalCCL2Windows = [];
    let hasFocusCCL2Window = null;
    for (let i = 0; i < this.ArrayWindows.length; i++) {
        if (this.ArrayWindows[i] instanceof ccl2window) {
            if (this.ArrayWindows[i].IntX < x + width && this.ArrayWindows[i].IntX + this.ArrayWindows[i].IntWidth > x &&
                this.ArrayWindows[i].IntY < y + height && this.ArrayWindows[i].IntY + this.ArrayWindows[i].IntHeight > y) {
                if (!this.ArrayWindows[i].BoolModal && !this.ArrayWindows[i].BoolHasFocus) {
                    RedrawCCL2Window(this.ArrayWindows[i]);
                } else {
                    if (!hasFocusCCL2Window && this.ArrayWindows[i].BoolHasFocus) {
                        hasFocusCCL2Window = this.ArrayWindows[i];
                    } else {
                        modalCCL2Windows.push(this.ArrayWindows[i]);
                    }
                }
            }
        } else {
            this.Errors.push('Canvas element with id ' + StringCanvasID + ' has a non window object in ArrayWindows.');
        }
    }
    for (let i = 0; i < modalCCL2Windows.length; i++) {
        RedrawCCL2Window(modalCCL2Windows[i]);
    }
    if (hasFocusCCL2Window) {
        RedrawCCL2Window(hasFocusCCL2Window);
    }
};

ccl2canvas.prototype.CCL2CanvasOnClick = function (x, y) {
    this.GenericCanvasMouseEvent(x, y, 'FunctionWindowClick');
};

ccl2canvas.prototype.CCL2CanvasOnMouseUp = function (x, y) {
    this.GenericCanvasMouseEvent(x, y, 'FunctionWindowMouseUp');
};

ccl2canvas.prototype.CCL2CanvasOnMouseDown = function (x, y) {
    this.GenericCanvasMouseEvent(x, y, 'FunctionWindowMouseDown');
};

ccl2canvas.prototype.CCL2CanvasOnMouseMove = function (x, y) {
    this.GenericCanvasMouseEvent(x, y, 'FunctionWindowMouseMove');
};

ccl2canvas.prototype.CCL2CanvasOnDoubleClick = function (x, y) {
    this.GenericCanvasMouseEvent(x, y, 'FunctionWindowDoubleClick');
};

ccl2canvas.prototype.CCL2CanvasOnContextMenu = function (x, y) {
    this.GenericCanvasMouseEvent(x, y, 'FunctionWindowOnContextMenu');
};

ccl2canvas.prototype.GenericCanvasMouseEvent = function (x, y, windowMouseEventFunctionName) {
    this.RemoveWindowFocus();
    let lastArrayWindowIndexHit = -1;
    for (let i = this.ArrayWindows.length - 1; i >= 0 ; i--) {
        if (x >= this.ArrayWindows[i].IntX && x < this.ArrayWindows[i].IntX + this.ArrayWindows[i].IntWidth &&
            y >= this.ArrayWindows[i].IntY && y < this.ArrayWindows[i].IntY + this.ArrayWindows[i].IntHeight) {
            lastArrayWindowIndexHit = i;
            if (this.ArrayWindows[i][windowMouseEventFunctionName] && typeof this.ArrayWindows[i][windowMouseEventFunctionName] === 'function') {
                this.ArrayWindows[i].ExtraEventArgs[windowMouseEventFunctionName] = { x: x, y: y };
                this.ArrayWindows[i][windowMouseEventFunctionName]();
            }
            break;
        }
    }
    if ((windowMouseEventFunctionName === 'FunctionWindowClick' || windowMouseEventFunctionName === 'FunctionWindowMouseUp' ||
        windowMouseEventFunctionName === 'FunctionWindowMouseDown' || windowMouseEventFunctionName === 'FunctionWindowDoubleClick') &&
        lastArrayWindowIndexHit > -1 && lastArrayWindowIndexHit < this.ArrayWindows.length) {
        this.ArrayWindows[lastArrayWindowIndexHit].BoolHasFocus = true;
        if (this.ArrayWindows[lastArrayWindowIndexHit].FunctionWindowGotFocus &&
            typeof this.ArrayWindows[lastArrayWindowIndexHit].FunctionWindowGotFocus === 'function') {
            this.ArrayWindows[lastArrayWindowIndexHit].FunctionWindowGotFocus();
        }
        if (lastArrayWindowIndexHit !== this.ArrayWindows.length - 1 && !this.ArrayWindows[lastArrayWindowIndexHit].BoolLayerFixed) {
            let tmp = this.ArrayWindows[lastArrayWindowIndexHit];
            this.ArrayWindows.splice(lastArrayWindowIndexHit, 1);
            this.ArrayWindows.push(tmp);
        }
        this.InvalidateCanvasByRect(this.ArrayWindows[lastArrayWindowIndexHit].IntX, this.ArrayWindows[lastArrayWindowIndexHit].IntY,
            this.ArrayWindows[lastArrayWindowIndexHit].IntWidth, this.ArrayWindows[lastArrayWindowIndexHit].IntHeight);
        if (this.ArrayWindows[lastArrayWindowIndexHit].FunctionBroughtToForegroundLayer &&
            typeof this.ArrayWindows[lastArrayWindowIndexHit].FunctionBroughtToForegroundLayer === 'function') {
            this.ArrayWindows[lastArrayWindowIndexHit].FunctionBroughtToForegroundLayer();
        }
    }
};

ccl2canvas.prototype.RemoveWindowFocus = function () {
    for (let i = 0; i < this.ArrayWindows.length; i++) {
        if (this.ArrayWindows[i].BoolHasFocus) {
            this.ArrayWindows[i].BoolHasFocus = false;
            if (this.ArrayWindows[i].FunctionWindowLostFocus && typeof this.ArrayWindows[i].FunctionWindowLostFocus === 'function') {
                this.ArrayWindows[i].FunctionWindowLostFocus();
            }
        }
    }
};

var ccl2window = function (ccl2canvas, parentWindow, intX, intY, intWidth, intHeight, boolModal, boolHasFocus,
    boolTransparentBackground, boolLayerFixed, functionWindowDraw, functionClick, functionWindowMouseUp,
    functionWindowMouseDown, functionWindowMouseMove, functionWindowDoubleClick, functionWindowOnContextMenu,
    functionBroughtToForegroundLayer, functionWindowGotFocus, functionWindowLostFocus) {
    this.StringWindowID = null;
    this.CCL2Canvas = ccl2canvas;
    this.Context = ccl2canvas && ccl2canvas.Context ? ccl2canvas.Context : null;
    this.IntX = intX;
    this.IntY = intY;
    this.IntWidth = intWidth;
    this.IntHeight = intHeight;
    this.BoolModal = boolModal;
    this.BoolHasFocus = boolHasFocus;
    this.BoolTransparentBackground = boolTransparentBackground;
    this.BoolLayerFixed = boolLayerFixed;
    this.FunctionWindowDraw = functionWindowDraw;
    this.FunctionWindowClick = functionClick;
    this.FunctionWindowMouseUp = functionWindowMouseUp;
    this.FunctionWindowMouseDown = functionWindowMouseDown;
    this.FunctionWindowMouseMove = functionWindowMouseMove;
    this.FunctionWindowDoubleClick = functionWindowDoubleClick;
    this.FunctionWindowOnContextMenu = functionWindowOnContextMenu;
    this.FunctionBroughtToForegroundLayer = functionBroughtToForegroundLayer;
    this.FunctionWindowGotFocus = functionWindowGotFocus;
    this.FunctionWindowLostFocus = functionWindowLostFocus;
    this.ExtraEventArgs = {};
    this.Errors = [];
    this.CCL2Control = null;
    this.ChildWindows = [];
    this.ParentWindow = parentWindow;
    this.HasVerticalScrollbar = false;
    this.VerticalScrollbarOverflowHeightInPixels = 0;
    this.VerticalScrollbarCurrentPosition = 0;
    this.HasHorizontalScrollbar = false;
    this.HorizontalScrollbarOverflowHeightInPixels = 0;
    this.HorizontalScrollbarCurrentPosition = 0;
};

ccl2window.prototype.DrawVerticalScrollbar = function () {
    let drawScrollbarVerticalTopButton = function (img) {
        myCanvas2.Context.drawImage(img, this.IntX + this.IntWidth - 16, this.IntY);
    };

    let drawScrollbarVerticalBottomButton = function (img) {
        myCanvas2.Context.drawImage(img, this.IntX + this.IntWidth - 16, this.IntY + this.IntHeight - 16);
    };

    let drawScrollbarTopCap = function (img) {
        myCanvas2.Context.drawImage(img, this.IntX + this.IntWidth - 16, this.IntY + 16);
    };

    let drawScrollbarMid = function (img) {
        for (let i = 0; i < this.IntHeight - 42; i++) {
            myCanvas2.Context.drawImage(img, this.IntX + this.IntWidth - 16, this.IntY + this.VerticalScrollbarCurrentPosition + 21 + i);
        }
    };

    let drawScrollbarBottomCap = function (img) {
        myCanvas2.Context.drawImage(img, this.IntX + this.IntWidth - 16, this.IntY + this.IntHeight - 21);
    };

    let drawScrollbarHandle = function (img) {
        myCanvas2.Context.drawImage(img, this.IntX + this.IntWidth - 15, this.IntY + this.IntHeight - 45);
    };

    imageManager.CreateImage(myCanvas2, myPurpleRect, 'ScrollbarVerticalTopButton.png', drawScrollbarVerticalTopButton);
    imageManager.CreateImage(myCanvas2, myPurpleRect, 'ScrollbarVerticalBottomButton.png', drawScrollbarVerticalBottomButton);
    imageManager.CreateImage(myCanvas2, myPurpleRect, 'ScrollTopCap.png', drawScrollbarTopCap);
    imageManager.CreateImage(myCanvas2, myPurpleRect, 'ScrollbarMid.png', drawScrollbarMid);
    imageManager.CreateImage(myCanvas2, myPurpleRect, 'ScrollBottomCap.png', drawScrollbarBottomCap);
    imageManager.CreateImage(myCanvas2, myPurpleRect, 'ScrollbarHandle.png', drawScrollbarHandle);
}

ccl2window.prototype.InvalidateWindow = function () {
    this.CCL2Canvas.InvalidateCanvasByRect(this.IntX, this.IntY, this.IntWidth, this.IntHeight);
};

ccl2window.prototype.InitCCL2Window = function (ischildwindow) {
    if (this.CCL2Canvas) {
        if (this.CCL2Canvas.ArrayWindows) {
            if (!this.ParentWindow) {
                this.CCL2Canvas.ArrayWindows.push(this);
            }
        } else {
            this.Errors.push('The canvas with id ' + this.CCL2Canvas.StringCanvasID + ' does not have its ArrayWindows initialized.');
        }
        if (!this.Context) {
            if (!this.CCL2Canvas.Context) {
                this.Errors.push('The canvas with id ' + this.CCL2Canvas.StringCanvasID + ' does not have its context initialized.');
            }
            this.Context = this.CCL2Canvas.Context;
        }
    } else {
        this.Errors.push('The window with id ' + this.StringWindowID + ' does not have its canvas initialized.');
    }
};

ccl2window.prototype.SetStringWindowID = function (name) {
    if (name && typeof name === 'string' && name.length > 0) {
        if (NameAlreadyExistsInArrayForPropertyFunction(this.CCL2Canvas.ArrayWindows, 'StringWindowID', name)) {
            let altName = name + '_UniquenessFailSoAppendingIndex_' + uniquenessFail++;
            this.Errors.push('The window id ' + name + ' is already in use so using this id ' + altName + ' instead.');
            this.StringWindowID = altName;
        } else {
            this.StringWindowID = name;
        }
    } else {
        this.StringWindowID = 'DummyStringWindowIDAsInvalidNameProvided_' + uniquenessFail++;
        this.Errors.push('The name provided to SetStringWindowID was invalid so using the id ' + this.StringWindowID + ' instead.');
    }
};

ccl2window.prototype.CreateCCL2WindowWithJson = function (o) {
    let c = new ccl2window();
    for (let prop in c) {
        if (!(prop == 'ExtraEventArgs' || prop == 'StringWindowID') && o[prop]) {
            c[prop] = o[prop];
            delete o[prop];
        } else {
            switch (prop) {
                case 'ExtraEventArgs':
                    if (o[prop]) {
                        for (let subpropo in o[prop]) {
                            let foundMatchSubProp = false;
                            for (let subpropc in c[prop]) {
                                if (subpropo === subpropc) {
                                    foundMatchSubProp = true;
                                    for (let subpropi in subpropo) {
                                        let foundMatchSubSubProp = false;
                                        for (let subpropj in subpropc) {
                                            if (subpropj === subpropi) {
                                                foundMatchSubSubProp = true;
                                                c[prop][subpropo][subpropi] = o[prop][subpropo][subpropi];
                                            }
                                        }
                                        if (!foundMatchSubSubProp) {
                                            c[prop][subpropo][subpropi] = o[prop][subpropo][subpropi];
                                        }
                                    }
                                }
                            }
                            if (!foundMatchSubProp) {
                                c[prop][subpropo] = o[prop][subpropo];
                            }
                        }
                    }
                    delete o[prop];
                    break;
                case 'IntX':
                    c.IntX = 0;
                    break;
                case 'IntY':
                    c.IntY = 0;
                    break;
                case 'IntWidth':
                    c.IntWidth = c.CCL2Canvas.IntWidth;
                    break;
                case 'IntHeight':
                    c.IntHeight = c.CCL2Canvas.IntHeight;
                    break;
                case 'BoolModal':
                    c.BoolModal = false;
                    break;
                case 'BoolHasFocus':
                    c.BoolHasFocus = false;
                    break;
                case 'BoolTransparentBackground':
                    c.BoolTransparentBackground = false;
                    break;
                case 'BoolLayerFixed':
                    c.BoolLayerFixed = false;
                    break;
            }
        }
    }
    if (o['StringWindowID']) {
        c.SetStringWindowID(o['StringWindowID']);
        delete o['StringWindowID'];
    } else {
        c.Errors.push('No StringWindowID property and value provided to CreateCCL2WindowWithJson');
    }
    for (let oprop in o) {
        c.Errors.push('Unknown property named ' + oprop + ' with value ' + o[oprop] + ' provided to CreateCCL2WindowWithJson');
    }
    c.InitCCL2Window();
    return c;
};

ccl2window.prototype.DrawChildWindows = function () {
    for (let i = 0; i < this.ChildWindows.length; i++) {
        this.ChildWindows[i].FunctionWindowDraw();
        if (this.ChildWindows[i].ChildWindows && this.ChildWindows[i].ChildWindows.length > 0) {
            this.Context.save();
            this.Context.rect(this.IntX, this.IntY, this.IntWidth, this.IntHeight);
            this.Context.clip();
            if (this.ChildWindows[i].FunctionWindowDraw && typeof this.ChildWindows[i].FunctionWindowDraw === 'function') {
                this.ChildWindows[i].FunctionWindowDraw();
            }
            this.ChildWindows[i].DrawChildWindows();
            this.Context.restore();
        }
    }
};

function GetAllErrors() {
    let errmsgs = AddErrorStringsToMsg(ccl2errors);
    let msg = '';
    if (errmsgs != '') {
        msg = 'Global Errors (ccl2errors)\n' + errmsgs;
    }
    for (let i = 0; i < ccl2canvases.length; i++) {
        errmsgs = AddErrorStringsToMsg(ccl2canvases[i].Errors);
        if (errmsgs != '') {
            msg += 'Errors for canvas with StringCanvasID:' + ccl2canvases[i].StringCanvasID + '\n' + errmsgs;
        }
        for (let j = 0; j < ccl2canvases[i].ArrayWindows.length; j++) {
            errmsgs = AddErrorStringsToMsg(ccl2canvases[i].ArrayWindows[j].Errors);
            if (errmsgs != '') {
                msg += 'Errors for window with StringWindowID:' + ccl2canvases[i].ArrayWindows[j].StringWindowID +
                    ' and belonging to canvas with StringCanvasID:' + ccl2canvases[i].StringCanvasID + '\n' + errmsgs;
            }
        }
    }
    return msg;
};

function AddErrorStringsToMsg(errors) {
    let msg = '';
    for (let i = 0; i < errors.length; i++) {
        msg += errors[i] + '\n';
    }
    return msg;
};

var ccl2ImageManager = function () {
    this.ImgMgrURLImages = [];
};

ccl2ImageManager.prototype.CreateImage = function (canvas, wnd, url, callback) {
    for(let i=0; i < this.ImgMgrURLImages.length; i++) {
        if(this.ImgMgrURLImages[i].URL === url) {
            if(this.ImgMgrURLImages[i].Status === 'Loaded') {
                if(callback && typeof callback === 'function') {
                    callback(this.ImgMgrURLImages[i].Img);
                    return;
                }
            } else if(this.ImgMgrURLImages[i].Status === 'Loading') {
                if(!this.ImgMgrURLImages[i].Callbacks) {
                    this.ImgMgrURLImages[i].Callbacks = [];
                }
                this.ImgMgrURLImages[i].Callbacks.push({ CCL2Canvas: canvas, CCL2Window: wnd, Callback: callback });
                return;
            }
        }
    }
    let img = new Image();
    let imgmgr = this.ImgMgrURLImages;
    imgmgr.push({ URL: url, Img: img, Status: 'Loading', Callbacks: [{ CCL2Canvas: canvas, CCL2Window: wnd, Callback: callback }] });
    img.addEventListener("load", function () {
        for (let i = 0; i < imgmgr.length; i++) {
            if (imgmgr[i].URL === url) {
                imgmgr[i].Status = 'Loaded';
                if (imgmgr[i].Callbacks) {
                    for (let j = 0; j < imgmgr[i].Callbacks.length; j++) {
                        if (imgmgr[i].Callbacks[j].Callback && typeof imgmgr[i].Callbacks[j].Callback === 'function') {
                            imgmgr[i].Callbacks[j].Callback(img);
                        }
                    }
                    imgmgr[i].Callbacks = [];
                }
            }
        }
    }, false);
    img.src = url;
};

var imageManager = new ccl2ImageManager();

var ccl2button = function (canvas, stringWindowID, intX, intY, intWidth, intHeight, btnImageURL, btnImagePressedURL,
    btnTooltipText, functionWindowClick, functionWindowDrawCustom) {
    let mousedownflag = false;
    let tmpimg = null;
    let tmpimgpressed = null;
    let tmpWindowDraw = function () {
        if (this.FunctionWindowDrawCustom) {
            this.FunctionWindowDrawCustom();
        } else {
            if (!mousedownflag && tmpimg) {
                canvas.Context.drawImage(tmpimg, intX, intY);
            } else if (mousedownflag && tmpimgpressed) {
                canvas.Context.drawImage(tmpimgpressed, intX, intY);
            }
        }
    };
    let tmpImgMgrDraw = function (img) {
        tmpimg = img;
        canvas.Context.drawImage(img, intX, intY);
    };
    let tmpImgMgrDrawPressed = function (img) {
        tmpimgpressed = img;
    };
    let mouseDown = function () {
        mousedownflag = true;
    };
    let mouseUp = function () {
        mousedownflag = false;
    };
    this.btnCCL2Window = ccl2window.prototype.CreateCCL2WindowWithJson({
        'CCL2Canvas': canvas, 'StringWindowID': stringWindowID, 'IntX': intX, 'IntY': intY,
        'IntWidth': intWidth, 'IntHeight': intHeight, 'FunctionWindowDraw': tmpWindowDraw, 'FunctionWindowClick': functionWindowClick,
        'CCL2Control': this, 'FunctionWindowMouseDown': mouseDown, 'FunctionWindowMouseUp': mouseUp
    });
    this.BtnImageURL = btnImageURL;
    this.BtnImagePressedURL = btnImagePressedURL;
    this.BtnTooltipText = btnTooltipText;
    this.Img = imageManager.CreateImage(canvas, this.btnCCL2Window, this.BtnImageURL, tmpImgMgrDraw);
    this.ImgPressed = imageManager.CreateImage(canvas, this.btnCCL2Window, this.BtnImagePressedURL, tmpImgMgrDrawPressed);
    this.FunctionWindowDrawCustom = functionWindowDrawCustom;
};

ccl2button.prototype.CreateCCL2ButtonWithJson = function (o) {
    return new ccl2button(o['CCL2Canvas'], o['StringWindowID'], o['IntX'], o['IntY'], o['IntWidth'], o['IntHeight'],
        o['BtnImageURL'], o['BtnImagePressedURL'], o['BtnTooltipText'], o['FunctionWindowClick']);
};
