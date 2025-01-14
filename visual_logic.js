/* eslint-disable */

/**
 * Generated by Verge3D Puzzles v.4.3.1
 * Fri, 07 Jul 2023 14:13:08 GMT
 * Prefer not editing this file as your changes may get overridden once Puzzles are saved.
 * Check out https://www.soft8soft.com/docs/manual/en/introduction/Using-JavaScript.html
 * for the information on how to add your own JavaScript to Verge3D apps.
 */
function createPL(v3d = window.v3d) {

// global variables/constants used by puzzles' functions

var LIST_NONE = '<none>';

var _pGlob = {};

_pGlob.objCache = {};
_pGlob.fadeAnnotations = true;
_pGlob.pickedObject = '';
_pGlob.hoveredObject = '';
_pGlob.mediaElements = {};
_pGlob.loadedFile = '';
_pGlob.states = [];
_pGlob.percentage = 0;
_pGlob.openedFile = '';
_pGlob.openedFileMeta = {};
_pGlob.xrSessionAcquired = false;
_pGlob.xrSessionCallbacks = [];
_pGlob.screenCoords = new v3d.Vector2();
_pGlob.intervalTimers = {};
_pGlob.customEvents = new v3d.EventDispatcher();
_pGlob.eventListeners = [];

_pGlob.AXIS_X = new v3d.Vector3(1, 0, 0);
_pGlob.AXIS_Y = new v3d.Vector3(0, 1, 0);
_pGlob.AXIS_Z = new v3d.Vector3(0, 0, 1);
_pGlob.MIN_DRAG_SCALE = 10e-4;
_pGlob.SET_OBJ_ROT_EPS = 1e-8;

_pGlob.vec2Tmp = new v3d.Vector2();
_pGlob.vec2Tmp2 = new v3d.Vector2();
_pGlob.vec3Tmp = new v3d.Vector3();
_pGlob.vec3Tmp2 = new v3d.Vector3();
_pGlob.vec3Tmp3 = new v3d.Vector3();
_pGlob.vec3Tmp4 = new v3d.Vector3();
_pGlob.eulerTmp = new v3d.Euler();
_pGlob.eulerTmp2 = new v3d.Euler();
_pGlob.quatTmp = new v3d.Quaternion();
_pGlob.quatTmp2 = new v3d.Quaternion();
_pGlob.colorTmp = new v3d.Color();
_pGlob.mat4Tmp = new v3d.Matrix4();
_pGlob.planeTmp = new v3d.Plane();
_pGlob.raycasterTmp = new v3d.Raycaster(); // always check visibility

var PL = {};
// backward compatibility
if (v3d[Symbol.toStringTag] !== 'Module') {
    v3d.PL = v3d.puzzles = PL;
}

PL.procedures = PL.procedures || {};




PL.execInitPuzzles = function(options) {
    // always null, should not be available in "init" puzzles
    var appInstance = null;
    // app is more conventional than appInstance (used in exec script and app templates)
    var app = null;

    var _initGlob = {};
    _initGlob.percentage = 0;
    _initGlob.output = {
        initOptions: {
            fadeAnnotations: true,
            useBkgTransp: false,
            preserveDrawBuf: false,
            useCompAssets: false,
            useFullscreen: true,
            useCustomPreloader: false,
            preloaderStartCb: function() {},
            preloaderProgressCb: function() {},
            preloaderEndCb: function() {},
        }
    }

    // provide the container's id to puzzles that need access to the container
    _initGlob.container = options !== undefined && 'container' in options
            ? options.container : "";

    

    
    return _initGlob.output;
}

PL.init = function(appInstance, initOptions) {

// app is more conventional than appInstance (used in exec script and app templates)
var app = appInstance;

initOptions = initOptions || {};

if ('fadeAnnotations' in initOptions) {
    _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
}



var animation_playing, Trava, Animation_paused, Play_animation;

function AudioWebAudio() {
    this.audio = new v3d.Audio(new v3d.AudioListener());

    this._muted = false;
    this._volume = 1;
}

Object.assign(AudioWebAudio.prototype, {

    load: function(url) {
        var scope = this;

        var xhr = new XMLHttpRequest()
        xhr.open('GET', url);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function(e) {
            if (this.status === 200) {
                // new promise-based syntax is not currently supported in Safari
                scope.audio.context.decodeAudioData(this.response, function(decodedData) {
                    scope.audio.setBuffer(decodedData);
                });
            }
        }

        xhr.send();
        return this;
    },

    play: function() {
        if (this.audio.buffer === null) return;
        this.audio.play();
    },

    pause: function() {
        this.audio.pause();
    },

    stop: function() {
        if (this.audio.buffer === null || this.audio.source === null) return;
        this.audio.stop();
    },

    rewind: function() {
        if (this.audio.buffer === null || this.audio.source === null) return;

        var isPlaying = this.audio.isPlaying;
        this.audio.stop();
        if (isPlaying) {
            this.audio.play();
        }
    },

    setPlaybackTime: function(time) {
        // TODO: not easy with WebAudio
    },

    getPlaybackTime: function() {
        // TODO: not easy with WebAudio
        return 0;
    },

    getDuration: function() {
        return (this.audio.buffer === null) ? 0 : this.audio.buffer.duration;
    },

    setPlaybackRate: function(rate) {
        this.audio.setPlaybackRate(rate);
    },

    isPlaying: function() {
        return this.audio.isPlaying;
    },

    setLoop: function(looped) {
        this.audio.setLoop(looped);
    },

    setVolume: function(volume) {
        this._volume = volume;
        if (!this._muted) {
            this.audio.setVolume(volume);
        }
    },

    setMuted: function(muted) {
        this._muted = muted;
        this.audio.setVolume(muted ? 0 : this._volume);
    },

});

// loadMedia puzzle
function loadMedia_WebAudio(url) {
    if (!v3d.Detector.checkWebAudio()) {
        if (!_pGlob.noWebAudioReported) {
            _pGlob.noWebAudioReported = true;
            console.warn('puzzles: Web Audio API not supported');
        }
        return null;
    }

    var elems = _pGlob.mediaElements;
    if (!(url in elems)) {
        elems[url] = new AudioWebAudio().load(url);
    }
    return elems[url];
}

// stopSound puzzle
function stopSound(mediaElem) {
    const mediaElems = (Array.isArray(mediaElem) ? mediaElem : [mediaElem]).filter(elem => elem);
    mediaElems.forEach(mediaElem => {
        mediaElem.stop();
    });
}

/**
 * Get a scene that contains the root of the given action.
 */
function getSceneByAction(action) {
    var root = action.getRoot();
    var scene = root.type == "Scene" ? root : null;
    root.traverseAncestors(function(ancObj) {
        if (ancObj.type == "Scene") {
            scene = ancObj;
        }
    });
    return scene;
}

/**
 * Get the current scene's framerate.
 */
function getSceneAnimFrameRate(scene) {
    if (scene && 'animFrameRate' in scene.userData) {
        return scene.userData.animFrameRate;
    }
    return 24;
}

function _checkListenersSame(target0, type0, listener0, optionsOrUseCapture0,
        target1, type1, listener1, optionsOrUseCapture1) {
    const capture0 = Boolean(optionsOrUseCapture0 instanceof Object
            ? optionsOrUseCapture0.capture : optionsOrUseCapture0);
    const capture1 = Boolean(optionsOrUseCapture1 instanceof Object
            ? optionsOrUseCapture1.capture : optionsOrUseCapture1);
    return target0 === target1 && type0 === type1 && listener0 === listener1
            && capture0 === capture1;
}

/**
 * Add the specified event listener to the specified target. This function also
 * stores listener data for easier disposing.
 */
function bindListener(target, type, listener, optionsOrUseCapture) {
    const alreadyExists = _pGlob.eventListeners.some(elem => {
        return _checkListenersSame(elem.target, elem.type, elem.listener,
                elem.optionsOrUseCapture, target, type, listener,
                optionsOrUseCapture);
    });

    if (!alreadyExists) {
        target.addEventListener(type, listener, optionsOrUseCapture);
        _pGlob.eventListeners.push({ target, type, listener, optionsOrUseCapture });
    }
}

_pGlob.animMixerCallbacks = [];

var initAnimationMixer = function() {

    function onMixerFinished(e) {
        var cb = _pGlob.animMixerCallbacks;
        var found = [];
        for (var i = 0; i < cb.length; i++) {
            if (cb[i][0] == e.action) {
                cb[i][0] = null; // desactivate
                found.push(cb[i][1]);
            }
        }
        for (var i = 0; i < found.length; i++) {
            found[i]();
        }
    }

    return function initAnimationMixer() {
        if (appInstance.mixer && !appInstance.mixer.hasEventListener('finished', onMixerFinished)) {
            bindListener(appInstance.mixer, 'finished', onMixerFinished);
        }
    };

}();

// animation puzzles
function operateAnimation(operation, animations, from, to, loop, speed, callback, rev) {
    if (!animations)
        return;
    // input can be either single obj or array of objects
    if (typeof animations == "string")
        animations = [animations];

    function processAnimation(animName) {
        var action = v3d.SceneUtils.getAnimationActionByName(appInstance, animName);
        if (!action)
            return;
        switch (operation) {
        case 'PLAY':
            if (!action.isRunning()) {
                action.reset();
                if (loop && (loop != "AUTO"))
                    action.loop = v3d[loop];
                var scene = getSceneByAction(action);
                var frameRate = getSceneAnimFrameRate(scene);

                action.repetitions = Infinity;

                var timeScale = Math.abs(parseFloat(speed));
                if (rev)
                    timeScale *= -1;

                action.timeScale = timeScale;
                action.timeStart = from !== null ? from/frameRate : 0;
                if (to !== null) {
                    action.getClip().duration = to/frameRate;
                } else {
                    action.getClip().resetDuration();
                }
                action.time = timeScale >= 0 ? action.timeStart : action.getClip().duration;

                action.paused = false;
                action.play();

                // push unique callbacks only
                var callbacks = _pGlob.animMixerCallbacks;
                var found = false;

                for (var j = 0; j < callbacks.length; j++)
                    if (callbacks[j][0] == action && callbacks[j][1] == callback)
                        found = true;

                if (!found)
                    _pGlob.animMixerCallbacks.push([action, callback]);
            }
            break;
        case 'STOP':
            action.stop();

            // remove callbacks
            var callbacks = _pGlob.animMixerCallbacks;
            for (var j = 0; j < callbacks.length; j++)
                if (callbacks[j][0] == action) {
                    callbacks.splice(j, 1);
                    j--
                }

            break;
        case 'PAUSE':
            action.paused = true;
            break;
        case 'RESUME':
            action.paused = false;
            break;
        case 'SET_FRAME':
            var scene = getSceneByAction(action);
            var frameRate = getSceneAnimFrameRate(scene);
            action.time = from ? from/frameRate : 0;
            action.play();
            action.paused = true;
            break;
        case 'SET_SPEED':
            var timeScale = parseFloat(speed);
            action.timeScale = rev ? -timeScale : timeScale;
            break;
        }
    }

    for (var i = 0; i < animations.length; i++) {
        var animName = animations[i];
        if (animName)
            processAnimation(animName);
    }

    initAnimationMixer();
}

// playSound puzzle
function playSound(mediaElem, loop) {
    const mediaElems = (Array.isArray(mediaElem) ? mediaElem : [mediaElem]).filter(elem => elem);
    mediaElems.forEach(mediaElem => {
        mediaElem.setLoop(loop);
        mediaElem.play();
    });
}

function findUniqueObjectName(name) {
    function objNameUsed(name) {
        return Boolean(getObjectByName(name));
    }
    while (objNameUsed(name)) {
        var r = name.match(/^(.*?)(\d+)$/);
        if (!r) {
            name += "2";
        } else {
            name = r[1] + (parseInt(r[2], 10) + 1);
        }
    }
    return name;
}

// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function notIgnoredObj(obj) {
    return obj.type !== 'AmbientLight' &&
           obj.name !== '' &&
           !(obj.isMesh && obj.isMaterialGeneratedMesh) &&
           !obj.isAuxClippingMesh;
}


// utility function envoked by almost all V3D-specific puzzles
// find first occurence of the object by its name
function getObjectByName(objName) {
    var objFound;
    var runTime = _pGlob !== undefined;
    objFound = runTime ? _pGlob.objCache[objName] : null;

    if (objFound && objFound.name === objName)
        return objFound;

    if (appInstance.scene) {
        appInstance.scene.traverse(function(obj) {
            if (!objFound && notIgnoredObj(obj) && (obj.name == objName)) {
                objFound = obj;
                if (runTime) {
                    _pGlob.objCache[objName] = objFound;
                }
            }
        });
    }
    return objFound;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects on the scene
function getAllObjectNames() {
    var objNameList = [];
    appInstance.scene.traverse(function(obj) {
        if (notIgnoredObj(obj))
            objNameList.push(obj.name)
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects which belong to the group
function getObjectNamesByGroupName(targetGroupName) {
    var objNameList = [];
    appInstance.scene.traverse(function(obj){
        if (notIgnoredObj(obj)) {
            var groupNames = obj.groupNames;
            if (!groupNames)
                return;
            for (var i = 0; i < groupNames.length; i++) {
                var groupName = groupNames[i];
                if (groupName == targetGroupName) {
                    objNameList.push(obj.name);
                }
            }
        }
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// process object input, which can be either single obj or array of objects, or a group
function retrieveObjectNames(objNames) {
    var acc = [];
    retrieveObjectNamesAcc(objNames, acc);
    return acc.filter(function(name) {
        return name;
    });
}

function retrieveObjectNamesAcc(currObjNames, acc) {
    if (typeof currObjNames == "string") {
        acc.push(currObjNames);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
        var newObj = getObjectNamesByGroupName(currObjNames[1]);
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
        var newObj = getAllObjectNames();
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames)) {
        for (var i = 0; i < currObjNames.length; i++)
            retrieveObjectNamesAcc(currObjNames[i], acc);
    }
}

// addAnnotation and removeAnnotation puzzles
function handleAnnot(add, annot, objSelector, contents, id, name) {
    var objNames = retrieveObjectNames(objSelector);

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        if (!objName)
            continue;
        var obj = getObjectByName(objName);
        if (!obj)
            continue;
        // check if it already has an annotation and remove it
        for (var j = 0; j < obj.children.length; j++) {
            var child = obj.children[j];
            if (child.type == "Annotation") {
                // delete all childs of annotation
                child.traverse(function(child2) {
                    if (child2.isAnnotation)
                        child2.dispose();
                    });
                obj.remove(child);
            }
        }
        if (add) {
            var aObj = new v3d.Annotation(appInstance.container, annot, contents);
            aObj.name = findUniqueObjectName(name ? name : annot);
            aObj.fadeObscured = _pGlob.fadeAnnotations;
            if (id) {
                aObj.annotation.id = id;
                aObj.annotationDialog.id = id+'_dialog';
            }
            obj.add(aObj);
        }
    }
}

// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function initObjectPicking(callback, eventType, mouseDownUseTouchStart, mouseButtons) {

    var elem = appInstance.renderer.domElement;
    bindListener(elem, eventType, pickListener);

    if (eventType == 'mousedown') {

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        bindListener(elem, touchEventName, pickListener);

    } else if (eventType == 'dblclick') {

        var prevTapTime = 0;

        function doubleTapCallback(event) {

            var now = new Date().getTime();
            var timesince = now - prevTapTime;

            if (timesince < 600 && timesince > 0) {

                pickListener(event);
                prevTapTime = 0;
                return;

            }

            prevTapTime = new Date().getTime();
        }

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        bindListener(elem, touchEventName, doubleTapCallback);
    }

    var raycaster = new v3d.Raycaster();

    function pickListener(event) {

        // to handle unload in loadScene puzzle
        if (!appInstance.getCamera())
            return;

        event.preventDefault();

        var xNorm = 0, yNorm = 0;
        if (event instanceof MouseEvent) {
            if (mouseButtons && mouseButtons.indexOf(event.button) == -1)
                return;
            xNorm = event.offsetX / elem.clientWidth;
            yNorm = event.offsetY / elem.clientHeight;
        } else if (event instanceof TouchEvent) {
            var rect = elem.getBoundingClientRect();
            xNorm = (event.changedTouches[0].clientX - rect.left) / rect.width;
            yNorm = (event.changedTouches[0].clientY - rect.top) / rect.height;
        }

        _pGlob.screenCoords.x = xNorm * 2 - 1;
        _pGlob.screenCoords.y = -yNorm * 2 + 1;
        raycaster.setFromCamera(_pGlob.screenCoords, appInstance.getCamera(true));
        var objList = [];
        appInstance.scene.traverse(function(obj){objList.push(obj);});
        var intersects = raycaster.intersectObjects(objList, false);
        callback(intersects, event);
    }
}

function objectsIncludeObj(objNames, testedObjName) {
    if (!testedObjName) return false;

    for (var i = 0; i < objNames.length; i++) {
        if (testedObjName == objNames[i]) {
            return true;
        } else {
            // also check children which are auto-generated for multi-material objects
            var obj = getObjectByName(objNames[i]);
            if (obj && obj.type == "Group") {
                for (var j = 0; j < obj.children.length; j++) {
                    if (testedObjName == obj.children[j].name) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// utility function used by the whenClicked, whenHovered, whenDraggedOver, and raycast puzzles
function getPickedObjectName(obj) {
    // auto-generated from a multi-material object, use parent name instead
    if (obj.isMesh && obj.isMaterialGeneratedMesh && obj.parent) {
        return obj.parent.name;
    } else {
        return obj.name;
    }
}

// whenClicked puzzle
function registerOnClick(objSelector, xRay, doubleClick, mouseButtons, cbDo, cbIfMissedDo) {

    // for AR/VR
    _pGlob.objClickInfo = _pGlob.objClickInfo || [];

    _pGlob.objClickInfo.push({
        objSelector: objSelector,
        callbacks: [cbDo, cbIfMissedDo]
    });

    initObjectPicking(function(intersects, event) {

        var isPicked = false;

        var maxIntersects = xRay ? intersects.length : Math.min(1, intersects.length);

        for (var i = 0; i < maxIntersects; i++) {
            var obj = intersects[i].object;
            var objName = getPickedObjectName(obj);
            var objNames = retrieveObjectNames(objSelector);

            if (objectsIncludeObj(objNames, objName)) {
                // save the object for the pickedObject block
                _pGlob.pickedObject = objName;
                isPicked = true;
                cbDo(event);
            }
        }

        if (!isPicked) {
            _pGlob.pickedObject = '';
            cbIfMissedDo(event);
        }

    }, doubleClick ? 'dblclick' : 'mousedown', false, mouseButtons);
}

// getAnimations puzzle
function getAnimations(objSelector) {
    const objNames = retrieveObjectNames(objSelector);

    const animations = [];
    for (let i = 0; i < objNames.length; i++) {
        const objName = objNames[i];
        if (!objName)
            continue;
        // use objName as animName - for now we have one-to-one match
        const action = v3d.SceneUtils.getAnimationActionByName(appInstance, objName);
        if (action)
            animations.push(objName);
    }
    return animations;
}

// ssr puzzle
function ssr(type, matName, steps, stride, binarySearchSteps, thickness,
        maxDistance, resolution, jitter, renderAfterSelector) {

    var useRefract = (type == 'REFRACT') ? true : false;

    var matNames = Array.isArray(matName) ? matName : [matName];
    var mats = [];

    matNames.forEach(function(name) {
        mats = mats.concat(v3d.SceneUtils.getMaterialsByName(appInstance, name));
    });

    var objects = [];

    for (var i = 0; i < mats.length; i++) {
        var mat = mats[i];

        appInstance.scene.traverse(function(obj) {
            if (obj.material && obj.material == mat)
                objects.push(obj);
        });
    }

    // no need
    if (!objects.length)
        return;

    var renderAfter = [];

    var renderAfterNames = retrieveObjectNames(renderAfterSelector);

    for (var i = 0; i < renderAfterNames.length; i++) {
        var obj = getObjectByName(renderAfterNames[i]);
        if (obj)
            renderAfter.push(obj);
    }

    appInstance.enablePostprocessing([{
        type: 'ssr',
        useRefract: useRefract,
        objects: objects,
        steps: steps,
        stride: stride,
        binarySearchSteps: binarySearchSteps,
        thickness: thickness,
        maxDistance: maxDistance,
        renderTargetScale: resolution,
        jitter: jitter,
        renderAfter: renderAfter
    }]);
}

// openWebPage puzzle
function openWebPage(url, mode) {

    if (appInstance && appInstance.controls) {
        appInstance.controls.forceMouseUp();
    }

    if (mode == "NEW") {
        window.open(url);
    } else if (mode == "NO_RELOAD") {
        history.pushState('verge3d state', 'verge3d page', url);
    } else {
        var target;
        switch (mode) {
            case "SAME":
                target = "_self";
                break;
            case "TOP":
                target = "_top";
                break;
            case "PARENT":
                target = "_parent";
                break;
        }

        window.open(url, target);

    }
}

// setTimeout puzzle
function registerSetTimeout(timeout, callback) {
    window.setTimeout(callback, 1000 * timeout);
}

// isAnimationPlaying puzzle
function isAnimationPlaying(animations) {
    if (!animations)
        return;
    // input can be either single obj or array of objects
    if (typeof animations == "string")
        animations = [animations];
    for (let i = 0; i < animations.length; i++) {
        const animName = animations[i];
        if (!animName)
            continue;
        const action = v3d.SceneUtils.getAnimationActionByName(appInstance, animName);
        if (action && action.isRunning())
            return true;
    }
    return false;
}

// utility functions envoked by the HTML puzzles
function getElements(ids, isParent) {
    var elems = [];
    if (Array.isArray(ids) && ids[0] != 'CONTAINER' && ids[0] != 'WINDOW' &&
        ids[0] != 'DOCUMENT' && ids[0] != 'BODY' && ids[0] != 'QUERYSELECTOR') {
        for (var i = 0; i < ids.length; i++)
            elems.push(getElement(ids[i], isParent));
    } else {
        elems.push(getElement(ids, isParent));
    }
    return elems;
}

function getElement(id, isParent) {
    var elem;
    if (Array.isArray(id) && id[0] == 'CONTAINER') {
        if (appInstance !== null) {
            elem = appInstance.container;
        } else if (typeof _initGlob !== 'undefined') {
            // if we are on the initialization stage, we still can have access
            // to the container element
            var id = _initGlob.container;
            if (isParent) {
                elem = parent.document.getElementById(id);
            } else {
                elem = document.getElementById(id);
            }
        }
    } else if (Array.isArray(id) && id[0] == 'WINDOW') {
        if (isParent)
            elem = parent;
        else
            elem = window;
    } else if (Array.isArray(id) && id[0] == 'DOCUMENT') {
        if (isParent)
            elem = parent.document;
        else
            elem = document;
    } else if (Array.isArray(id) && id[0] == 'BODY') {
        if (isParent)
            elem = parent.document.body;
        else
            elem = document.body;
    } else if (Array.isArray(id) && id[0] == 'QUERYSELECTOR') {
        if (isParent)
            elem = parent.document.querySelector(id);
        else
            elem = document.querySelector(id);
    } else {
        if (isParent)
            elem = parent.document.getElementById(id);
        else
            elem = document.getElementById(id);
    }
    return elem;
}

// setHTMLElemStyle puzzle
function setHTMLElemStyle(prop, value, ids, isParent) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem || !elem.style)
            continue;
        elem.style[prop] = value;
    }
}

// outline puzzle
function outline(objSelector, doWhat) {
    var objNames = retrieveObjectNames(objSelector);

    if (!appInstance.postprocessing || !appInstance.postprocessing.outlinePass)
        return;
    var outlineArray = appInstance.postprocessing.outlinePass.selectedObjects;
    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        var obj = getObjectByName(objName);
        if (!obj)
            continue;
        if (doWhat == "ENABLE") {
            if (outlineArray.indexOf(obj) == -1)
                outlineArray.push(obj);
        } else {
            var index = outlineArray.indexOf(obj);
            if (index > -1)
                outlineArray.splice(index, 1);
        }
    }
}

// whenHovered puzzle
initObjectPicking(function(intersects, event) {

    var prevHovered = _pGlob.hoveredObject;
    var currHovered = '';

    // the event might happen before hover registration
    _pGlob.objHoverInfo = _pGlob.objHoverInfo || [];

    // search for closest hovered object

    var lastIntersectIndex = Infinity;
    _pGlob.objHoverInfo.forEach(function(el) {
        var maxIntersects = el.xRay ? intersects.length : Math.min(1, intersects.length);

        for (var i = 0; i < maxIntersects; i++) {
            var obj = intersects[i].object;
            var objName = getPickedObjectName(obj);

            if (objectsIncludeObj(retrieveObjectNames(el.objSelector), objName) && i <= lastIntersectIndex) {
                currHovered = objName;
                lastIntersectIndex = i;
            }
        }
    });

    if (prevHovered == currHovered) return;

    // first - all "out" callbacks, then - all "over"
    _pGlob.objHoverInfo.forEach(function(el) {
        if (objectsIncludeObj(retrieveObjectNames(el.objSelector), prevHovered)) {
            // ensure the correct value of the hoveredObject block
            _pGlob.hoveredObject = prevHovered;
            el.callbacks[1](event);
        }
    });

    _pGlob.objHoverInfo.forEach(function(el) {
        if (objectsIncludeObj(retrieveObjectNames(el.objSelector), currHovered)) {
            // ensure the correct value of the hoveredObject block
            _pGlob.hoveredObject = currHovered;
            el.callbacks[0](event);
        }
    });

    _pGlob.hoveredObject = currHovered;
}, 'mousemove', false);

// whenHovered puzzle
function registerOnHover(objSelector, xRay, cbOver, cbOut) {

    _pGlob.objHoverInfo = _pGlob.objHoverInfo || [];

    _pGlob.objHoverInfo.push({
        objSelector: objSelector,
        callbacks: [cbOver, cbOut],
        xRay: xRay
    });
}


/* Fora do click mantem o som parado */
stopSound(loadMedia_WebAudio('./machine.mp3'));
stopSound(loadMedia_WebAudio('./trava.wav'));

/* Inicia com animação da manivela parada */
animation_playing = false;

/* CONTROLE DA TRAVA */
Trava = false;
registerOnClick('TRAVA', false, false, [0,1,2], function() {
  console.log('Click');
  /* Se a animação está tocando, execute */
  if (Trava == false && animation_playing == false) {

    operateAnimation('PLAY', 'TRAVA', 0, 30, 'LoopOnce', 2,
            function() {}, false);

        playSound(loadMedia_WebAudio('trava.wav'), false);
    Trava = true;
    handleAnnot(false, '', 'Note - Trava', '', '', undefined);
  } else {
    /* Se a animação está parada, execute */
    if (Trava == true && animation_playing == false) {
      playSound(loadMedia_WebAudio('trava.wav'), false);

      operateAnimation('PLAY', 'TRAVA', 0, 30, 'LoopOnce', 2,
              function() {}, true);

          Trava = false;
    }
  }
}, function() {});

getAnimations('<none>');

ssr('REFLECT', 'Material.001', 100, 5, 4, 0.01, 100, 0.5, 1, '<none>');

handleAnnot(true, '1', 'Note 1', 'Controle de Direção', 'poi1', undefined);
handleAnnot(true, '2', 'Note 2', 'Trava de Segurança', 'poi2', undefined);
handleAnnot(true, '3', 'Note 3', 'Manivela de Rotação', 'poi3', undefined);
handleAnnot(true, '4', 'Note 4', 'Controle de Rotação', 'poi4', undefined);

/* Botao para abrir o link do youtube */
registerOnClick('Btn_youtube', false, false, [0,1,2], function() {

  operateAnimation('PLAY', 'Btn_youtube', 0, 10, 'LoopOnce', 2,
          function() {}, false);

      registerSetTimeout(1, function() {
    openWebPage('https://www.youtube.com/watch?v=MJS01-qcvjQ', 'NEW');
  });
}, function() {});

/* CONTROLE DA MANIVELA */
registerOnClick('200.002', false, false, [0,1,2], function() {
  /* Se a trava está liberada execute */
  if (Trava == true) {
    /* Se a animação está rodando execute */
    if (isAnimationPlaying('200.002')) {

      operateAnimation('PAUSE', '200.002', null, null, 'AUTO', 1,
              function() {}, false);

          stopSound(loadMedia_WebAudio('./machine.mp3'));
      Animation_paused = true;
      Play_animation = false;
      animation_playing = false;
    } else {
      /* Se a animação está pausada, execute */
      if (Animation_paused == true) {

        operateAnimation('RESUME', '200.002', null, null, 'AUTO', 1,
                function() {}, false);

            playSound(loadMedia_WebAudio('./machine.mp3'), true);
        Play_animation = true;
        Animation_paused = false;
      } else {
        /* Se a animação está parada, execute */
        animation_playing = true;

        operateAnimation('PLAY', '200.002', 0, 240, 'LoopRepeat', 2,
                function() {}, false);

            playSound(loadMedia_WebAudio('./machine.mp3'), true);
        Play_animation = true;
      }
    }
  } else {
    handleAnnot(true, 'TRAVA ATIVADA', 'Note - Trava', 'DESTRAVE PARA LIBERAR', 'poi5', undefined);
  }
}, function() {});

/* Cria o outline para o objeto manivela */
registerOnHover('200.002', false, function() {
  setHTMLElemStyle('cursor', 'pointer', ['BODY'], false);
  outline('200.002', 'ENABLE');
}, function() {
  setHTMLElemStyle('cursor', 'default', ['BODY'], false);
  outline('200.002', 'DISABLE');
});

/* Cria o outline para o objeto trava */
registerOnHover('TRAVA', false, function() {
  setHTMLElemStyle('cursor', 'pointer', ['BODY'], false);
  outline('TRAVA', 'ENABLE');
}, function() {
  setHTMLElemStyle('cursor', 'default', ['BODY'], false);
  outline('TRAVA', 'DISABLE');
});

/* Cria o outline para o objeto botao do youtube */
registerOnHover('Btn_youtube', false, function() {
  setHTMLElemStyle('cursor', 'pointer', ['BODY'], false);
  outline('Btn_youtube', 'ENABLE');
}, function() {
  setHTMLElemStyle('cursor', 'default', ['BODY'], false);
  outline('Btn_youtube', 'DISABLE');
});



} // end of PL.init function

PL.disposeListeners = function() {
    if (_pGlob) {
        _pGlob.eventListeners.forEach(({ target, type, listener, optionsOrUseCapture }) => {
            target.removeEventListener(type, listener, optionsOrUseCapture);
        });
        _pGlob.eventListeners.length = 0;
    }
}

PL.dispose = function() {
    PL.disposeListeners();
    _pGlob = null;
    // backward compatibility
    if (v3d[Symbol.toStringTag] !== 'Module') {
        delete v3d.PL;
        delete v3d.puzzles;
    }
}



return PL;

}

export { createPL };
