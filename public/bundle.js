/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "6a91720a03d1f1065b0a"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(34)(__webpack_require__.s = 34);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(21))(5);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(21))(2);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(21))(1);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _) {const htmlTpl = __webpack_require__(104);
const compText = __webpack_require__(44);
const compSelect = __webpack_require__(30);
const compDate = __webpack_require__(43);

/**
 * [搜索组件]
 */
module.exports = Backbone.View.extend({
    tagName: "div",

    className: "search",

    template: _.template(htmlTpl),

    events: {
        'click .searchBtn': 'onClickSearch'
    },

    initialize: function (param) {
        var showAdd = param.showAdd || false;
        var addHref = param.addLink || null;
        var showSearch = param.showSearch || false;
        var addTitle = param.addTitle || "添加记录";

        this.linesNum = param.linesNum || 1;
        this.searchBodys = []; //用于存放搜索项控件
        this.$el.append(this.template({
            showAdd: showAdd,
            addHref: addHref,
            addTitle: addTitle,
            linesNum: this.linesNum,
            showSearch: showSearch
        }));
    },

    render: function () {
        var me = this;
        for (let i = 0; i < this.linesNum; i++) {
            _.each(me.searchBodys, function (searchBody, index) {
                if (i == searchBody.line) {
                    me.$('.item' + i).append(searchBody.element.render().el);
                }
            });
        }

        return this;
    },
    /**
     * 设想是为搜索主体添加搜索项，每个搜索项是单独小控件
     */
    setParam: function (paramArray) {
        this.parseSearchBodylist(paramArray);
    },
    /**
     * 整理搜索栏的条件对象数组
     * @return {[Array[object]]} [搜索栏的对象数组,对象是各个搜索条件的配置参数,排序为数组的排序]
     */
    parseSearchBodylist: function (paramArray) {
        var me = this;
        if (_.isArray(paramArray)) {
            _.each(paramArray, function (val, index) {
                var searchEl = me.chooseSearchTerm(val.type);
                me.searchBodys.push({ element: new searchEl(val.param), line: val.line });
            });
        }
    },
    /**
     * 通过传入参数的type返回相应的搜索子控件
     * @param  {Strng} type [description]
     * @return {Backbone.View}      子控件对象
     */
    chooseSearchTerm: function (type) {
        if (type == 'select') {
            return compSelect;
        }
        if (type == 'text') {
            return compText;
        }
        if (type == 'daterange') {
            return compDate;
        }
    },
    /**
     * 获取搜索主体的条件 -- 日期范围的控件需要单独拿出来调用
     * @return {[type]} [description]
     */
    getSearchValue: function () {
        var me = this;
        var result = {};
        _.each(me.searchBodys, (element, index) => {
            if (element.element.getName) {
                result[element.element.getName()] = element.element.getValue();
            }
        });
        return result;
    },
    /**
     * 通过组件name返回该组件对象 ---主要针对时间范围选取的组件
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    getElByName: function (name) {
        var me = this;
        var target = null;
        _.each(me.searchBodys, function (el, index) {
            if (el.element.getName() == name) {
                target = el.element;
            }
        });
        return target;
    },
    /**
     * 点击搜索键后的回调函数
     */
    onClickSearch: function (e) {
        var searchObj = JSON.stringify(this.getSearchValue());
        this.trigger('goSearch', searchObj);
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const tpl = __webpack_require__(105);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "table-responsive",

    template: _.template(tpl),

    events: {
        "click tbody>tr>td": "onClickTd",
        "click input[name='checkall']": "onCheckAll"
    },

    initialize: function () {
        this.datas = [];
        this.theads = [];
        this.rows = [];
        this.opration = [];
        this.checkId = null;

        this.hasCheckBox = true; //是否有序号列
        this.hasOpration = false; //是否有操作列
    },

    render: function () {
        this.$el.append(this.template({
            theads: this.thead,
            datas: this.datas,
            rows: this.rows,
            hasCheckBox: this.hasCheckBox,
            checkId: this.checkId,
            hasOpration: this.hasOpration,
            opration: this.opration
        }));

        return this;
    },

    /**
     * 按照目前的需求，配置一个表格需要6个配置(列名配置、表列配置、点选列配置、操作列配置、展示数据配置、是否开启操作列)
     * @param {Object} param [参数包含(暂时为):传入数组，表列名，需要显示的属性]
    */
    setData: function (data) {
        this.datas = data || [];
        this.refresh();
    },

    setThead: function (thead) {
        var theads = [];
        if (_.isArray(thead)) {
            this.thead = thead;
        } else {
            return false;
        }
    },

    setCheckId: function (id) {
        this.checkId = id;
    },

    setHasCheckBox: function (show) {
        if (typeof show != 'undefined') {
            this.hasCheckBox = show;
        }
    },

    setHasOpration: function (show) {
        if (typeof show != 'undefined') {
            this.hasOpration = show;
        }
    },

    setOpration: function (param) {
        this.opration = param;
    },

    setRow: function (rows) {
        if (rows) {
            this.rows = this.parseRow(rows);
        } else {
            return;
        }
    },

    /**
      * 整理表格每列数字的配置
      * @param  {Array} rowParams [表格每列的配置数组，元素为为配置类对象]
      * @return {array[object]}        [返回的是每个列的配置对象]
    */
    parseRow: function (rowParams) {
        var result = [];
        _.each(rowParams, function (val, index) {
            if (typeof val == "object") {
                result.push({
                    name: val.name || null, //传入data的对应参数名
                    isSkip: val.isSkip || false, //是否可跳转至其他页面
                    code: val.code || "id",
                    link: val.link || null //跳转页面的链接
                });
            }
            if (typeof val == "string") {
                result.push({
                    name: val || null
                });
            }
        });

        return result;
    },

    /**
     * 点击表列的td元素，回调函数**************
     * @param  {[type]} e [description]
     */
    onClickTd: function (e) {
        e.stopPropagation();
        if (e.target.nodeName != "TD") {
            this.isCheckAll();
            return;
        }
        var $checkBox = $(e.target).closest('tr').find('input[type="checkbox"]');
        $checkBox.prop("checked") ? $checkBox.prop("checked", false) : $checkBox.prop("checked", true);
        this.isCheckAll();
    },
    /**
     * 全选点击的回调函数
     * @param  {[type]} e [回传的事件]
     */
    onCheckAll: function (e) {
        e.stopPropagation();
        let $e = $(e.target);
        let $checkBoxs = $e.closest('thead').next().find('input[type="checkbox"]');
        !$e.prop("checked") ? $checkBoxs.prop("checked", false) : $checkBoxs.prop("checked", true);
    },

    /**
     * 是否为全选状态
     */
    isCheckAll: function () {
        var checkedBoxSize = this.$el.find('tbody input[type="checkbox"]:checked').size();
        var allBoxSize = this.$el.find('tbody input[type="checkbox"]').size();
        var $checkallBox = this.$el.find('input[name="checkall"]');
        allBoxSize > checkedBoxSize ? $checkallBox.prop("checked", false) : $checkallBox.prop("checked", true);
    },
    /**
     * 刷新表格,先清空再渲染
     */
    refresh: function () {
        this.$el.empty();
        this.render();
    },

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(101);

/**
 * 分页组件
 */
module.exports = Backbone.View.extend({
    tagName: 'div',

    className: 'pagement text-right',

    events: {
        "click a[class!='move']": "clickPage",
        "click a[name='left']": "clickPageUp",
        "click a[name='right']": "clickPageDown",
        "keypress .pageskip": "goPage"
    },

    template: _.template(htmlTpl),

    initialize: function (param) {
        var param = param || {};
        this.setParam(param);
    },

    render: function () {
        this.$el.append(this.template({
            totalPage: this.totalPage,
            currentPage: this.currentPage,
            pageRange: this.pageRange,
            show: this.show,
            total: this.total
        }));
        return this;
    },

    setParam: function (param) {
        this.pageRange = param.pageRange || 10;
        this.pageSize = param.pageSize || 15;
        this.totalPage = param.totalPage || 20;
        this.currentPage = param.currentPage || 1;
        this.show = param.show || true;
        this.total = param.total || 0;
    },

    clickPage: function (e) {
        e.stopPropagation();
        var $current = $(e.target);
        var pageNum = parseInt($current.text());
        if (pageNum != this.currentPage) {
            this.setCurrentPage(pageNum);
            this.triggerChange();
        }
    },

    clickPageUp: function (e) {
        e.stopPropagation();
        if ($(e.target).closest('li').hasClass('disabled')) {
            return;
        }
        var now = parseInt(this.currentPage) - 1;
        if (now != this.currentPage) {
            this.setCurrentPage(now);
            this.triggerChange();
        }
    },

    clickPageDown: function (e) {
        e.stopPropagation();
        if ($(e.target).closest('li').hasClass('disabled')) {
            return;
        }
        var now = parseInt(this.currentPage) + 1;
        if (now != this.currentPage) {
            this.setCurrentPage(now);
            this.triggerChange();
        }
    },

    goPage: function (e) {
        if (e.keyCode == 13) {
            var val = parseInt($(e.target).val());
            if (val != this.currentPage && val <= this.totalPage && val > 0) {
                this.setCurrentPage(val);
                this.triggerChange();
            }
        }
    },

    setCurrentPage: function (currentPage) {
        this.currentPage = currentPage;
        this.$el.empty();
        this.render();
    },

    getCurrentPage: function () {
        return this.currentPage;
    },

    getAllPages: function () {
        // console.log(this.totalPage);
    },

    getPageSize: function () {
        return this.pageSize;
    },

    clearPage: function () {
        this.$el.empty();
    },
    /**
     * 出发pageChange事件，并且传入当前页的页码
     * @return {[type]} [description]
     */
    triggerChange: function () {
        this.trigger("pageChange", this.currentPage);
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"pageHead\">\r\n    <div class=\"phLeft\"><img src=\"" + __webpack_require__(10) + "\" alt=\"\">&nbsp&nbsp<span style=\"color:#9e9e9e;\">当前位置：</span>\r\n        <% _.each(titles,function(title,index){%>\r\n           <% if(titles.length-1 > index){ %>\r\n            \t<span><%=title%></span> >\r\n           <% }else{ %>\r\n            \t<span><%=title%></span>\r\n            <% } %>\r\n        <%})%>\r\n    </div>\r\n    <div class=\"phRight\">\r\n        <% if(back){%>\r\n            <a onClick=\"javascript :history.back(-1);\" href=\"javascript:void(0)\" class=\"btn btn-info back\">返回</a>\r\n        <% } %>\r\n    </div>\r\n</div>\r\n<div class=\"panel panel-default\">\r\n    <div class=\"panel-body\">\r\n        <div class=\"row\">\r\n            <div class=\"col-md-12\" id=\"search\"></div>\r\n        </div>\r\n        <hr>\r\n        <div class=\"row\">\r\n            <div id=\"cont\" class=\"col-md-12\"></div>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-xs-4\" id=\"batch\"></div>\r\n            <div class=\"col-xs-8\" id=\"pg\"></div>\r\n        </div>\r\n    </div>\r\n</div>";

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _) {const htmlTpl = __webpack_require__(75);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    events: {
        "blur input[type='text']": "onBlurText"
    },

    initialize: function (param) {
        var param = param || {};
        this.setParam(param);
    },

    render: function () {
        this.$el.append(this.template({
            "title": this.title,
            "value": this.value,
            "explain": this.explain,
            "allowEmpty": this.allowEmpty,
            "name": this.name,
            "msg": this.msg,
            "err": this.err,
            "readonly": this.readonly
        }));
        return this;
    },
    /**
     * 添加配置参数
     * @param {[string]} name    [控件识别名称]
     * @param {[object]} options [下拉控件参数]
     * e : {
     *    title : "a",
     *    value : "content",
     *    explain : "string",
     *    allowEmpty : true,
     *    name : "name"
     * }
     */
    setParam: function (param) {
        if (!param) {
            return;
        }

        this.title = param.title || "文本框"; //标题
        this.value = param.value || ""; //输入框内值
        this.explain = param.explain || "输入内容"; //输入提示
        this.allowEmpty = param.allowEmptytrue || true; //可否为空
        this.name = param.name || ""; //该输入框绑定的传出参数名
        this.msg = param.msg || ""; //输入框注意事项
        this.err = param.err || "输入内容不符合格式";
        this.pattern = param.pattern || null; //正则匹配 
        this.readonly = param.readonly || false;
    },

    getValue: function () {
        return this.$('input[type="text"]').val();
    },

    setValue: function (val) {
        this.value = val;
        this.$('input[type="text"]').val(val);
    },

    setName: function (name) {
        this.name = name;
    },

    getName: function () {
        return this.name;
    },

    onBlurText: function (e) {
        this.checkValue() ? this.$('.formError').hide() : this.$('.formError').show();
    },
    /**
     * 对输入内容进行正则匹配
     * @return {boolean} [符合匹配为true 不匹配为false]
     */
    checkValue: function () {
        if (!this.pattern) return true;
        var re = this.pattern;
        return re.test(this.getValue());
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _) {const htmlTpl = __webpack_require__(71);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    initialize: function (param) {
        var param = param || {};
        this.setParam(param);
    },

    render: function () {
        this.$el.append(this.template({
            options: this.options,
            name: this.name,
            title: this.title
        }));
        return this;
    },
    /**
     * 添加配置参数
     * @param {[string]} name    [控件识别名称]
     * @param {[object]} options [下拉控件参数]
     * e : {
     *    name : "name",
     *    titile : "title",
     *    options : [{value:'value',content:'content'}]
     * }
     */
    setParam: function (param) {
        if (!param) {
            return;
        }
        this.options = param.options || [];
        this.name = param.name || "";
        this.title = param.title || "默认标题";
    },

    setOptions: function (options) {
        this.$("select").empty();
        this.$("select").append("<option value=''>请选择</option>");
        for (let i = 0; i < options.length; i++) {
            this.$("select").append("<option value='" + options[i].id + "'>" + options[i].name + "</option>");
        }
    },

    setValue: function (val) {
        this.$('select').val(val);
    },

    getValue: function () {
        var name = this.name;
        var value = this.$('select').val();
        return value;
    },

    getName: function () {
        return this.name;
    },

    refresh: function () {
        this.$el.empty();
        this.render();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _) {const htmlTpl = __webpack_require__(99);
/*
批量操作组件
 */
module.exports = Backbone.View.extend({
    tagName: "div",

    className: "batchElement",

    events: {
        "click a": "onClickA"
    },

    template: _.template(htmlTpl),

    initialize: function (param) {
        this.setParam(param);
    },

    render: function () {
        this.$el.append(this.template({
            options: this.options
        }));
        return this;
    },

    setParam: function (param) {
        this.options = param;
    },

    onClickA: function (e) {
        var type = this.$("select").val();
        var text = this.$("select option:selected").text();
        if (type != "") {
            var sure = window.confirm("确定批量执行 " + text + " 操作?");
            if (sure) {
                this.trigger("goBatch", type);
            }
        }
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAXCAMAAAA8w5+RAAABRFBMVEUAAADtydJde/tbevxaefytxv9bePvj7f/r0t7uytLuxc3l7v+OqP7k7P+Srf7v9P/f6f/t8/+cuf+kwP+owv+lwf9be/zo7v+lv/+HoP55lv1Zd/tqhvyTqf5befvF1v+Nqf5aefpohfx/nf5aePvk6//k7P92k/5bd/uXsv5Xdv5Jav1Yd/3n7f+btf9aePzm7f/p7P+Wtv/k6/9efv2fvP9aef1aef2Ys//j7P/l7P9YeP3u7v/t7v9bePtaePtbeftZd/vm7f9Xdvv///9cevvi/P9Tcvv5nZpVdftRcPttif1QcPtzjfxgfvvn/v/8/P/j9//v9P/r8P/k8P/d5P61wv2vvv2Vqf11kv1xjfxnhfxGaPvzsrX/p5r6lI/3+P+/4//G1v+jyP+7x/2Kn/yCmPxzkPxNbftLbPtJavpEZ/q2QyIXAAAAQHRSTlMA8fKELBj59fHx8fDSz7y2qql6YlREGRYMCPj08vHr5NjY1MvLycPBrKaalJOPj4qFeHVxcW5uX1tTSzcpKSYT8oPV3gAAASxJREFUGNNNjlVXAzEQhYfSUqMGpYK7uztJtrvLSt0d1///zkxOhe8hmXznzskFSex02THjmN24TMCACwfjjDGuZFam+m5UZT0UvT4JknPGZIyTNadl1jmPD1WxuW7ihsGDSVqWOfb+Vk2TNetRgIdVkq1aKpUqZwyMNvcB7sco+FNB+fTxhSMPJsApt1tVlMW0jbO+6EJJ2I1yLlfRObUYd0FsiaRqqGnLkKUyWwBwwCTcUORtNqj+Df40RDFwm4ryoePmZxSI5OZQ6tYE9NhWmUQlN2CnnzuGf+wqXOWmdTYQV2uhSHjuW7ethXAktH5NLh4QQhRE7bf5UijiGIijPBJ5TdOy2utzVkPy4gTgzl1qdx+RTofObrvkvoU94ff4RhCvl06fxy8O/wAAzFXSYamYsQAAAABJRU5ErkJggg=="

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"pageHead\">\r\n    <div class=\"phLeft\"><img src=\"" + __webpack_require__(10) + "\" alt=\"\">&nbsp&nbsp<span style=\"color:#9e9e9e;\">当前位置：</span>\r\n        <% _.each(titles,function(title,index){%>\r\n           <% if(titles.length-1 > index){ %>\r\n                <span><%=title%></span> >\r\n           <% }else{ %>\r\n                <span><%=title%></span>\r\n            <% } %>\r\n        <%})%>\r\n    </div>\r\n    <div class=\"phRight\">\r\n        <% if(back){%>\r\n            <a onClick=\"javascript :history.back(-1);\" href=\"javascript:void(0)\" class=\"btn btn-info back\">返回</a>\r\n        <% } %>\r\n    </div>\r\n</div>\r\n<div class=\"panel panel-default\">\r\n<div class=\"panel-body\">\r\n     <div class=\"control-group\" id=\"main\">\r\n\t</div>\r\n\t\r\n    <div class=\"op-container\">\r\n\t<button type=\"button\" id=\"confirm\" class=\"btn btn-primary btn-lg\">提&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp交</button>\r\n\t<button type=\"button\" id=\"clear\" class=\"btn btn-primary btn-lg\">重&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp置</button>\r\n\t<!-- <a href=\"<% if(back!='#'){%><%=back %><% }else{ %> javascript:void(0)<% } %>\" id=\"back\" class=\"btn btn-info btn-lg\">返&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp回</a> -->\r\n\t</div>\r\n</div>\r\n</div>";

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(63);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    events: {
        "click input[type='checkbox']": "onClickCheck"
    },

    initialize: function (param) {
        var param = param || {};
        this.setParam(param);
    },

    render: function () {
        this.$el.append(this.template({
            "title": this.title,
            "value": this.value,
            "options": this.options,
            "name": this.name,
            "msg": this.msg
        }));
        return this;
    },
    /**
     * 添加配置参数
     * @param {[string]} name    [控件识别名称]
     * @param {[object]} options [下拉控件参数]
     * e : {
     *    title : "a",
     *    value : "content",
     *    explain : "string",
     *    options : [{value:'',content:''}]
     *    name : "name"
     * }
     */
    setParam: function (param) {
        if (!param) {
            return;
        }
        this.title = param.title || "文本框"; //标题
        this.value = param.value || "1"; //输入框内值
        this.options = param.options || [{ value: "1", content: "内容1" }, { value: "2", content: "内容2" }]; //包含在组件中的checkbox
        this.name = param.name || ""; //该输入框绑定的传出参数名
        this.msg = param.msg || ""; //输入框注意事项
    },

    getValue: function () {
        return this.$('input[type="checkbox"]:checked').val();
    },

    setValue: function (val) {
        this.value = val;
        var me = this;
        this.$('input[type="checkbox"]').prop("checked", false);
        this.$('input[type="checkbox"]').each(function (index, e) {
            if (e.value == me.value) {
                $(e).prop("checked", true);
            }
        });
    },

    setName: function (name) {
        this.name = name;
    },

    getName: function () {
        return this.name;
    },

    onClickCheck: function (e) {
        e.stopPropagation();
        this.$('input[type="checkbox"]').prop("checked", false);
        $(e.target).prop("checked", true);
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(74);

/** 文件上传组件，尽量用原生js编写 */
module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    events: {
        "click #test": "onClickTest",
        "change input[type='file']": "onChangeFile",
        "click a[name='del']": "delImg"
    },

    initialize: function (param) {
        this.filesArray = [];
        this.fileChange = 0;
        this.fileLength = 0; //只能这样记录是否已有图片

        var param = param || {};
        this.setParam(param);
    },

    render: function () {
        this.$el.append(this.template({
            "title": this.title,
            "msg": this.msg
        }));
        return this;
    },
    /**
     * 设置组件参数
     */
    setParam: function (param) {
        this.title = param.title || "title";
        this.msg = param.msg || "";
    },

    /**
     * 获取文件对象
     * @return {[type]} [description]
     */
    getFiles: function () {
        return this.filesArray;
    },
    /**
     * 传入文件对象
     * @param {[type]} fileEl [description]
     */
    setFile: function (src) {
        if (src && src != "undefined" && src != "null") {
            var el = this.$el.find('.fileMsg');
            this.addImg(el, src);
            this.fileLength = 1;
        }
    },

    onClickTest: function (e) {
        // this.setFile(img);
        console.log(this.isChange());
    },

    onChangeFile: function (e) {
        var files = e.target.files;
        var me = this;

        if (me.filesArray.length >= 1 || this.fileLength == 1) {
            me.$('#msg').html('上传文件数不多于1.');
            return;
        }

        for (let i = 0; i < files.length; i++) {
            if (e.target.files.length == 0) {
                return this;
            }
            let file = files[i];
            let reader = new FileReader();
            reader.onload = function (e) {
                me.filesArray.push(file);
            }();
            reader.error = function (e) {
                console.log("读取异常");
            };
            reader.onloadstart = function () {
                console.log("开始读取...");
            };
            me.addImg(me.$el.find('.fileMsg'), window.URL.createObjectURL(file));
            this.fileChange = 1;
            this.fileLength = 1;
        }
    },

    addImg: function (ele, src) {
        var img = '<div><div><a name="del">删除</a></div><div><img style="max-width:180px;" src="' + src + '" alt="图片" class="img-rounded"></div></div>';
        ele.append(img);
        this.fileChange = 1;
    },

    delImg: function (e) {
        this.$("input[type=file]").val("");
        $(e.target).closest("div").parent("div").remove();
        this.filesArray = [];
        this.fileLength = 0;
        this.fileChange = 0;
    },

    isChange: function () {
        return this.fileChange;
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _) {const htmlTpl = __webpack_require__(65);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    initialize: function (param) {
        var param = param || {};
        this.setParam(param);
    },

    render: function () {
        this.$el.append(this.template({
            title: this.title,
            elDate: this.elDate,
            elTime: this.elTime,
            showTime: this.showTime,
            showDate: this.showDate
        }));
        return this;
    },

    setParam: function (param) {
        this.name = param.name || "datetime";
        this.title = param.title || '条件时间';
        this.elDate = param.date || this.getNowdate();
        this.elTime = param.time || "00:00";
        this.showTime = param.showTime || "hide";
        this.showDate = param.showDate || "show";
    },

    getNowdate: function () {
        var now = new Date();
        var result = "";
        var year = now.getFullYear();
        var month = now.getMonth() + 1 + "";
        if (month.length <= 1) {
            month = "0" + month;
        }
        var day = now.getDate() + "";
        if (day.length <= 1) {
            day = "0" + day;
        }
        return year + '-' + month + '-' + day;
    },

    getName: function () {
        return this.name;
    },

    getValue: function () {
        if (this.showTime == "show" && this.showDate == "show") {
            var date = this.$('input[name="date"]').val();
            var time = this.$('input[name="time"]').val();
            return date + ',' + time;
        }
        if (!(this.showTime == "show") && this.showDate == "show") {
            var date = this.$('input[name="date"]').val();
            return date;
        }
        if (this.showTime == "show" && !(this.showDate == "show")) {
            var time = this.$('input[name="time"]').val();
            return time;
        }
    },

    setValue: function (val) {
        if (this.showTime == "show") {
            this.$('input[name="time"]').val(val);
        } else {
            this.$('input[name="date"]').val(val);
        }
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _) {const htmlTpl = __webpack_require__(76);
__webpack_require__(77);
__webpack_require__(78);
__webpack_require__(79);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    initialize: function (param) {
        var param = param || {};
        this.setParam(param);
        this.listenTo(this, "renderFinish", this.initUeditor);
    },

    render: function () {
        this.$el.append(this.template({
            "title": this.title,
            "value": this.value,
            "allowEmpty": this.allowEmpty,
            "name": this.name,
            "msg": this.msg
        }));
        return this;
    },
    /**
     * 添加配置参数
     * @param {[string]} name    [控件识别名称]
     * @param {[object]} options [下拉控件参数]
     * e : {
     *    title : "a",
     *    value : "content",
     *    explain : "string",
     *    allowEmpty : true,
     *    name : "name"
     * }
     */
    setParam: function (param) {
        this.title = param.title || "富文本编辑"; //标题
        this.value = param.value || ""; //输入框内值
        this.allowEmpty = param.allowEmptytrue || true; //可否为空
        this.name = param.name || ""; //该输入框绑定的传出参数名
        this.msg = param.msg || ""; //输入框注意事项
    },
    /**
     * 初始化ueditor
     * @return {[type]} [description]
     */
    initUeditor: function () {
        var me = this;
        this.isReady = 0; //判断是否加载完成
        this.ueditor = new UE.ui.Editor();
        this.ueditor.render("uedit");

        this.ueditor.addListener('ready', function (editor) {
            me.ueditor.setContent(me.value);
            me.isReady = 1;
        });
    },

    getValue: function () {
        return this.ueditor.getContent();
    },

    setValue: function (val) {
        this.value = val || "请输入页面详情";
        if (this.isReady == 1) {
            this.ueditor.setContent(this.value);
        }
    },

    setName: function (name) {
        this.name = name;
    },

    getName: function () {
        return this.name;
    },

    delUeditor: function () {
        UE.delEditor('uedit');
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(22))(13);

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(22))(18);

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = {
    title: {
        left: '10%',
        show: true,
        text: '',
        textStyle: {
            fontFamily: 'Microsoft YaHei',
            fontSize: 24
        }
    },
    legend: {
        align: 'right',
        right: '10%',
        data: []
    },
    xAxis: {
        axisLabel: {
            rotate: 35
        },
        data: []
    },
    yAxis: {},
    label: {
        normal: {
            show: true,
            position: 'top',
            fontSize: 14,
            formatter: function (params) {
                if (params.value > 0) {
                    return params.value;
                } else {
                    return '';
                }
            }
        }
    },
    series: [{
        name: '',
        type: 'bar',
        barGap: '10%',
        barMaxWidth: 105,
        data: []
    }, {
        name: '',
        type: 'bar',
        barMaxWidth: 105,
        barGap: '10%',
        data: []
    }, {
        name: '',
        type: 'bar',
        barMaxWidth: 105,
        barGap: '10%',
        data: []
    }]
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(59);
const echarts = __webpack_require__(60);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "tempEc",

    template: _.template(htmlTpl),

    initialize: function () {
        this.option = null;
        this.listenTo(this, "renderFinish", this.renderEchart);
        this.listenTo(this, "dataReady", this.fillEchart);
    },

    render: function () {
        this.$el.append(this.template({
            id: this.ecid
        }));
        return this;
    },

    setParam: function (param) {
        this.ecid = param.id;
        this.url = param.url;
        this.dataParam = param.dataParam;
        this.title = param.title;
        this.legend = param.legend;
        this.xaxis = param.xaxis;
        this.ecSeries = param.ecSeries;
    },
    /**
     * 设置echarts图表option
     * @param {Object} option [echarts的option]
     */
    setEchartOption: function (option) {
        this.option = option;
    },

    renderEchart: function () {
        this.ec = echarts.init(document.getElementById(this.ecid));
        if (this.option) {
            this.option.title.text = this.title;
            this.option.legend.data = this.legend;
        }
        this.ec.setOption(this.option);

        this.queryData();
    },

    queryData: function () {
        var me = this;
        $.ajax({
            url: me.url,
            type: 'get',
            dataType: 'json',
            data: me.dataParam,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res);
                } else {
                    alert(res.msg);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillEchart: function (data) {
        var xaxis = this.xaxis;
        var serie = [];

        _.each(this.ecSeries, function (el, index) {
            var tempSerie = {};
            tempSerie.name = el.name;
            tempSerie.data = data[el.dataName];
            serie.push(tempSerie);
        });

        this.ec.setOption({
            xAxis: {
                data: data[xaxis]
            },
            series: serie
        });

        serie = null;
    },

    resizeEchart: function (width) {
        this.ec.resize({
            width: width,
            height: 'auto'
        });
    },

    freshEchart: function (param) {
        this.dataParam = param;
        this.queryData();
    },

    removeEl: function () {
        this.ec.dispose();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _) {const htmlTpl = __webpack_require__(66);

/** 文件上传组件，尽量用原生js编写 */
module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    events: {
        // "click #test": "onClickTest",
        "change input[type='file']": "onChangeFile"
    },

    initialize: function (param) {
        this.filesArray = [];

        var param = param || {};
        this.setParam(param);
    },

    render: function () {
        this.$el.append(this.template({
            "title": this.title,
            "msg": this.msg
        }));
        return this;
    },
    /**
     * 设置组件参数
     */
    setParam: function (param) {
        this.title = param.title || "title";
        this.msg = param.msg || "";
    },

    /**
     * 获取文件对象
     * @return {[type]} [description]
     */
    getFiles: function () {
        return this.filesArray;
    },
    /**
     * 传入文件对象
     * @param {[type]} fileEl [description]
     */
    setFile: function (fileEl) {},

    onClickTest: function (e) {
        // var file = document.getElementById('file');
        // var ee = new FormData();
        // for(var i=0 ; i < file.files.length;i++){
        //     // console.log(file.files[i]);
        //     ee.append('files',file.files[i]);    
        // }
        // ee.append("name","wange");
        // console.log(ee.getAll('name'));
        // console.log(ee.getAll("files_"));
        // // console.log(ee.get("name"));
        // console.log(ee)
        // this.getFiles();
        console.log(this.filesArray);
    },

    onChangeFile: function (e) {
        var files = e.target.files;
        var me = this;

        if (files.length > 5 - me.filesArray.length) {
            me.$('#msg').html('文件数量必须不多于5');
            return;
        }

        for (let i = 0; i < files.length; i++) {
            if (e.target.files.length == 0) {
                return this;
            }
            let file = files[i];
            let reader = new FileReader();
            reader.onload = function (e) {
                me.filesArray.push(file);
            }();
            reader.error = function (e) {
                console.log("读取异常");
            };
            reader.onloadstart = function () {
                console.log("开始读取...");
            };
            me.addImg(me.$el.find('.multFileMsg'), window.URL.createObjectURL(file));
        }
    },

    addImg: function (ele, src) {
        var img = '<div class="multFileView"><div><a name="del">删除</a></div><div><img style="max-width:150px;height:120px;" src="' + src + '" alt="图片" class="img-rounded"></div></div>';
        ele.append(img);
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = vendors_library;

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = bootstrap_library;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(16)(undefined);
// imports


// module
exports.push([module.i, "html,body{\r\n\twidth: 100%;\r\n\theight: 100%;\r\n\tfont-size: 16px;\r\n}\r\n.contain{\r\n\twidth:100%;\r\n\tmin-height: 100%;\r\n\tposition: absolute;\r\n}\r\n\r\n.main-header{\r\n\tdisplay: flex;\r\n\tjustify-content:flex-start;\r\n\talign-items: flex-end;\r\n\theight: 60px;\r\n\twidth: 100%;\r\n\tmin-width: 1350px;\r\n\tbackground: -webkit-linear-gradient(left, #41bce0 , #4679c8); /* Safari 5.1 - 6.0 */\r\n    background: -o-linear-gradient(right, #41bce0 , #4679c8); /* Opera 11.1 - 12.0 */\r\n    background: -moz-linear-gradient(right, #41bce0 , #4679c8); /* Firefox 3.6 - 15 */\r\n    background: linear-gradient(to right, #41bce0 , #4679c8); /* 标准的语法（必须放在最后） */\r\n\tposition: absolute;\r\n\tz-index: 1001;\r\n}\r\n\r\n.headItem {\r\n\tpadding : 0 50px 8px 50px;\r\n}\r\n\r\n.head-item-quit{\r\n\tmargin-left: auto;\r\n\tfont-size: 22px;\r\n\tcolor : #000000;\r\n}\r\n\r\n.head-item-quit a{\r\n\tcolor:#f9f9f9;\r\n\tpadding-left: 10px;\r\n\ttext-decoration:none;\r\n}\r\n\r\n.head-item-quit a:hover {\r\n\tcolor: #f26b3c;\r\n}\r\n\r\n.head-item-quit img{\r\n\tmargin-bottom: 10px;\r\n}\r\n\r\n.head-item-title {\r\n\tcolor: #fff;\r\n\tfont-size: 30px;\r\n}\r\n\r\n\r\n.wrapper{\r\n\tbackground-color: #f7f7f7;\r\n\twidth: 100%;\r\n\tmin-height: 100% ;\r\n\tmin-width: 1350px;\r\n\tposition: absolute;\r\n\ttop: 0;\r\n\toverflow: hidden;\r\n\tz-index: 990;\r\n}\r\n.main-sidebar{\r\n\tposition: absolute;\r\n\twidth: 230px;\r\n\theight: 100%;\r\n\tpadding-top: 60px;\r\n\tbackground-color: #222d32;\r\n\toverflow:auto;\r\n}\r\n\r\n\r\n.main-sidebar #accordion>h3{\r\n\tpadding-top: 9px;\r\n\tpadding-bottom: 9px;\r\n\tpadding-left: 40px;\r\n\tborder: none;\r\n\tmargin: 0;\r\n\tfont-size: 18px;\r\n\tline-height: 45px;\r\n\tcolor: #b8c7ce;\r\n\tbackground-color: #222d32;\r\n\tcursor: pointer;\r\n}\r\n\r\n.main-sidebar #accordion>h3>span{\r\n\tpadding-left: 20px;\r\n}\r\n\r\n.main-sidebar #accordion>h3>img{\r\n\twidth: 26px;\r\n\tpadding-bottom: 5px;\r\n\topacity:0.5;\r\n}\r\n\r\n.main-sidebar #accordion>h3:hover{\r\n\tcolor: #fff;\r\n\tbackground-color: #1e282c;\r\n}\r\n\r\n.main-sidebar #accordion>h3:hover img{\r\n\topacity:1;\r\n}\r\n\r\n.main-sidebar #accordion .panel-body{\r\n\tdisplay: none;\r\n\tborder: none;\r\n\tbackground-color: #2c3b41;\r\n\tpadding: 0;\r\n\tmargin: 0;\r\n}\r\n\r\n\r\n.main-sidebar #accordion .panel-body.active{\r\n\tdisplay: block;\r\n\tborder: none;\r\n\tbackground-color: #2c3b41;\r\n\tpadding: 0;\r\n\tmargin: 0;\r\n}\r\n\r\n.main-sidebar #accordion .panel-body li a{\r\n\tdisplay: block;\r\n\tline-height: 30px;\r\n\tpadding-left: 70px;\r\n\tpadding-top:6px;\r\n\tpadding-bottom: 6px;\r\n\tfont-size: 16px;\r\n\ttext-decoration: none;\r\n\tcolor: #6e7d8b;\r\n\t-webkit-transition-property: padding-left,background-color;\r\n    -webkit-transition-duration: 0.4s;\r\n    -webkit-transition-timing-function: ease;\r\n}\r\n.main-sidebar #accordion .panel-body li a:hover{\r\n\tcolor: #4db9d1;\r\n\tpadding-left: 80px;\r\n\tbackground-color: #305365;\r\n}\r\n\r\n.main-sidebar #accordion .panel-body li a.active{\r\n\tcolor: #4db9d1;\r\n}\r\n.main-sidebar #accordion>h3.active{\r\n\tbackground-color: #1e282c;\r\n\tcolor: #fffbf8;\r\n}\r\n\r\n.content-wrapper{\r\n\twidth: 100%;\r\n\theight: 100%;\r\n\tpadding-left: 245px;\r\n\tpadding-top: 70px;\r\n\tpadding-bottom: 10px;\r\n\tpadding-right: 15px;\r\n\tbackground-color: #f7f7f7;\r\n\t/*c :1280px;*/\r\n}\r\n\r\n.content{\r\n\tpadding-top: 10px;\r\n}\r\n\r\n.btn{\r\n\tborder-radius: 2px;\r\n}\r\n\r\n.btn-danger,.btn-info{\r\n\tbackground-color: #4679c8;\r\n\tborder-color: #4679c8;\r\n}\r\n\r\n.searchBtn{\r\n\tmargin-right: 20px;\r\n\twidth: 100px;\r\n\theight: 35px;\r\n\tfont-size: 16px;\r\n\t/*background-image:url(../image/exit@2x.png);*/\r\n}\r\n\r\n#search,#cont,#batch,#pg {\r\n\tpadding : 0 50px 0;\r\n}\r\n\r\n.search{\r\n\tfont-size:16px;\r\n\tdisplay: flex;\r\n\talign-items: center;\r\n\t/*padding:0 1rem;*/\r\n}\r\n\r\n.schOpration {\r\n\tdisplay: flex;\r\n\talign-items: center;\r\n}\r\n\r\n.schItem {\r\n\tdisplay: flex;\r\n\talign-items: center;\r\n\tflex-wrap : wrap;\r\n}\r\n\r\n.schText {\r\n\tmin-width: 310px;\r\n\tmargin : 5px 0;\r\n}\r\n\r\n.schText span {\r\n\tfont-size: 20px;\r\n}\r\n\r\n.schText input{\r\n\tborder: 1px solid #cccccc;\r\n\tpadding : 4px 10px;\r\n\tmargin-left: 20px;\r\n\tmargin-right: 20px;\r\n\tbackground-color: #f9f9f9;\r\n\twidth: 190px;\r\n}\r\n\r\n::-webkit-input-placeholder { /* WebKit browsers */\r\n    color:#cccccc;\r\n    font-size: 16px;\r\n}\r\n:-moz-placeholder { /* Mozilla Firefox 4 to 18 */\r\n    color: #cccccc;\r\n    font-size: 16px;\r\n}\r\n::-moz-placeholder { /* Mozilla Firefox 19+ */\r\n    color: #cccccc;\r\n    font-size: 16px;\r\n}\r\n:-ms-input-placeholder { /* Internet Explorer 10+ */\r\n    color: #cccccc;\r\n    font-size: 16px;\r\n}\r\n\r\n.schSelect {\r\n\tmin-width: 230px;\r\n\tmargin : 5px 0;\r\n}\r\n\r\n.schSelect span {\r\n\tfont-size: 20px;\r\n}\r\n\r\n.schSelect select {\r\n\twidth: 120px;\r\n\tbackground-color: #f9f9f9;\r\n\tpadding : 4px 10px;\r\n\tborder: 1px solid #cccccc;\r\n\tmargin-left: 15px;\r\n\theight : 32px;\r\n}\r\n\r\n.schDate {\r\n\tmin-width: 490px;\r\n}\r\n\r\n.schDate span {\r\n\tfont-size: 20px;\r\n}\r\n\r\n.schDate>input {\r\n\tpadding : 4px 20px;\r\n\tborder: 1px solid #cccccc;\r\n\tbackground-color: #f9f9f9;\r\n\twidth: 150px;\r\n\tfont-size: 16px;\r\n\tmargin : 0px 15px;\r\n}\r\n\r\n.schDate input[type=\"date\"]::-webkit-clear-button{\r\n   display:none;\r\n}\r\n\r\n.schDate input[type=\"date\"]::-webkit-inner-spin-button{\r\n   display:none;\r\n}\r\n\r\n.schDate input[type=\"time\"]::-webkit-clear-button{\r\n   display:none;\r\n}\r\n\r\n.schDate input[type=\"time\"]::-webkit-inner-spin-button{\r\n   display:none;\r\n}\r\n\r\n.pagination{\r\n\tmargin: 0 0 0 0;\r\n}\r\n\r\n.table tbody tr td{\r\n    vertical-align: middle;\r\n    font-size : 16px;\r\n    border-color: #c8c8c8;\r\n}\r\n\r\n.table thead tr th{\r\n\tbackground-color: #3fbde0;\r\n\tfont-weight: normal;\r\n\ttext-align: center;\r\n    vertical-align: middle;\r\n    font-size : 16px;\r\n    border:none;\r\n    color:#ffffff;\r\n}\r\n\r\n.table tbody a:hover {\r\n\tcolor : #f26b3c;\r\n}\r\n\r\n.btn-group-xs>.btn, .btn-xs{\r\n\tfont-size: 16px;\r\n}\r\n\r\n.showValue {\r\n\tdisplay: inline-block;\r\n\tpadding-left: 5px;\r\n}\r\n/*\r\n颜色选取\r\n */\r\n.showValue .valueText{\r\n\twidth : 90px;\r\n}\r\n\r\n.checkEle {\r\n\tborder-radius : 2px;\r\n\tmargin: 2px 5px;\r\n\tpadding : 2px 6px;\r\n\tdisplay: inline-block;\r\n\tborder-right:2px solid red;\r\n}\r\n\r\n.checkEle.active {\r\n\tborder-right:2px solid green;\r\n}\r\n\r\nlabel {\r\n\tfont-size: 17px;\r\n\tfont-weight:normal;\r\n}\r\n\r\ninput[type=\"checkbox\"] {\r\n\tmargin-right: 5px;\r\n}\r\n\r\n.pageHead {\r\n\tdisplay: flex;\r\n\tjustify-content: space-between;\r\n\talign-items: center;\r\n\tborder:1px solid #eeeeee;\r\n\theight: 55px;\r\n\twidth:100%;\r\n\tmargin-bottom: 10px;\r\n\tborder-radius : 4px;\r\n\tbackground-color: #fff;\r\n}\r\n\r\n.phLeft {\r\n\tmargin-left:  30px;\r\n }\r\n\r\n.phLeft span{\r\n\tdisplay: inline-block;\r\n\tcolor :#6c6c6c;\r\n\tpadding-top: 10px;\r\n \tpadding-left: 5px;\r\n \tpadding-right: 5px;\r\n \tfont-size: 20px;\r\n}\r\n\r\n.phLeft img{\r\n\tdisplay: inline-block;\r\n \tpadding-left: 10px;\r\n \tpadding-bottom: 10px;\r\n}\r\n\r\n.phRight{\r\n \tmargin-right: 50px;\r\n}\r\n\r\n.phRight a{\r\n\tfont-size: 16px;\r\n\twidth: 100px;\r\n\theight: 35px;\r\n}\r\n\r\n.phRight a img{\r\n\tmargin-right: 10px;\r\n}\r\n\r\n.op-container {\r\n\tmargin-left : 328px;\r\n}\r\n\r\n.pagecomp {\r\n\tdisplay: inline-block;\r\n}\r\n\r\n.pagination {\r\n\tmargin : 5px 0 0 0 ;\r\n}\r\n\r\n.batchElement .batchTitle {\r\n\tpadding-bottom: 5px;\r\n\tfont-size: 18px;\r\n}\r\n\r\n.batchElement select {\r\n\tappearance:none;   \r\n  \t-moz-appearance:none;   \r\n  \t-webkit-appearance:none;\r\n  \t background: url(" + __webpack_require__(24) + ") no-repeat scroll right 10px center transparent;\r\n  \t padding-right: 31px;\r\n  \t margin-left:15px;\r\n\tborder: 1px solid #d2d2d2;\r\n\tpadding : 4px 10px;\r\n\tbackground-color: #f9f9f9;\r\n\twidth: 150px;\r\n\theight: 30px;\r\n\tborder-radius: 2px;\r\n\tfont-size: 16px;\r\n}\r\n\r\n.batchElement a {\r\n\tdisplay: inline-block;\r\n\tborder: 1px solid #d2d2d2;\r\n\twidth : 60px;\r\n\theight: 30px;\r\n\tborder-radius: 2px;\r\n\tpadding :4px 8px;\r\n\tfont-size: 16px;\r\n\tcolor : #000000;\r\n\tbackground-color: #ffffff;\r\n\tvertical-align: top;\r\n\ttext-align: center;\r\n\ttext-decoration:none;\r\n}\r\n\r\n.batchElement a:hover {\r\n\tbackground-color: #f9f9f9;\r\n}", ""]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAJCAYAAADdA2d2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYxOUY5NDJERkZFQjExRTc5MDBBOTRCQjY0NEI5MUU5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYxOUY5NDJFRkZFQjExRTc5MDBBOTRCQjY0NEI5MUU5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjE5Rjk0MkJGRkVCMTFFNzkwMEE5NEJCNjQ0QjkxRTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjE5Rjk0MkNGRkVCMTFFNzkwMEE5NEJCNjQ0QjkxRTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz67szxVAAAAnklEQVR42mI8c+ZMDgMDwwQgZmagHPwF4gImIDEFiP2A+AuFBoL0B4LMY4IKbANiWyB+QqaBT6D6N4M4TEgSF4DYHIjPk2ggSJ8FlGZANxQEngGxHcxGIsBmqAufIgsy4QmbCQQMnARVhxEXTHhisRCIc6FsdDmQeD4WObyGwgAoZfgC8WckX/hBxXECJiLCbTs0nE9Aw28bIQ0AAQYAYl8jSpIP+GAAAAAASUVORK5CYII="

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(16)(undefined);
// imports


// module
exports.push([module.i, "/**\r\n * 一般表单元素样式\r\n */\r\n.formElement {\r\n\tmargin-bottom: 35px;\r\n}\r\n\r\n.formElement span[class=formTitle] {\r\n\tdisplay:inline-block;\r\n\twidth:300px;\r\n\ttext-align: right;\r\n\tfont-size: 20px;\r\n}\r\n\r\n.formElement span[class=formError] {\r\n\t/*display:inline-block;*/\r\n\tcolor: rgb(212, 43, 50); \r\n\tfont-size: 15px;\r\n\tdisplay:none;\r\n\tpadding-left: 15px;\r\n}\r\n\r\n.formElement .form-msg {\r\n\tposition: absolute;\r\n\tmargin-left : 330px;\r\n\tpadding-top: 5px;\r\n\tfont-size: 15px;\r\n\tcolor : #9e9e9e;\r\n}\r\n\r\n.formElement>input[type=text]:not(.colorText),.formElement>input[type=date],.formElement>input[type=time],.formElement>select {\r\n\tmargin-left:27px;\r\n\tborder: 1px solid #d2d2d2;\r\n\tpadding : 4px 10px;\r\n\tbackground-color: #f9f9f9;\r\n\twidth: 300px;\r\n\theight: 44px;\r\n\tborder-radius: 4px;\r\n\tfont-size: 18px;\r\n}\r\n\r\n/*\r\ncheckbox多选框组件\r\n */\r\n.formElement>label {\r\n\tmargin-left : 27px;\r\n}\r\n\r\n.formElement input[type=checkbox] {\r\n\theight: 18px;\r\n\twidth : 20px;\r\n\tborder-radius: 8px;\r\n}\r\n\r\n/*\r\ncolor颜色组件\r\n */\r\n\r\n.formElement input[type=color] {\r\n\tmargin-left:27px;\r\n\tmargin-top\r\n\tborder: 1px solid #d2d2d2;\r\n\tbackground-color: #f9f9f9;\r\n\twidth: 80px;\r\n\theight: 29px;\r\n\tborder-radius: 3px;\r\n}\r\n\r\n.formElement input.colorText {\r\n\tmargin-left:20px;\r\n\tmargin-top:-5px;\r\n\tborder: 1px solid #d2d2d2;\r\n\tpadding : 4px 10px;\r\n\tbackground-color: #f9f9f9;\r\n\twidth: 200px;\r\n\theight: 34px;\r\n\tborder-radius: 2px;\r\n\tfont-size: 18px;\r\n}\r\n\r\n.formElement input[type=date]::-webkit-clear-button{\r\n   display:none;\r\n}\r\n\r\n.formElement select {\r\n\tappearance:none;   \r\n  \t-moz-appearance:none;   \r\n  \t-webkit-appearance:none;\r\n  \t background: url(" + __webpack_require__(24) + ") no-repeat scroll right 10px center transparent;\r\n  \t padding-right: 31px;\r\n}\r\n\r\n.formElement>input[type=file]{\r\n\tdisplay: inline-block;\r\n\tmargin-left:27px;\r\n\tfont-size: 16px;\r\n}\r\n\r\n.formElement .fileMsg {\r\n\tmargin-left : 330px;\r\n\tpadding-top: 5px;\r\n\tfont-size: 15px;\r\n}\r\n\r\n.formElement .multFileMsg {\r\n\tmargin-left : 330px;\r\n\tpadding-top: 5px;\r\n\tfont-size: 15px;\r\n}\r\n\r\n.formElement .multFileView {\r\n\tdisplay: inline-block;\r\n\tvertical-align: top\r\n}\r\n\r\n.formElement #msg {\r\n\tmargin-left : 330px;\r\n\tpadding-top: 5px;\r\n\tfont-size: 15px;\r\n\tcolor : #f00006;\r\n}\r\n\r\n.formElement>.ueditorWindow {\r\n\tmargin-left : 190px;\r\n\tmargin-top : 15px;\r\n}\r\n\r\n/*\r\n地图组件样式\r\n */\r\n.formElement>.mapContainer{\r\n\tdisplay: inline-block;\r\n\tmargin-left:27px;\r\n\tvertical-align: top;\r\n}\r\n\r\n.formElement>.mapContainer span{\r\n\tpadding: 5px 0;\r\n\tfont-size: 17px;\r\n\tcolor : #9e9e9e;\r\n}\r\n.formElement>.mapContainer input[type=text]{\r\n\tborder: 1px solid #d2d2d2;\r\n\tpadding : 4px 10px;\r\n\tbackground-color: #f9f9f9;\r\n\twidth: 199px;\r\n}\r\n.formElement>.mapContainer a{\r\n\tfont-size: 17px;\r\n}\r\n\r\n/*\r\n一般性的文字显示组件\r\n */\r\n.formElement .detail_content {\r\n\tdisplay: inline-block;\r\n\tmargin-left:27px;\r\n\tfont-size: 20px;\r\n}", ""]);

// exports


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(64);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    events: {
        "change input[type='color']": "onChangeColor",
        "input input[type='text']": "onTextInput"
    },

    initialize: function (param) {
        var param = param || {};
        this.setParam(param);
    },

    render: function () {
        this.$el.append(this.template({
            "title": this.title,
            "value": this.value,
            "allowEmpty": this.allowEmpty,
            "name": this.name,
            "msg": this.msg
        }));
        this.showValue();
        return this;
    },
    /**
     * 添加配置参数
     * @param {[string]} name    [控件识别名称]
     * @param {[object]} options [下拉控件参数]
     * e : {
     *    title : "a",
     *    value : "content",
     *    name : "name"
     * }
     */
    setParam: function (param) {
        if (!param) {
            return;
        }
        this.title = param.title || "文本框"; //标题
        this.value = param.value || "#ff3e43"; //输入框内值
        this.allowEmpty = param.allowEmptytrue || true; //可否为空
        this.name = param.name || ""; //该输入框绑定的传出参数名
        this.msg = param.msg || ""; //输入框注意事项
    },

    getValue: function () {
        return this.$('input[type="color"]').val();
    },

    setValue: function (val) {
        if (!val) {
            return;
        }
        this.value = val;
        this.$('input[type="color"]').val(val);
        this.showValue();
    },
    /**
     * 在文本框中显示选中颜色的rbg值
     */
    showValue: function () {
        var value = this.getValue();
        this.$("input[type='text']").val(value);
    },

    getName: function () {
        return this.name;
    },

    onChangeColor: function (e) {
        var color = $(e.target).val();
        this.$("input[type='text']").val(color);
    },

    onTextInput: function (e) {
        var value = $(e.target).val();
        var pattern = /^#([a-fA-F0-9]{6})$/;
        if (pattern.test(value)) {
            this.setValue(value);
        }
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(68);
__webpack_require__(69);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    events: {
        "click li": "clickOption",
        "click input[type='text']": "clickText",
        "click a[name='sure']": "clickOk",
        "click a[name='all']": "clickAll"
    },

    template: _.template(htmlTpl),

    initialize: function (param) {
        var param = param || {};
        this.setParam(param);
    },

    render: function () {
        this.$el.append(this.template({
            name: this.name,
            title: this.title
        }));
        return this;
    },
    /**
     * 添加配置参数
     * @param {[string]} name    [控件识别名称]
     * @param {[object]} options [下拉控件参数]
     * e : {
     *    name : "name",
     *    titile : "title",
     *    options : [{value:'value',content:'content'}]
     * }
     */
    setParam: function (param) {
        if (!param) {
            return;
        }
        this.options = param.options || [];
        this.name = param.name || "";
        this.title = param.title || "";
    },

    /**
     * 填充多选框里的选项
     * @param {Array} options [选项为数组，元素格式为 {content : "demo", value: "1"}]
     */
    setOptions: function (options) {
        var templateOption = _.template("<% _.each(ops,function(op,index){ %>" + "<li><input type='checkbox' value='<%=op.value %>'><span><%=op.content %></span></li><% }) %>");
        this.$('.multselectOp').empty().append(templateOption({
            ops: options
        }));
    },

    setValue: function (arrayData) {
        this.$("input[type='checkbox']").each(function (index, el) {
            console.log($(el).val());
            for (let i = 0, len = arrayData.length; i < len; i++) {
                if ($(el).val() == arrayData[i]) {
                    $(el).prop("checked", true);
                }
            }
        });
        this.$("input[type='text']").val(this.getText());
    },
    /**
     * 获取选取目标的value值
     * @return {String} [获取的值用','分割]
     */
    getValue: function () {
        var result = [];
        this.$("input[type='checkbox']:checked").each(function (index, el) {
            result.push($(el).val());
        });
        return result.join(",");
    },
    /**
     * 获取选取目标的文本内容
     * @return {String} [获取的值用','分割]
     */
    getText: function () {
        var result = [];
        this.$("input[type='checkbox']:checked").each(function (index, el) {
            result.push($(el).closest("li").find("span").text());
        });
        return result.join(",");
    },

    clickText: function (e) {
        this.$(".muti").show();
    },

    clickOption: function (e) {
        var $el = $(e.target);
        if (e.target.nodeName == "LI") {
            var $temp = $el.find("input[type='checkbox']");
            $temp.prop("checked") ? $temp.prop("checked", false) : $temp.prop("checked", true);
        } else if (e.target.nodeName == "SPAN") {
            var $temp = $el.closest("li").find("input[type='checkbox']");
            $temp.prop("checked") ? $temp.prop("checked", false) : $temp.prop("checked", true);
        }
        this.$("input[type='text']").val(this.getText());
    },

    clickOk: function (e) {
        this.$(".muti").hide();
    },

    clickAll: function (e) {
        if (this.$("input[type='checkbox']:not(:checked)").size() > 0) {
            this.$("input[type='checkbox']").prop("checked", true);
        } else {
            this.$("input[type='checkbox']").prop("checked", false);
        }
        this.$("input[type='text']").val(this.getText());
    },

    getName: function () {
        return this.name;
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(16)(undefined);
// imports


// module
exports.push([module.i, ".multselect {\r\n\tdisplay: inline-block;\r\n\twidth: 180px;\r\n\tmargin-left: 27px;\r\n}\r\n\r\n.multselectText input{\r\n\twidth: 180px;\r\n\theight: 30px;\r\n\tborder: 1px solid #d2d2d2;\r\n\tpadding : 4px 30px 4px 10px;\r\n\tbackground-color: #f9f9f9;\r\n\tbackground: url(" + __webpack_require__(24) + ") no-repeat scroll right 10px center transparent;\r\n}\r\n\r\n.multselectBtn {\r\n\tbackground-color: #FFFFF0;\r\n    position: absolute;\r\n    z-index: 999;\r\n    margin-top: 150px;\r\n    width: 180px;\r\n    height: 30px;\r\n    border: 0.5px solid rgb(222, 219, 219);\r\n}\r\n\r\n.multselectBtn a{\r\n\tmargin-top: 1px\r\n}\r\n\r\n.multselectOp {\r\n\tposition: absolute;\r\n\tz-index: 999;\r\n\toverflow-y:auto;\r\n\tbackground-color: #fff;\r\n\twidth: 180px;\r\n\theight: 150px;\r\n\tborder: 0.5px solid rgb(222, 219, 219);\r\n\toverflow-x:hidden;\r\n}\r\n\r\n.multselectOp li {\r\n\tlist-style-type:none;\r\n\tpadding : 2px 5px;\r\n\tfont-size: 16px;\r\n}\r\n\r\n.multselectOp li:hover{\r\n\tbackground-color:#6e7d8b;\r\n}\r\n\r\n.multselectOp li span {\r\n\tmargin-left : 10px;\r\n}\r\n\r\n.link {\r\n\ttext-decoration: none;\r\n\ttext-align: center;\r\n\tcolor: #33b7dd;\r\n\tfloat: left;\r\n\twidth: 30%;\r\n\tfont-size: 15px;\r\n\tmargin-top: 10px;\r\n}\r\n\r\n.muti {\r\n\tdisplay: flex;\r\n\tdisplay: none;\r\n\tflex-direction: column;\r\n}", ""]);

// exports


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = ueditor_library;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _) {const htmlTpl = __webpack_require__(80);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "schSelect",

    template: _.template(htmlTpl),

    initialize: function (param) {
        var param = param || {};
        this.setParam(param);
    },

    render: function () {
        this.$el.append(this.template({
            options: this.options,
            name: this.name,
            title: this.title,
            defaultTitle: this.defaultTitle
        }));
        return this;
    },
    /**
     * 添加配置参数
     * @param {[string]} name    [控件识别名称]
     * @param {[object]} options [下拉控件参数]
     * e : {
     *    name : "name",
     *    titile : "title",
     *    options : [{value:'value',content:'content'}]
     * }
     */
    setParam: function (param) {
        if (!param) {
            return;
        }
        this.defaultTitle = param.defaultTitle || "请选择";
        this.options = param.options || [];
        this.name = param.name || "";
        this.title = param.title || "默认标题";
    },

    setValue: function () {},

    getValue: function () {
        var name = this.name;
        var value = this.$('select').val();
        return value;
    },

    setOptions: function (options) {
        var me = this;
        this.$("select").empty();
        this.$("select").append("<option value=''>" + me.defaultTitle + "</option>");
        for (let i = 0; i < options.length; i++) {
            this.$("select").append("<option value='" + options[i].id + "'>" + options[i].name + "</option>");
        }
    },

    getName: function () {
        return this.name;
    },

    showOption: function (val) {
        this.$("select").val(val);
    },

    refresh: function () {
        this.$el.empty();
        this.render();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(32);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(17)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(32, function() {
			var newContent = __webpack_require__(32);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(16)(undefined);
// imports


// module
exports.push([module.i, ".vtContainer {\r\n\tdisplay:flex;\r\n\tflex-direction : column;\r\n}\r\n\r\n.vtContainer .vtBigTitle {\r\n\tfont-size : 28px;\r\n\tmargin-left : 8%;\r\n\tfont-weight:bold;\r\n}\r\n\r\n.vtContainer .vtBox {\r\n\tdisplay: flex;\r\n\tmargin: 0 5%;\r\n\r\n}\r\n\r\n.vtContainer .vtBox .vt{\r\n\tdisplay: flex;\r\n\talign-items: flex-end;\r\n\tmargin : 8px 0;\t\r\n}\r\n\r\n.vtContainer .vtBox .left {\r\n\twidth : 40%;\r\n}\r\n\r\n.vtContainer .vtBox .right {\r\n\twidth : 40%;\r\n}\r\n\r\n.vtContainer .vtBox .vtTablehead {\r\n\tfont-size: 22px;\r\n\tjustify-content:space-around;\r\n\twidth:85%;\r\n}\r\n\r\n.vtContainer .vtBox .vtTable {\r\n\tfont-size: 19px;\r\n\tjustify-content:space-around;\r\n\twidth:85%;\r\n}\r\n\r\n.vtContainer .vtBox .vtTable div{\r\n\tpadding-right: 24px;\r\n}\r\n\r\n\r\n.vtContainer .vtBox .vt .vtSmallTitle{\r\n\ttext-align: right;\r\n\twidth : 40%;\r\n\tmin-width: 250px;\r\n\tfont-size : 23px;\r\n\tpadding :0 20px 0 0;\r\n\tmargin-left: 30px;\r\n}\r\n\r\n.vtContainer .vtBox .vt .vtcontent {\r\n\tfont-size : 19px;\r\n\t/*padding :0 5px 0 5px;*/\r\n\tmin-width: 270px;\r\n\t/*word-wrap: break-word;*/\r\n\t/*overflow : hidden;\r\n\ttext-overflow: ellipsis;*/\r\n}\r\n\r\n@media screen and (max-width: 1600px) {\r\n\t.vtContainer .vtBox .left {\r\n\t\twidth : 45%;\r\n\t}\r\n\r\n\t.vtContainer .vtBox .right {\r\n\t\twidth : 30%;\r\n\t}\r\n}", ""]);

// exports


/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = "<div class=\"panel-body\">\r\n\t\t<div class=\"row\">\r\n\t\t\t<div class=\"col-md-12\" id=\"search\"></div>\r\n\t\t</div>\r\n\t\t<hr>\r\n\t\t<div class=\"row\">\r\n\t\t\t<div id=\"cont\" class=\"col-md-12\"></div>\r\n\t\t</div>\r\n</div>";

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, $) {__webpack_require__(55);
__webpack_require__(56);
__webpack_require__(57);

// const defaultPage = require("Component/pageComponent.js");
const router = __webpack_require__(35);
const siderbar = __webpack_require__(46);
const headmenu = __webpack_require__(45);

var app = Backbone.View.extend({
    initialize: function (router) {
        this.currentView = null;
        this.routeEl = router;
        this.init();
        this.render();
    },

    render: function () {
        $('#siderbar').html(this.siderbar.el);
        $('#head').html(this.headmenu.render().el);
    },

    init: function () {

        this.key = window.localStorage.getItem("kzicar_key");
        this.isLogin(this.key);
        /*
        监听登陆状态
         */
        this.listenTo(this, "noLogin", this.loginOut);
        /*
        配置路由
         */
        this.listenTo(this.routeEl, "routerChange", this.onChangeRoute);
        this.listenTo(this.routeEl, "routerChangeWithCode", this.onChangeRouteWithCode);
        this.listenTo(this.routeEl, "routerOrderList", this.onChangeRouterOrderList);
        this.listenTo(this.routeEl, "routerWrong", this.wrongRoute);

        /*
        左侧菜单栏
         */
        this.siderbar = new siderbar();

        this.headmenu = new headmenu();
    },

    /**
     * 路由转换的时候渲染相关模块
     * @param  {Backbone.View} component [路由给出的视图控件]
     */
    onChangeRoute: function (component, url) {
        this.siderbar.showCurrentOption(url);
        if (this.currentView) {
            this.currentView.remove();
            this.currentView = null;
        }
        var tempView = new component(this.key);
        tempView.render();
        $('#container').append(tempView.el);
        tempView.trigger("renderFinish"); //触发渲染完成事件，对于第三方组件有用
        this.currentView = tempView;
    },

    /**
     * 渲染带参数的路由
     * @param  {Backbone.View} component [路由给出的视图控件]
     * @param  {string} code      [传入的参数，一般是某ID]
     */
    onChangeRouteWithCode: function (component, code, upUrl, url) {
        this.siderbar.showCurrentOption(url);
        if (this.currentView) {
            this.currentView.remove();
            this.currentView = null;
        }
        var tempView = new component(code, upUrl, this.key);
        tempView.render();
        $('#container').append(tempView.el);
        tempView.trigger("renderFinish"); //触发渲染完成事件，对于第三方组件有用
        this.currentView = tempView;
    },

    /**
     * [onChangeRo]
     * @param  {[type]} component [description]
     * @param  {[type]} code      [description]
     * @param  {[type]} upUrl     [description]
     * @return {[type]}           [description]
     */
    onChangeRouterOrderList: function (component, code, upUrl) {
        if (this.currentView) {
            this.currentView.remove();
            this.currentView = null;
        }
        var tempView = new component(this.key, code, upUrl);
        tempView.render();
        $('#container').append(tempView.el);
        this.currentView = tempView;
    },

    /**
     * 程序出现错误展现的页面
     * @param  {[type]} component [description]
     */
    wrongRoute: function (url) {
        console.error('发生错误' + url);
    },

    /**
     * 验证登陆状态
     * @type {[type]}
     */
    isLogin: function (key) {
        if (!key) {
            this.trigger('noLogin', "请先登陆");
        }
        $.ajax({
            url: 'https://www.kziche.com/admin/Member/isLogin',
            type: 'get',
            dataType: 'json',
            data: {
                key: key
            },
            success: function (res) {
                if (res.code == 200) {
                    // this.trigger('dataReady', res.data);
                } else {
                    this.trigger('noLogin', res.msg);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    /**
     * 验证失败弹出至登陆页
     * @param  {[type]} msg [失败信息]
     * @return {[type]}     [description]
     */
    loginOut: function (msg) {
        alert("请重新登录");
        window.location.href = "../public/login.html";
    }
});

var routeEl = new router();
new app(routeEl);
Backbone.history.start(); //开启路由
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(2)))

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone) {module.exports = Backbone.Router.extend({
	initialize: function (e) {
		this.upUrl = ""; //上一级页面路径，用于表单的返回路径
	},

	routes: {
		"": "default",
		"views/order/orderList/code:p": "changeToOrderList",
		":route/:route/:route/:route/code:p": "changeUrlWithCode", //用于匹配带参数的路径
		":route/:route/:route/:route": "changeUrlWithCode", //用于匹配不带参数的表单路径
		"*param": "changeUrl"
	},

	default: function () {
		var defaultPage = "views/member/memberList";
		this.changeUrl(defaultPage);
	},

	changeUrl: function (param) {
		this.upUrl = param;
		var compUrl = param || "views/member/memberList";
		try {
			var tempComponent = __webpack_require__(36)("./" + compUrl + ".js");
			this.trigger("routerChange", tempComponent, compUrl);
		} catch (err) {
			console.error(err);
			this.trigger("routerWrong", compUrl);
		}
	},

	changeUrlWithCode: function (route1, route2, route3, route4, code) {
		var code = code || null;
		var upUrl = "#" + this.upUrl;
		var url = route1 + '/' + route2 + '/' + route3 + '/' + route4;
		try {
			var tempComponent = __webpack_require__(36)("./" + url + ".js");
			this.trigger("routerChangeWithCode", tempComponent, code, upUrl, url);
		} catch (err) {
			console.error(err);
			this.trigger("routerWrong", url);
		}
	},

	changeToOrderList: function (code) {
		var code = code || null;
		var upUrl = "#" + this.upUrl;
		try {
			var tempComponent = __webpack_require__(50);
			this.trigger("routerOrderList", tempComponent, code, upUrl);
		} catch (err) {
			console.error(err);
			this.trigger("routerWrong");
		}
	}
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./component/echarts/barCardOption.js": 58,
	"./component/echarts/barMemberOption.js": 37,
	"./component/echarts/barOption.js": 18,
	"./component/echarts/tempEchart.js": 19,
	"./component/forform/tempArea.js": 38,
	"./component/forform/tempCheckbox.js": 12,
	"./component/forform/tempColor.js": 26,
	"./component/forform/tempDate.js": 14,
	"./component/forform/tempFile.js": 20,
	"./component/forform/tempMap.js": 40,
	"./component/forform/tempMultiSelect.js": 27,
	"./component/forform/tempPermission.js": 41,
	"./component/forform/tempSelect.js": 8,
	"./component/forform/tempShop.js": 42,
	"./component/forform/tempSingleFile.js": 13,
	"./component/forform/tempText.js": 7,
	"./component/forform/tempUeditor.js": 15,
	"./component/forsearch/select.js": 30,
	"./component/forsearch/tempdaterange.js": 43,
	"./component/forsearch/text.js": 44,
	"./component/headmenu.js": 45,
	"./component/module2.js": 85,
	"./component/siderbar.js": 46,
	"./component/tempBatch.js": 9,
	"./component/tempChargeRegular.js": 47,
	"./component/tempPage.js": 5,
	"./component/tempProClassfication.js": 48,
	"./component/tempSearch.js": 3,
	"./component/tempTable.js": 4,
	"./main.js": 34,
	"./utils/router.js": 35,
	"./views/advertisement/adArea.js": 106,
	"./views/advertisement/adPlaceList.js": 109,
	"./views/advertisement/form/adPlaceEdit.js": 110,
	"./views/advertisement/form/advertEdit.js": 111,
	"./views/advertisement/form/advertList.js": 112,
	"./views/example2.js": 113,
	"./views/formExample.js": 114,
	"./views/member/form/memberAccount.js": 115,
	"./views/member/form/memberAccountChange.js": 117,
	"./views/member/form/memberEdit.js": 119,
	"./views/member/memChargeRegular.js": 122,
	"./views/member/memberCharge.js": 124,
	"./views/member/memberList.js": 125,
	"./views/member/memberRank.js": 126,
	"./views/order/evaluateList.js": 127,
	"./views/order/form/orderView.js": 128,
	"./views/order/form/refundReason.js": 130,
	"./views/order/form/refundView.js": 131,
	"./views/order/form/replyEdit.js": 133,
	"./views/order/orderList.js": 50,
	"./views/order/refundList.js": 136,
	"./views/order/refundReasonList.js": 137,
	"./views/permission/form/adminEdit.js": 138,
	"./views/permission/form/roleEdit.js": 139,
	"./views/permission/logList.js": 140,
	"./views/permission/permissionList.js": 141,
	"./views/permission/roleList.js": 142,
	"./views/programEditExample.js": 143,
	"./views/project/form/cardEdit.js": 144,
	"./views/project/form/categoryEdit.js": 145,
	"./views/project/form/projectEdit.js": 146,
	"./views/project/form/projectEditDetail.js": 54,
	"./views/project/form/projectEditNormal.js": 52,
	"./views/project/projectCards.js": 147,
	"./views/project/projectCategory.js": 148,
	"./views/project/projectList.js": 149,
	"./views/recycle/orderRecycleList.js": 150,
	"./views/recycle/projectRecycleList.js": 151,
	"./views/report/cardReport.js": 152,
	"./views/report/memberReport.js": 153,
	"./views/report/orderReport.js": 154,
	"./views/report/reconciliation.js": 155,
	"./views/shop/form/shopEdit.js": 156,
	"./views/shop/shopList.js": 157,
	"./views/staff/form/staffEdit.js": 158,
	"./views/staff/staffList.js": 159,
	"./views/system/form/formExample.js": 160,
	"./views/system/regainList.js": 161
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 36;

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = {
    title: {
        left: '10%',
        show: true,
        text: '',
        textStyle: {
            fontFamily: 'Microsoft YaHei',
            fontSize: 24
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        align: 'right',
        right: '10%',
        data: []
    },
    xAxis: {
        axisLabel: {
            rotate: 35
        },
        data: []
    },
    yAxis: {},
    label: {
        normal: {
            show: true,
            position: 'insideTop',
            align: 'center',
            fontSize: 14,
            formatter: function (params) {
                if (params.value > 0) {
                    return params.value;
                } else {
                    return '';
                }
            }
        }
    },
    series: [{
        name: '',
        type: 'bar',
        stack: 'one',
        data: []
    }, {
        name: '',
        type: 'bar',
        stack: 'one',
        data: []
    }, {
        name: '',
        type: 'bar',
        stack: 'one',
        data: []
    }, {
        name: '',
        type: 'bar',
        stack: 'one',
        data: []
    }]
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(62);
const htmlOption = __webpack_require__(39);
/**
 * 级联组件
 */
module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    events: {
        "change select[name='province']": "onChangeProvince",
        "change select[name='city']": "onChangeCity"
    },

    initialize: function (loginKey) {
        this.key = loginKey;
        this.province = null;
        this.city = null;
        this.county = null;
        this.listenTo(this, "proReady", this.proRender); //省数据接收完毕
        this.listenTo(this, "cityReady", this.cityRender); //市数据接收完毕
        this.listenTo(this, "countyReady", this.countyRender); //区数据接收完毕

        this.url = 'https://www.kziche.com/admin/Member/location';
        this.proParam = {
            key: this.key,
            type: 1
        };
        this.cityParam = {
            key: this.key,
            type: 2,
            parentId: 0
        };
        this.countyParam = {
            key: this.key,
            type: 3,
            parentId: 0
        };
        this.queryData(this.url, this.proParam, 1);
    },

    render: function () {
        this.$el.append(this.template({
            "title": this.title,
            "name": this.name,
            "msg": this.msg
        }));
        return this;
    },

    setParam: function (param) {
        if (!param) {
            return;
        }
        this.title = param.title || "三级级联"; //标题
        this.name = param.name || ""; //该输入框绑定的传出参数名
        this.msg = param.msg || ""; //输入框注意事项
        this.key = param.key || ""; //访问接口的登陆秘钥
    },

    /**
     * 查询数据
     * @param  {[type]} url   [description]
     * @param  {[type]} param [description]
     * @param  {[type]} type  [查询的级别,1省,2市,3区]
     * @return {[type]}       [description]
     */
    queryData: function (url, param, typeto, callBack) {
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (typeto == 1) {
                    this.trigger('proReady', res.data);
                }
                if (typeto == 2) {
                    this.trigger('cityReady', res.data);
                }
                if (typeto == 3) {
                    this.trigger('countyReady', res.data);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this),
            complete: function () {
                if (callBack) {
                    if (typeto == 1) {
                        callBack(this.province);
                    }
                    if (typeto == 2) {
                        callBack(this.city);
                    }
                    if (typeto == 3) {
                        callBack(this.county);
                    }
                }
            }.bind(this)
        });
    },

    onChangeProvince: function (e) {
        var proid = $(e.target).val();
        this.cityParam.parentId = proid;
        this.queryData(this.url, this.cityParam, 2);
        this.$("select[name='county']").empty().append('<option value="">请选择</option>').attr("disabled", true);
    },

    onChangeCity: function (e) {
        var cityoid = $(e.target).val();
        this.countyParam.parentId = cityoid;
        this.queryData(this.url, this.countyParam, 3);
        this.$("select[name='county']").attr("disabled", false);
    },

    proRender: function (data) {
        var templateOptions = _.template(htmlOption);
        this.$("select[name='province']").empty();
        this.$("select[name='province']").append(templateOptions({
            options: data
        }));
    },

    cityRender: function (data) {
        var templateOptions = _.template(htmlOption);
        this.$("select[name='city']").empty();
        this.$("select[name='city']").append(templateOptions({
            options: data
        }));
    },

    countyRender: function (data) {
        var templateOptions = _.template(htmlOption);
        this.$("select[name='county']").empty();
        this.$("select[name='county']").append(templateOptions({
            options: data
        }));
    },

    getValue: function () {
        var pro = this.$("select[name='province']").val();
        var city = this.$("select[name='city']").val();
        var county = this.$("select[name='county']").val();
        return {
            province: pro,
            city: city,
            county: county
        };
    },

    setValue: function (pro, city, county) {
        var me = this;
        if (pro) {
            this.province = pro;
            this.queryData(this.url, this.proParam, 1, function (e) {
                me.$("select[name='province']").val(e);
            });
            if (!city) {
                this.cityParam.parentId = pro;
                this.queryData(this.url, this.cityParam, 2);
                this.$("select[name='county']").empty();
            };
        }

        if (city) {
            this.city = city;
            this.cityParam.parentId = pro;
            this.queryData(this.url, this.cityParam, 2, function (e) {
                me.$("select[name='city']").val(e);
            });
            if (!county) {
                this.countyParam.parentId = city;
                this.queryData(this.url, this.countyParam, 3);
            }
        }

        if (county) {
            this.county = county;
            this.countyParam.parentId = city;
            this.queryData(this.url, this.countyParam, 3, function (e) {
                me.$("select[name='county']").val(e);
            });
        }
    },

    getName: function () {
        return this.name;
    },

    test: function () {
        console.log(this.getValue());
        this.setValue(37, 128);
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = " <option value=\"\">请选择</option>\r\n <% _.each(options,function(option,index){ %>\r\n \t<option value=\"<%=option.id %>\"><%=option.name %></option>\r\n <%})%>";

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _) {const htmlTpl = __webpack_require__(67);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    events: {
        "click #clear": "clearMark",
        "click #changeSize": "changeSize"
    },

    initialize: function (param, lng, lat) {
        var param = param || {};
        this.lng = 0;
        this.lat = 0;

        this.setParam(param);
        this.listenTo(this, "mapReady", this.initMapParam);
        this.listenTo(this, "renderFinish", this.initMap);
        this.listenTo(this, "locateMarker", this.locateMaker);
        // this.initMap();
        this.marker = null;
    },

    render: function () {
        this.$el.append(this.template({
            "title": this.title,
            "name": this.name,
            "msg": this.msg
        }));
        return this;
    },

    setParam: function (param) {
        this.title = param.title || "地图坐标选取"; //标题
        this.name = param.name || ""; //该输入框绑定的传出参数名
        this.msg = param.msg || ""; //输入框注意事项
    },
    /**
     * 初始化map
     * @return {[type]} [description]
     */
    initMap: function () {
        var me = this;
        // setTimeout(()=>{
        me.map = new AMap.Map('map', {
            resizeEnable: true,
            zoom: 10,
            center: [116.480983, 40.0958]
        });
        me.trigger("mapReady");
        // },300);
    },
    /**
     * MAP初始化成功后绑定点击事件
     * @return {[type]} [description]
     */
    initMapParam: function () {
        var me = this;

        me.map.on('click', function (e) {
            var lng = e.lnglat.getLng();
            var lat = e.lnglat.getLat();
            me.addMarker(lng, lat);
        });

        //输入提示
        var autoOptions = {
            input: "locate"
        };
        this.auto = new AMap.Autocomplete(autoOptions);
        this.placeSearch = new AMap.PlaceSearch({
            map: me.map
        }); //构造地点查询类

        AMap.event.addListener(this.auto, "select", function (e) {
            me.placeSearch.setCity(e.poi.adcode);
            me.placeSearch.search(e.poi.name); //关键字查询查询
        }); //注册监听，当选中某条记录时会触发
    },

    addMarker: function (lng, lat) {
        if (this.marker != null) {
            this.marker.setMap(null);
            this.marker = null;
        }
        this.marker = new AMap.Marker({
            map: this.map,
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [lng, lat]
        });
        this.map.setCenter([lng, lat]);
        var location = "经度:" + lng + ",纬度:" + lat;
        this.$("#location").text(location);
    },

    locateMaker: function () {
        if (this.lat != 0 && this.lng != 0) {
            this.addMarker(this.lng, this.lat);
            this.map.setCenter([this.lng, this.lat]);
        }
    },

    getPosition: function () {
        if (this.marker) {
            var temp = this.marker.getPosition();
            return {
                lng: temp.getLng(),
                lat: temp.getLat()
            };
        }
        return {};
    },

    setPosition: function (lng, lat) {
        var tempLng = parseFloat(lng);
        var tempLat = parseFloat(lat);
        this.lng = tempLng;
        this.lat = tempLat;
        this.trigger("locateMarker");
    },

    getName: function () {
        return this.name;
    },

    clearMark: function () {
        if (this.marker != null) {
            this.marker.setMap(null);
            this.marker = null;
        }
        this.$("#location").text("");
    },

    changeSize: function () {
        var elMap = this.$("#map");
        var changeBtn = this.$("#changeSize");
        if (elMap.hasClass("large")) {
            elMap.css("width", "350px").css("height", "300px").removeClass("large");
            changeBtn.text("展开地图");
        } else {
            elMap.css("width", "600px").css("height", "500px").addClass("large");
            changeBtn.text("缩小地图");
        }
    },

    locateMap: function (e) {
        this.placeSearch.setCity(e.poi.adcode);
        this.placeSearch.search(e.poi.name); //关键字查询查询
    },

    onTest: function () {
        this.setPosition(112.9252020, 28.1980240);
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(70);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formPermission",

    template: _.template(htmlTpl),

    events: {
        "click input[type='checkbox']": "onClickCheck",
        "change select[name='search']": "onChangeSelect"
    },

    initialize: function (loginKey) {
        this.key = loginKey;
        this.values = [];
        this.listenTo(this, "dataReady", this.freshTable);
    },

    render: function () {
        // this.$el.append(this.template());
        this.queryData();
        return this;
    },

    queryData: function () {
        $.ajax({
            url: "https://www.kziche.com/admin/Order/privilegeInfo",
            type: 'get',
            dataType: 'json',
            data: {
                key: this.key
            },
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },
    /**
     * 添加配置参数
     * @param {[string]} name    [控件识别名称]
     * @param {[object]} options [下拉控件参数]
     * e : {
     * }
     */
    setParam: function (param) {
        if (!param) {
            return;
        }
        this.title = param.title || "文本框"; //标题
        this.name = param.name || ""; //该输入框绑定的传出参数名
    },

    freshTable: function (data) {
        console.log(data);
        this.$el.append(this.template({
            data: data
        }));
        this.trigger("permissionReady");
    },

    fillPage: function () {
        var me = this;
        var resultArray = this.values.split(",");
        this.$("input[type='checkbox']").each(function (index, el) {
            for (let i = 0; i < resultArray.length; i++) {
                if (resultArray[i] == $(el).attr("elid")) {
                    $(el).prop("checked", true).closest('.checkEle').addClass("active");
                }
            }
        });
    },

    getValue: function () {
        var ids = [];
        this.$("input[type='checkbox']:checked").each(function (index, e) {
            ids.push($(e).attr("elid"));
        });
        return ids.join(",");
    },

    setValue: function (val) {
        if (val) {
            this.values = val;
            this.fillPage();
        } else {
            this.values = [];
        }
    },

    getName: function () {
        return this.name;
    },

    onClickCheck: function (e) {
        var target = $(e.target);
        var el = target.closest('.checkEle');
        if (el.hasClass("active")) {
            el.removeClass("active");
        } else {
            el.addClass("active");
        }
        //如点击父选项，相应子元素也被选取
        if (target.attr("pid") == 0) {
            target.closest("td").next().find("input[type='checkbox']").each(function (index, comp) {
                if (target.prop("checked")) {
                    $(comp).prop("checked", true).closest('.checkEle').addClass("active");
                } else {
                    $(comp).prop("checked", false).closest('.checkEle').removeClass("active");
                }
            });
        }
    },

    onChangeSelect: function (e) {
        var val = $(e.target).val();
        if (val == "") {
            this.$("tbody tr").show();
        } else {
            this.$("tbody tr").each(function (index, comp) {
                var temp = $(comp).attr("elid");
                if (val != temp) {
                    $(comp).hide();
                }
                if (val == temp) {
                    $(comp).show();
                }
            });
        }
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(72);
const htmlOption = __webpack_require__(39);
const htmlShopOption = __webpack_require__(73);
/**
 * 根据商店地区选取店铺
 */
module.exports = Backbone.View.extend({
    tagName: "div",

    className: "formElement",

    template: _.template(htmlTpl),

    events: {
        "change select[name='province']": "onChangeProvince",
        "change select[name='city']": "onChangeCity"
    },

    initialize: function (loginKey) {
        this.key = loginKey;
        this.province = null;
        this.city = null;
        this.shop = null;

        this.listenTo(this, "proReady", this.proRender); //省数据接收完毕
        this.listenTo(this, "cityReady", this.cityRender); //市数据接收完毕
        this.listenTo(this, "shopReady", this.shopRender); //区数据接收完毕

        this.url = 'https://www.kziche.com/admin/Member/location';
        this.shopUrl = "https://www.kziche.com/admin/Order/storeList";
        this.proParam = {
            key: this.key,
            type: 1
        };
        this.cityParam = {
            key: this.key,
            type: 2,
            parentId: 0
        };
        this.shopParam = {
            key: this.key,
            searchCriteria: '',
            page: "",
            pagesize: "",
            store_name: "",
            province_id: "",
            city_id: "",
            cate: ""
        };
        this.queryData(this.url, this.proParam, 1);
    },

    render: function () {
        this.$el.append(this.template({
            "title": this.title,
            "name": this.name,
            "msg": this.msg
        }));
        return this;
    },

    setParam: function (param) {
        if (!param) {
            return;
        }
        this.title = param.title || "三级级联"; //标题
        this.name = param.name || ""; //该输入框绑定的传出参数名
        this.msg = param.msg || ""; //输入框注意事项
    },

    /**
     * 查询数据
     * @param  {[type]} url   [description]
     * @param  {[type]} param [description]
     * @param  {[type]} type  [查询的级别,1省,2市,3区]
     * @return {[type]}       [description]
     */
    queryData: function (url, param, typeto, callBack) {
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (typeto == 1) {
                    this.trigger('proReady', res.data);
                }
                if (typeto == 2) {
                    this.trigger('cityReady', res.data);
                }
                if (typeto == 3) {
                    this.trigger('shopReady', res.data);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this),
            complete: function () {
                if (callBack) {
                    if (typeto == 1) {
                        callBack(this.province);
                    }
                    if (typeto == 2) {
                        callBack(this.city);
                    }
                    if (typeto == 3) {
                        callBack(this.shop);
                    }
                }
            }.bind(this)
        });
    },

    onChangeProvince: function (e) {
        var proid = $(e.target).val();
        this.cityParam.parentId = proid;
        this.queryData(this.url, this.cityParam, 2);
        this.$("select[name='shop']").empty().append('<option value="">请选择</option>').attr("disabled", true);
    },

    onChangeCity: function (e) {
        var cityid = $(e.target).val();
        var temp = this.getValue();
        var province = temp.province;
        var city = temp.city;
        this.shopParam.province_id = province;
        this.shopParam.city_id = city;
        this.queryData(this.shopUrl, this.shopParam, 3);
        this.$("select[name='shop']").attr("disabled", false);
    },

    proRender: function (data) {
        var templateOptions = _.template(htmlOption);
        this.$("select[name='province']").empty();
        this.$("select[name='province']").append(templateOptions({
            options: data
        }));
    },

    cityRender: function (data) {
        var templateOptions = _.template(htmlOption);
        this.$("select[name='city']").empty();
        this.$("select[name='city']").append(templateOptions({
            options: data
        }));
    },

    shopRender: function (data) {
        var data = data || [];
        this.$("select[name='shop']").empty();
        var templateOptions = _.template(htmlShopOption);
        this.$("select[name='shop']").append(templateOptions({
            options: data
        }));
    },

    getValue: function () {
        var pro = this.$("select[name='province']").val();
        var city = this.$("select[name='city']").val();
        var shop = this.$("select[name='shop']").val();
        return {
            province: pro,
            city: city,
            shop: shop
        };
    },

    setValue: function (pro, city, shop) {
        var me = this;
        if (pro) {
            this.province = pro;
            this.queryData(this.url, this.proParam, 1, function (e) {
                me.$("select[name='province']").val(e);
            });
        }

        if (city) {
            this.city = city;
            this.cityParam.parentId = pro;
            this.queryData(this.url, this.cityParam, 2, function (e) {
                me.$("select[name='city']").val(e);
            });
        }

        if (shop) {
            this.shop = shop;
            this.shopParam.province_id = this.province;
            this.shopParam.city_id = this.city;
            this.queryData(this.shopUrl, this.shopParam, 3, function (e) {
                me.$("select[name='shop']").val(e);
            });
        }
    },

    getName: function () {
        return this.name;
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _) {const htmlTpl = __webpack_require__(81);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "schDate",

    template: _.template(htmlTpl),

    initialize: function (param) {
        var param = param || {};
        this.setParam(param);
    },

    render: function () {
        this.$el.append(this.template({
            title: this.title,
            showTime: this.showTime,
            showDate: this.showDate,
            startDate: this.startDate,
            endDate: this.endDate,
            startTime: this.startTime,
            endTime: this.endTime
        }));
        return this;
    },

    setParam: function (param) {
        this.name = param.name || "daterange";
        this.title = param.title || '起始时间';
        this.startDate = param.startDate || this.getNowdate();
        this.endDate = param.endDate || this.getNowdate();
        this.startTime = param.startTime || "00:00";
        this.endTime = param.endTime || "23:59";
        this.showTime = param.showtime || false;
        this.showDate = param.showdate || true;
    },

    getNowdate: function () {
        var now = new Date();
        var result = "";
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        return year + '-' + month + '-' + day;
    },

    getName: function () {
        return this.name;
    },

    setStartDate: function (date) {
        this.$("input[name='start']").val(date);
    },

    setEndDate: function () {},

    getStartDate: function () {
        return this.$('input[name="start"]').val();
    },

    getEndDate: function () {
        return this.$('input[name="end"]').val();
    },

    getStartTime: function () {
        return this.$('input[name="sttime"]').val();
    },

    getEndTime: function () {
        return this.$('input[name="edtime"]').val();
    },

    getValue: function () {
        return "";
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _) {const htmlTpl = __webpack_require__(82);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "schText",

    template: _.template(htmlTpl),

    initialize: function (param) {
        var param = param || {};
        this.setParam(param);
    },

    render: function () {
        this.$el.append(this.template({
            "title": this.title,
            "value": this.value,
            "explain": this.explain,
            "allowEmpty": this.allowEmpty,
            "name": this.name
        }));
        return this;
    },
    /**
     * 添加配置参数
     * @param {[string]} name    [控件识别名称]
     * @param {[object]} options [下拉控件参数]
     * e : {
     *    title : "a",
     *    value : "content",
     *    explain : "string",
     *    allowEmpty : true,
     *    name : "name"
     * }
     */
    setParam: function (param) {
        if (!param) {
            return;
        }
        this.title = param.title || "文本框"; //标题
        this.value = param.value || ""; //输入框内值
        this.explain = param.explain || "输入内容"; //输入提示
        this.allowEmpty = param.allowEmptytrue || true; //可否为空
        this.name = param.name || ""; //该输入框绑定的传出参数名
    },

    setName: function (name) {
        this.name = name;
    },

    getName: function () {
        return this.name;
    },

    setValue: function (value) {
        this.$('input[type="text"]').val(value);
    },

    getValue: function () {
        var name = this.name;
        var value = this.$('input[type="text"]').val();
        return value.trim();
    },

    refresh: function () {
        this.$el.empty();
        this.render();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _) {const tpl = __webpack_require__(83);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "main-header",

    events: {
        "click a[name='logout']": "onClickLogout"
    },

    template: _.template(tpl),

    initialize: function () {
        // this.render();
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    onClickLogout: function (e) {
        var logoutSure = confirm("是否确定退出?");
        if (logoutSure) {
            localStorage.removeItem("kzicar_key");
            window.location.href = "../public/login.html";
        }
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const tpl = __webpack_require__(88);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "main-sidebar",

    events: {
        "click h3": "onClickTitle",
        "click a": "onClickA"
    },

    template: _.template(tpl),

    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(this.template());
        return this;
    },

    onClickTitle: function (e) {
        var isActive = $(e.target).closest('h3').next().hasClass("active");
        this.$(".panel-body").slideUp().removeClass("active");
        if (!isActive) {
            $(e.target).closest('h3').next().slideDown().addClass("active");
        }
    },

    onClickA: function (e) {
        this.$(".panel-body li a").removeClass("active");
        $(e.target).addClass("active");
    },

    showCurrentOption: function (op) {
        var op = "#" + op;
        var targetOption = null;
        this.$(".panel-body li a").each(function (index, el) {
            if (op == $(el).attr("href")) {
                targetOption = $(el);
            }
        });

        if (targetOption) {
            if (targetOption.closest("ul").hasClass("active")) {
                this.$(".panel-body li a").removeClass("active");
                targetOption.addClass("active");
            } else {
                this.$(".panel-body li a").removeClass("active");
                this.$(".panel-body").slideUp().removeClass("active");
                targetOption.closest("ul").slideDown().addClass("active");
                targetOption.addClass("active");
            }
        }
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(100);

module.exports = Backbone.View.extend({
    tagName: "p",

    className: "chargeRegular",

    template: _.template(htmlTpl),

    events: {
        "click #delete": "onClickDelete"
    },

    initialize: function (param) {
        var param = param || {};
        this.setParam(param);
    },

    render: function () {
        this.$el.append(this.template({
            charge: this.charge,
            give: this.give,
            isNew: this.isNew,
            num: this.num
        }));
        return this;
    },

    setParam: function (param) {
        if (!param) {
            return;
        }
        this.charge = param.charge || 0;
        this.give = param.give || 0;
        this.isNew = param.isNew || false;
        this.num = param.num || 0;
        this.elid = param.elid || 0;
    },

    getValue: function () {
        var result = {};
        this.$('input[type="number"]').each(function (index, el) {
            result[el.name] = el.value;
        });
        return result;
    },

    onClickDelete: function (e) {
        var num = $(e.target).attr('num');
        if (!this.isNew) {
            var sure = confirm("是否删除该记录?");
            if (sure) {
                this.trigger('delete', num);
                this.removeEl();
            }
        } else {
            this.trigger('delete', num);
            this.removeEl();
        }
    },

    removeEl: function () {
        this.remove();
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(102);
const htmlSonTpl = __webpack_require__(103);

module.exports = Backbone.View.extend({
    tagName: "table",

    className: "table table-striped table-bordered table-hover table-condensed",

    template: _.template(htmlTpl),

    events: {
        "click a.isShow": "onClickShow",
        "click a.isHide": "onClickHide"
    },

    initialize: function () {
        this.targetArr = []; //需要获得的目标数组
    },

    render: function () {
        this.$el.append(this.template());
        return this;
    },
    /**
     * 整理从后端获取的数据
     * @param  {[type]} param [传入的数据]
     * @return {[type]}       [description]
     */
    arrangeData: function (data) {
        var me = this;
        _.each(data, function (e, index) {
            me.parseObject(e, me);
        });
    },

    /**
     * 用于整理数据的递归函数，并赋值给this.targetArr
     * @param  {[type]} obj     [处理的对象]
     * @param  {[type]} context [description]
     * @return {[type]}         [description]
     */
    parseObject: function (obj, context) {
        var me = context;
        me.targetArr.push(me.getObject(obj));
        if (!obj['son'] || obj['son'].length == 0) {
            return;
        } else {
            for (var i = 0; i < obj['son'].length; i++) {
                me.parseObject(obj['son'][i], me);
            }
        }
    },

    /**
     * [getObject description]
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    getObject: function (obj) {
        var object = new Object();
        for (param in obj) {
            if (param == "son") {
                object[param] = true;
                continue;
            }
            object[param] = obj[param];
        }
        return object;
    },

    onClickShow: function (e) {
        $(e.target).attr('class', 'isHide').text("收起");
        var uid = $(e.target).closest('tr').attr('uid');
        this.$('tr[pid=' + uid + ']').show();
    },
    onClickHide: function (e) {
        $(e.target).attr('class', 'isShow').text("展开");
        var uid = $(e.target).closest('tr').attr('uid');
        this.hideTr(uid, this);
    },
    /**
     * 收起选项的递归函数，父元素收起则所有其子元素都收起
     * @param  {string} uid     [需要收起的元素id]
     * @param  {this} context [当前全局环境，锁定在当前对象中]
     * @return {[type]}         [description]
     */
    hideTr: function (uid, context) {
        var me = context;
        var tempEl = me.$('tr[pid=' + uid + ']');

        if (tempEl.length != 0) {
            tempEl.hide();
            tempEl.find("a.isHide").text("展开").attr('class', 'isShow');
            tempEl.each(function (index, el) {
                let uuid = $(el).attr('uid');
                me.hideTr(uuid, me);
            });
        } else {
            tempEl.hide();
            return;
        }
    },

    setData: function (param) {
        this.$('tbody').empty();
        this.targetArr = [];
        this.arrangeData(param);
        var sonTemplate = _.template(htmlSonTpl);
        this.$('tbody').append(sonTemplate({
            array: this.targetArr
        }));
        this.$('tbody>tr[pid!="0"]').hide();
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = "<div class=\"vtContainer\">\r\n    <div class=\"vtBigTitle\">\r\n        <span>订单详情</span>\r\n    </div>\r\n    <% if(items && items.length != 0){%>\r\n    <div class=\"vtBox\">\r\n        <div class=\"vt vtTablehead\">\r\n            <div>项目名称</div>\r\n            <div>价格(元)</div>\r\n            <div>数量</div>\r\n            <div>员工ID</div>\r\n        </div>\r\n    </div>\r\n    <% _.each(items,function(item,index){%>\r\n    <div class=\"vtBox\">\r\n        <div class=\"vt vtTable\">\r\n            <div><%=item.items_name %></div>\r\n            <div><%=item.actual_price %></div>\r\n            <div>X <%=item.num %></div>\r\n            <div><%=item.staff_id %></div>\r\n        </div>\r\n    </div>\r\n    <% }) %>\r\n<%}else{%>\r\n    <div class=\"vtBox\">\r\n        <div class=\"vt\">\r\n        <span class=\"glyphicon glyphicon-exclamation-sign\" style=\"color: rgb(177, 0, 60); font-size: 23px;\"> 该订单没有相关详情记录</span>\r\n        </div>\r\n    </div>\r\n<%}%>\r\n</div>";

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);
const compBatch = __webpack_require__(9);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function (loginKey, code, upUrl) {
        this.$el.html(this.template({
            titles: ["订单管理", "订单列表"],
            back: false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd: false,
            addLink: "",
            showSearch: true,
            linesNum: 1
        });
        this.batch = new compBatch();
        this.key = loginKey;

        this.listenTo(this.search, "goSearch", this.goSearch);
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.listenTo(this.batch, "goBatch", this.goBatch);

        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Order/orderList';
        this.tableParam = {
            key: this.key,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            signStartTime: this.getDate('month', 3),
            signEndTime: this.getDate()
        };

        this.checkOrderType(code, upUrl);
        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        this.$('#batch').append(this.batch.render().el);
        return this;
    },
    /**
     * 判别订单归属，目前分别是会员，员工，店铺，没有归属则显示所有订单
     * @return {[string]} code [传入的id]
     * @return {[string]} upUrl [跳转之前的url，用来判断归属关系]
     */
    checkOrderType: function (code, upUrl) {
        if (code && upUrl == "#views/staff/staffList") {
            this.tableParam.staff_id = code;
        }

        if (code && upUrl == "#views/member/memberList") {
            this.tableParam.member_id = code;
        }

        if (code && upUrl == "#views/shop/shopList") {
            this.tableParam.store_id = code;
        }
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ["会员", "订单号", "内容", "付款方式", "所属门店", "金额", "状态", "创建时间"]; //表头
        var rows = ["nickname", { name: 'order_sn', isSkip: false, link: "views/formExample", code: "id" }, "items_name", "pay_type_name", "store_name", "actual_money", "state_name", "create_time"]; //表列
        var opration = [{ name: '详情', elID: 'order_id', elName: "xq", link: "views/order/form/orderView" }, { name: '删除', elID: 'order_id', elName: "del" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("order_id");

        //搜索栏配置
        var searchComponents = [{
            type: 'daterange',
            line: 0,
            param: {
                title: "时间范围",
                startDate: this.getDate('month', 3),
                endDate: this.getDate(),
                name: "daterange"
            }
        }, {
            type: 'text',
            line: 0,
            param: {
                title: "搜索条件",
                value: "",
                explain: "要查询的会员名、订单号、状态、支付方式、内容",
                name: "text"
            }
        }];
        this.search.setParam(searchComponents);

        var batchOptions = [{ value: "2", content: "删除" }];
        this.batch.setParam(batchOptions);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        this.pagement.clearPage();
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1,
                            total: res.count
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function (param) {
        var dateRange = this.search.getElByName('daterange');
        var searchText = this.search.getElByName('text');
        var searchPay = this.search.getElByName('pay'); //接口没有涉及

        this.tableParam.searchCriteria = searchText.getValue();
        this.tableParam.signStartTime = dateRange.getStartDate();
        this.tableParam.signEndTime = dateRange.getEndDate();
        this.tableParam.page = 1;
        this.queryData(this.url, this.tableParam, true);
    },

    goBatch: function (type) {
        var ids = [];
        var url = "";
        var param = null;

        this.$("#cont tbody input[type='checkbox']:checked").each(function (index, e) {
            ids.push($(e).attr("checkid"));
        });

        if (ids.length == 0) {
            alert("未选取任何记录");
            return;
        }

        var idsString = ids.join(",");

        if (type == "2") {
            url = "https://www.kziche.com/admin/Order/delOrder";
            param = {
                key: this.key,
                order_ids: idsString,
                type: type
            };
        }
        this.batchAjax(url, param);
    },

    batchAjax: function (tempUrl, param) {
        var me = this;
        $.ajax({
            url: tempUrl,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    alert(res.msg);
                    this.tableParam.page = 1;
                    this.queryData(me.url, me.tableParam, true);
                } else {
                    alert(res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        if (data.length == 0) {
            this.pagement.clearPage();
        }
        this.table.setData(data);
        var me = this;
        /*
        绑定操作点击事件
         */
        this.$('a[name="del"]').click(function (el) {
            var ids = $(el.target).attr("elid");
            var text = $(el.target).text();
            var url = "https://www.kziche.com/admin/Order/delOrder";
            var param = {
                key: me.key,
                order_ids: ids,
                type: "2"
            };
            var sure = window.confirm("确定执行 " + text + " 操作?");
            if (sure) {
                me.batchAjax(url, param);
            }
        });
    },

    /**
    * 获取日期
    * @param  {string} type  [修改的类型month月份,day天数]
    * @param  {num} param [与当前日期回退的type数量]
    * @return {[type]}       [description]
    */
    getDate: function (type, param) {
        let date = new Date();
        if (type && type == "month") {
            date.setMonth(date.getMonth() - param);
        }
        if (type && type == "day") {
            date.setDate(date.getDate() - param);
        }
        let day = date.getDate();
        let month = date.getMonth() + 1;

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        let year = date.getFullYear();
        let result = year + "-" + month + "-" + day;
        return result;
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"pageHead\">\r\n    <div class=\"phLeft\"><img src=\"" + __webpack_require__(10) + "\" alt=\"\">&nbsp&nbsp<span style=\"color:#9e9e9e;\">当前位置：</span>\r\n        <% _.each(titles,function(title,index){%>\r\n           <% if(titles.length-1 > index){ %>\r\n                <span><%=title%></span> >\r\n           <% }else{ %>\r\n                <span><%=title%></span>\r\n            <% } %>\r\n        <%})%>\r\n    </div>\r\n    <div class=\"phRight\">\r\n        <% if(back){%>\r\n            <a onClick=\"javascript :history.back(-1);\" href=\"javascript:void(0)\" class=\"btn btn-info back\">返回</a>\r\n        <% } %>\r\n    </div>\r\n</div>\r\n<div class=\"panel panel-default\">\r\n<div class=\"panel-body\">\r\n    <ul class=\"nav nav-tabs\">\r\n        <li class=\"active\">\r\n            <a href=\"javascript:void(0)\" targetId=\"normal\">通用信息</a>\r\n        </li>\r\n        <li>\r\n            <a href=\"javascript:void(0)\" targetId=\"detail\">详情页</a>\r\n        </li>\r\n    </ul>\r\n    <div id=\"myTabContent\" class=\"tab-content\">\r\n        <div class=\"tab-pane fade in active\" id=\"normal\">\r\n            \r\n        </div>\r\n        <div class=\"tab-pane fade \" id=\"detail\">\r\n\r\n        </div>\r\n    </div>\r\n   <hr>\r\n   <div class=\"op-container\">\r\n    <button type=\"button\" id=\"allConfirm\" class=\"btn btn-primary btn-lg\">提&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp交</button>\r\n    <button type=\"button\" id=\"allClear\" class=\"btn btn-primary btn-lg\">刷&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp新</button>\r\n  <!--  <a href=\"<% if(back!='#'){%><%=back %><% }else{ %> javascript:void(0)<% } %>\" id=\"back\" class=\"btn btn-info btn-lg\">返&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp回</a>\r\n   </div> -->\r\n</div>\r\n</div>";

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(53);
const compSelect = __webpack_require__(8);
const compText = __webpack_require__(7);
const compFile = __webpack_require__(20);
const compSingleFile = __webpack_require__(13);
const compColor = __webpack_require__(26);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "panel panel-default",

    template: _.template(htmlTpl),

    events: {},

    initialize: function (code, upUrl, loginKey) {
        this.code = code || 0;
        this.key = loginKey;
        this.$el.html(this.template({
            back: upUrl
        }));

        this.textName = new compText();
        this.textKzPrice = new compText();
        this.textAppPrice = new compText();
        this.textMarketPrice = new compText();
        this.textScore = new compText();
        this.textFcPrice = new compText();
        this.textKeyword = new compText();
        this.color = new compColor();

        this.fileMin = new compSingleFile();
        this.fileMain = new compFile();

        this.selectType = new compSelect();

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        // this.listenTo(this, 'confirmSuccess',this.confirmFinish);//表单提交成功后的回调函数
    },

    render: function () {
        this.$('#main').append(this.textName.render().el);
        this.$('#main').append(this.textKzPrice.render().el);
        this.$('#main').append(this.textAppPrice.render().el);
        this.$('#main').append(this.textMarketPrice.render().el);
        this.$('#main').append(this.textScore.render().el);
        this.$('#main').append(this.textFcPrice.render().el);
        this.$('#main').append(this.textKeyword.render().el);
        this.$('#main').append(this.color.render().el);
        this.$('#main').append(this.selectType.render().el);
        this.$('#main').append(this.fileMin.render().el);
        this.$('#main').append(this.fileMain.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        this.textName.setParam({
            title: "服务项目名称"
        });
        this.textKzPrice.setParam({
            title: "康展价",
            msg: "康展专属价格"
        });
        this.textAppPrice.setParam({
            title: "APP专享价"
        });
        this.textMarketPrice.setParam({
            title: "市场价"
        });
        this.textScore.setParam({
            title: "赠送消费积分",
            msg: "积分为整数"
        });
        this.textFcPrice.setParam({
            title: "分成金额",
            msg: ""
        });
        this.textKeyword.setParam({
            title: "关键字",
            msg: "尽量短写"
        });
        this.color.setParam({
            title: "图表颜色",
            msg: "选择在图表中显示的颜色(rgb格式)"
        });

        this.selectType.setParam({
            title: '项目分类',
            options: [{
                value: 1,
                content: "分类1"
            }, {
                value: 2,
                content: "分类2"
            }]
        });
        this.fileMin.setParam({
            title: "略缩图",
            msg: "只上传1个文件"
        });
        this.fileMain.setParam({
            title: "主图",
            msg: "上传文件数量小于5"
        });
        this.fillSelectOption();
    },

    fillPage: function (data) {
        //这里再进行数据的装配
        this.textName.setValue(data.items_name);
        this.textKzPrice.setValue(data.actual_price);
        this.textAppPrice.setValue(data.app_price);
        this.textMarketPrice.setValue(data.market_price);
        this.textScore.setValue(data.consumer_point);
        this.textFcPrice.setValue(data.divide);
        this.textKeyword.setValue(data.keyword);
        this.fileMin.setFile(data.thumbnail);
        // this.fileMain.getFiles();
        this.color.setValue(data.colour);
        this.selectType.setValue(data.category_id);
    },

    getFormData: function () {
        var name = this.textName.getValue();
        var kzPrice = this.textKzPrice.getValue();
        var appPrice = this.textAppPrice.getValue();
        var marketPrice = this.textMarketPrice.getValue();
        var score = this.textScore.getValue();
        var fcPrice = this.textFcPrice.getValue();
        var keyword = this.textKeyword.getValue();
        var colorValue = this.color.getValue();

        var min = this.fileMin.getFiles();
        var ossMin = this.fileMin.isChange();
        var main = this.fileMain.getFiles();
        var type = this.selectType.getValue();
        return {
            name: name,
            category_id: type,
            actual_price: kzPrice,
            market_price: marketPrice,
            keyword: keyword,
            thumbnail: min[0],
            main: main,
            oss_photo_notnull: ossMin,
            colour: colorValue
        };
    },

    fillSelectOption: function () {
        var me = this;
        $.ajax({
            url: "https://www.kziche.com/admin/Member/showServiceCate",
            type: 'get',
            dataType: 'json',
            data: {
                key: me.key
            },
            success: function (res) {
                if (res.code == 200) {
                    me.selectType.setOptions(res.data);
                } else {
                    var temp = [];
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    onClickBack: function (e) {},

    onClickClear: function (e) {},

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = "<div class=\"panel-body\">\r\n    <div class=\"\" id=\"main\"></div>\r\n   <!--  <button type=\"button\" id=\"clear\" class=\"btn btn-primary\">重&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp置</button>\r\n\t<button type=\"button\" id=\"confirm\" class=\"btn btn-primary\">&nbsp&nbsp&nbsp上一步&nbsp&nbsp&nbsp</button>\r\n\t<a href=\"javascript:void(0)\" id=\"back\" class=\"btn btn-info\">&nbsp&nbsp&nbsp下一步&nbsp&nbsp&nbsp</a> -->\r\n</div>";

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _) {const htmlTpl = __webpack_require__(53);
const compText = __webpack_require__(7);
const compUeditor = __webpack_require__(15);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "panel panel-default",

    template: _.template(htmlTpl),

    events: {
        "click #confirm": "onClickConfirm",
        "click #clear": "onClickClear",
        "click #back": "onClickBack"
    },

    initialize: function (code, upUrl, loginKey) {
        this.code = code || 0;
        this.key = loginKey;
        this.$el.html(this.template({
            back: upUrl
        }));

        this.textIntro = new compText();
        this.ueditorDetail = new compUeditor();
        this.listenTo(this, "renderFinish", this.renderPlugin);
        this.initParamOfPage();
    },

    render: function () {
        this.$('#main').append(this.textIntro.render().el);
        this.$('#main').append(this.ueditorDetail.render().el);
        return this;
    },

    renderPlugin: function () {
        this.ueditorDetail.trigger("renderFinish");
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        this.textIntro.setParam({
            title: "项目简介"
        });
        this.ueditorDetail.setParam({
            title: "项目详情",
            msg: "在这里编辑项目展示页的详情"
        });
    },

    fillPage: function (data) {
        //这里再进行数据的装配
        this.textIntro.setValue(data.brief_introduction);
        this.ueditorDetail.setValue(data.describe);
    },

    getFormData: function () {
        var intro = this.textIntro.getValue();
        var detail = this.ueditorDetail.getValue();
        return {
            describe: detail,
            brief_introduction: intro
        };
    },

    onClickBack: function (e) {},

    onClickClear: function (e) {},

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(22))(11);

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(17)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(23, function() {
			var newContent = __webpack_require__(23);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(25);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(17)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(25, function() {
			var newContent = __webpack_require__(25);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = {
    title: {
        show: true,
        text: '',
        textStyle: {
            fontFamily: 'Microsoft YaHei',
            fontSize: 24
        }
    },
    legend: {
        data: []
    },
    xAxis: {
        axisLabel: {
            rotate: 35
        },
        data: []
    },
    yAxis: [{
        type: 'value'
    }, {
        type: 'value',
        splitLine: {
            show: false
        }
    }],
    series: [{
        name: '',
        type: 'bar',
        label: {
            normal: {
                show: true,
                position: 'top'
            }
        },
        data: []
    }, {
        name: '',
        type: 'bar',
        yAxisIndex: 1,
        label: {
            normal: {
                show: true,
                position: 'top'
            }
        },
        data: []
    }]
};

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = "<div class=\"echartWindow\" id=\"<%=id %>\" style=\"min-width:900px;width:100%;height:400px;\"></div><hr>";

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(61))(21);

/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = echart_library;

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = "<span class=\"formTitle\"><%=title %></span>\r\n<select style=\"width:130px;\" name=\"province\">\r\n  \r\n</select>\r\n<select style=\"width:130px;\" name=\"city\">\r\n  <option value=\"\">请选择</option>\r\n</select>\r\n<select style=\"width:130px;\" name=\"county\">\r\n  <option value=\"\">请选择</option>\r\n</select>\r\n<% if(msg !=\"\"){%><div class=\"form-msg\"><%=msg %></div><% } %>";

/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = "<span class=\"formTitle\"><%=title %></span>\r\n<% _.each(options,function(op,index){ %>\r\n\t<label><input type=\"checkbox\" value=\"<%=op.value %>\" <% if(value == op.value){%>checked=\"checked\"<% } %>/> <%=op.content %></label>\r\n<% })%>\r\n<% if(msg !=\"\"){%><p><%=msg %></p><% } %>";

/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = "<span class=\"formTitle\"><% if(!allowEmpty){ %>*<% } %><%=title %></span>\r\n<input type=\"color\"  value=\"<%=value %>\" <% if(name !=\"\"){ %> name=\"<%=name %>\" <%} %>/><input class=\"colorText\" type=\"text\" placeholder=\"输入rgb颜色\">\r\n<% if(msg !=\"\"){%><div class=\"form-msg\"><%=msg %></div><% } %>";

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = "<span class=\"formTitle\"><%=title %></span>\r\n<% if(showDate == \"show\"){%>\r\n\t<input name=\"date\" type=\"date\" value=\"<%=elDate %>\">\r\n<% } %>\r\n<% if(showTime == \"show\"){%>\r\n\t<input name=\"time\" type=\"time\" step=\"1\" value=\"<%=elTime %>\">\r\n<% } %>";

/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = "<span class=\"formTitle\"><%=title %></span><input type=\"file\" id=\"file\" accept=\"image/gif,image/jpeg,image/jpg,image/png,image/svg\" multiple=\"multiple\"/>\r\n<div>\r\n\t\r\n\t<div class=\"multFileMsg\"></div>\r\n</div>\r\n\r\n<div id=\"msg\"></div>\r\n<% if(msg !=\"\"){%><div class=\"form-msg\"><%=msg %></div><% } %>";

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = "<span class=\"formTitle\"><%=title %></span>\r\n<div class=\"mapContainer\">\r\n<div><span>输入要查询地址：</span><input id=\"locate\" type=\"text\"></div>\r\n<div><span id=\"location\"></span></div>\r\n\r\n<div  id=\"map\" style=\"width:350px;height:300px;\">\r\n\r\n</div>\r\n<div>\r\n\t<a id=\"clear\" class=\"btn\">清除标记</a><a id=\"changeSize\" class=\"btn\">展开地图</a>\r\n</div>\r\n</div>\r\n<% if(msg !=\"\"){%><div class=\"form-msg\"><%=msg %></div><% } %>";

/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = "<span class=\"formTitle\"><%=title %></span>\r\n<div class=\"multselect\">\r\n    <div class=\"multselectText\">\r\n        <input type=\"text\" readonly=\"readonly\" placeholder=\"请点击选择\">\r\n    </div>\r\n    <div class=\"muti\">\r\n    <div class=\"multselectOp\">\r\n    \t<li><input type=\"checkbox\" value=\"\">demo1</li>\r\n    </div>\r\n    <div class=\"multselectBtn\">\r\n\t\t<a href=\"javascript:void(0)\" class=\"link\" name=\"all\">全选</a>\r\n\t\t<a href=\"javascript:void(0)\" class=\"link\" name=\"sure\">确定</a>\r\n\t</div>\r\n\t</div>\r\n</div>";

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(28);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(17)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept(28, function() {
			var newContent = __webpack_require__(28);
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 70 */
/***/ (function(module, exports) {

module.exports = "<div style=\"width:1000px\">\r\n    <table class=\"table table-bordered\">\r\n        <caption>权限分配 \r\n\t\t<select name=\"search\">\r\n    \t\t<option value=\"\">全部分类</option>\r\n    \t<% _.each(data,function(el,index){%>\r\n    \t\t<option value=\"<%=el.id%>\"><%=el.name %></option>\r\n    \t<% }) %>\r\n    \t</select>\r\n        </caption>\r\n        <thead>\r\n            <tr>\r\n                <th style=\"width:25%;\">分类</th>\r\n                <th style=\"width:75%;\">权限</th>\r\n            </tr>\r\n        </thead>\r\n        <tbody>\r\n        \t<% _.each(data,function(el,index){%>\r\n            <tr elid=\"<%=el.id %>\">\r\n                <td>\r\n\t\t\t\t\t<div class=\"checkEle\" >\r\n                       <label><input type=\"checkbox\" pid=\"<%=el.pid %>\" elid=\"<%=el.id %>\"><span><%=el.name %></span></label>\r\n                    </div>             \t\r\n                </td>\r\n                <% if(el.son && el.son.length != 0){ %>\r\n                <td>\r\n                <% _.each(el.son,function(sonEl,index){%>\r\n               \r\n                    <div class=\"checkEle\">\r\n                       <label><input type=\"checkbox\" pid=\"<%=sonEl.pid %>\" elid=\"<%=sonEl.id %>\"><span><%=sonEl.name %></span></label>\r\n                    </div>\r\n              \r\n                <% }) %>\r\n                </td>\r\n                <%}%>\r\n            </tr>\r\n            <% })%>\r\n        </tbody>\r\n    </table>\r\n</div>";

/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = "<span class=\"formTitle\"><%=title %></span>\r\n<select name=\"<%=name %>\"  class=\"input-xlarge\">\r\n\t<option value=\"\">请选择</option>\r\n\t<% _.each(options,function(op,index){ %>\r\n\t\t<option value=\"<%=op.value %>\"><%=op.content %></option>\r\n\t<% }) %>\r\n</select>";

/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = "<span class=\"formTitle\"><%=title %></span>\r\n<select style=\"width:130px;\" name=\"province\">\r\n</select>\r\n<select style=\"width:130px;\" name=\"city\">\r\n  <option value=\"\">请选择</option>\r\n</select>\r\n店铺:\r\n<select style=\"width:130px;\" name=\"shop\">\r\n  <option value=\"\">请选择</option>\r\n</select>\r\n<% if(msg !=\"\"){%><div class=\"help-block\"><%=msg %></div><% } %>";

/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = " <option value=\"\">请选择</option>\r\n <% _.each(options,function(option,index){ %>\r\n \t<option value=\"<%=option.store_id %>\"><%=option.store_name %></option>\r\n <%})%>";

/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = "<span class=\"formTitle\"><%=title %></span><input type=\"file\" id=\"file\" accept=\"image/gif,image/jpeg,image/jpg,image/png,image/svg\"/>\r\n<div class=\"fileMsg\"></div>\r\n<div id=\"msg\"></div>\r\n<% if(msg !=\"\"){%><div class=\"form-msg\"><%=msg %></div><% } %>";

/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = "<span class=\"formTitle\"><% if(!allowEmpty){ %>*<% } %><%=title %></span>\r\n<input type=\"text\" <% if(readonly){ %> readonly <% }%> placeholder=\"<%=explain %>\" value=\"<%=value %>\" <% if(name !=\"\"){ %> name=\"<%=name %>\" <%} %>/>\r\n<span class=\"formError\"><%=err %></span>\r\n<% if(msg !=\"\"){%><div class=\"form-msg\"><%=msg %></div><% } %>";

/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports = "<span class=\"formTitle\"><% if(!allowEmpty){ %>*<% } %><%=title %></span>\r\n<div class=\"ueditorWindow\" id=\"winn\" >\r\n<script type=\"text/plain\" name=\"content\" id=\"uedit\" style=\"width:850px;height:500px;\">\r\n\r\n</script>\r\n</div>\r\n<% if(msg !=\"\"){%><span class=\"form-msg\"><%=msg %></span><% } %>";

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(29))(7);

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(29))(8);

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = (__webpack_require__(29))(9);

/***/ }),
/* 80 */
/***/ (function(module, exports) {

module.exports = "<span><%=title %></span>\r\n<select name=\"<%=name %>\">\r\n\t<option value=\"\"><%=defaultTitle %></option>\r\n\t<% _.each(options,function(op,index){ %>\r\n\t\t<option value=\"<%=op.value %>\"><%=op.content %></option>\r\n\t<% }) %>\r\n</select>";

/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = "<span><%=title %></span>\r\n<% if(showDate){%>\r\n\t<input name=\"start\" type=\"date\" value=\"<%=startDate %>\">\r\n<% } %>\r\n<% if(showTime){%>\r\n\t<input name=\"sttime\" type=\"time\" step=\"1\" value=\"<%=startTime %>\">\r\n<% } %>\r\n<span>至</span>\r\n<% if(showDate){%>\r\n\t<input name=\"end\" type=\"date\" value=\"<%=endDate %>\">\r\n<% } %>\r\n<% if(showTime){%>\r\n\t<input name=\"edtime\" type=\"time\" value=\"<%=endTime %>\" step=\"1\">\r\n<% } %>";

/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = "<span><%=title %></span><input type=\"text\" placeholder=\"<%=explain %>\" value=\"<%=value %>\" <% if(name !=\"\"){ %> name=\"<%=name %>\" <%} %>/>";

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"headItem head-item-title\">\r\n    <span>康展爱车管理平台</span>\r\n</div>\r\n<div class=\"headItem head-item-quit\">\r\n    <img src=\"" + __webpack_require__(84) + "\" alt=\"\"><a name=\"logout\" href=\"javascript:void(0)\" style=\"\">退出系统</a>\r\n</div>";

/***/ }),
/* 84 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU4NTlDMzU2MDE3QjExRTg5OEVERTVEMkE4QzhDMkNEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU4NTlDMzU3MDE3QjExRTg5OEVERTVEMkE4QzhDMkNEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTg1OUMzNTQwMTdCMTFFODk4RURFNUQyQThDOEMyQ0QiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTg1OUMzNTUwMTdCMTFFODk4RURFNUQyQThDOEMyQ0QiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7VaHrQAAAB7UlEQVR42rSVTShEURTHzcOoUTMlMkqYGpOVFUKyQEmykGSBjSRFFqSUWdjIQpYsbdhJko0sJhsjHxFRNpgmGflIFoTU8z91J8ftvXmXeXPq13v3nnPP/937zr3Xoet62h8sA2wBL2gEMeWRJGRAgUl/QP+xDgO/D1QZjdUMtPtAFISAR/JlsvdPyVcOrsAemLaa0bD+21olf1kCX4s0dp77eWClFDgH3H8QIgakHL1GQk8sYMbkH1kJEW2SmIcLBZlj3SSBqhAxweI2uNCL6HwALhuEiBMWW0xV1wzcojYWwFuC3cCr1GGxc8bY+yAprwrVD5Bn8ZV8Rp0WscStiD2lxoVonCkMdIJ9cA1KFOLXRO5HWopsMb1LhYOENmkV8IGIQnxYPF0k5BSNSJr9Fs+pk5Cu+HOTMU1jVVaUAoF4zi8SehANfwqEasXzWROnNFkA5NgsVCOe51SChWxvTCqUrCoNLG97vHNHdNwDzSahA3YQpMc7K5j6ig0i4yxft3xNLDJnMAmRJpZn1+g+Io5Z0Ow/RPrZ+EeQZSZEl9QhC94GdQoCfrDExsVAqdlVzlmWbskjMAXqRZV6QTUYAiEplg7dXDlnoq/sATe6ur2CUbN8VktCa9wFNkEUvLPEn+AOhMEIyE+U61uAAQAvLcipiOLZSgAAAABJRU5ErkJggg=="

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _) {const htmlTpl = __webpack_require__(86);
const img = __webpack_require__(87);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "module",

    template: _.template(htmlTpl),

    initialize: function () {
        console.log(img);
    },

    render: function () {
        this.$el.append(this.template({
            img: img
        }));
        return this;
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 86 */
/***/ (function(module, exports) {

module.exports = "<img src=\"<%=img %>\" alt=\"\">";

/***/ }),
/* 87 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD0ElEQVRoQ+VZzVLaUBQ+Bwq4E5+gzBjW1U0bVsUnUJ+g+ATiTMN013bXIc6UPoH0CYQnKK5C3Yhr4hSfQNwpCTmdG0AC3OTeSGLFss29557v/H7ngLDiP1xx/SFWALmLcjZlpXLdt3onLkPFAmDzd2UvQfAdAHJTxaluZayj3natHyWYyAFstrVaAvCQpyQB9W1KbvcK33pRgYgUgGJ8LCImfgUpR0AtU9V3nieAttZAwF2hcgnajiovovVAW7tBwKwIAAEcmWq1Jjon810aQM74lEvhcJcQswTQG6YHzfmEVNqVPgKsix5+cgD5tnYIgDMWYwmJBEfdgl6fKKw8xxDKG1oJEE/8rErk7JiF4xb7Pi6fpwIPXHbV6pbIS7LfhSGkCOJ6vqrkjUodED7wyyjcYoKKvARm4JHoZJRDVO+q+oEMiEAAMmWRPdJVqzNyFKPyBRDK3nwgojNMQtmv+uTblT/exuf1bBCQWABMHsyfa1s0pKy9ZndEHVgxtB4ivp7cjQSAy2Xu0zeBjYno2izoHsog4/jFM95cI6Cmqep7MpKEORBEDdgDUZZEZjC4W8uGoRpCAEzoq7tUAxHfL1iE4Ge3UC3JWCquM0IAD/FsaCVC2AOCLCD0gag2KZ9xKScjVxqAjLB/ceblAlDONTfm7WHyOkxSPbUXFjwwbl6MOjyURgJo2JnBgaiWP7Xy7L0ZAKzxgIMXfBoQ7SAiA9atgIP0aLpznDNe0ZilACI2SXTgZZ8ySjz2zLiJMmNOI8FDHCdy5wEEDiQO0I8rVS8/Vqkw93jMlteh5wAEDyQrACB4pnUQ9q/eVRthLLnM2Xy7wvZJb4II3kISk4Mt3ljI6LBZ0IvLKBT2rpvE9+kS6/6YpAaPinPLKADWZ6gtUNPOWKVnX0a9FgrD5cNaNsrzL5dKRGmlOGX9Px4Y7YagBIBbbBMBRF+jngfcvANYt1PWpWzBkPIA2zIgwuf5UIiqL4zKZeoUAd0yzZZmQLQvYyAhgNFK0WErj4Ufe8hU9Y1lY5w3d8vKFgIQ7oYi2DQrhtbiztwSspcGYGUGG7Lx6ucpv52qjGwhAPbo/NJpyk386QWL6+QgvYuMDpPTMdXjph8A3hwiSxylALjVYY4jEdG1Dckib9wc5w37p8Yz1QUPRC6IIZYJKYsEDdm5QwoAs9wMsQLqWWtWwy90/EIiyiUYd6BZtppM7vtttMOsDGV1kfaArMCgnJGN6zBvxQSA3/hAoiyGUZ6djQXAyAtTEARwSwilOKa52ABMLMmSf9k+EeSV2AGEDYmw51cewF/Q8PxATRpwoAAAAABJRU5ErkJggg=="

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div id=\"accordion\">\r\n<!--     <h3>DEMO预览</h3>\r\n    <ul class=\"panel-body\">\r\n        <li><a href=\"#component/headmenu\">页头组件</a></li>\r\n        <li><a href=\"#component/forform/tempFile\">文件组件</a></li>\r\n        <li><a href=\"#component/forform/tempMultiSelect\">多选组件</a></li>\r\n    </ul> -->\r\n    <h3><img src=\"" + __webpack_require__(89) + "\" alt=\"\"><span>会员管理</span></h3>\r\n    <ul class=\"panel-body active\">\r\n        <li><a class=\"active\" href=\"#views/member/memberList\">会员列表</a></li>\r\n        <li><a href=\"#views/member/memChargeRegular\">充值规则</a></li>\r\n        <!--  <li><a href=\"#views/member/memberRank\">会员等级</a></li>\r\n            <li><a href=\"#views/member/memberCharge\">充值提现</a></li> -->\r\n    </ul>\r\n    <h3><img src=\"" + __webpack_require__(90) + "\" alt=\"\"><span>服务项目</span></h3>\r\n    <ul class=\"panel-body\">\r\n        <li><a href=\"#views/project/projectList\">服务项目列表</a></li>\r\n        <li><a href=\"#views/project/projectCategory\">服务项目分类</a></li>\r\n        <li><a href=\"#views/project/projectCards\">次卡管理</a></li>\r\n    </ul>\r\n    <h3><img src=\"" + __webpack_require__(91) + "\" alt=\"\"><span>订单管理</span></h3>\r\n    <ul class=\"panel-body\">\r\n        <li><a href=\"#views/order/orderList\">订单列表</a></li>\r\n        <li><a href=\"#views/order/refundList\">退款申请列表</a></li>\r\n        <li><a href=\"#views/order/refundReasonList\">退款原因列表</a></li>\r\n        <li><a href=\"#views/order/evaluateList\">评价列表</a></li>\r\n    </ul>\r\n    <h3><img src=\"" + __webpack_require__(92) + "\" alt=\"\"><span>门店管理</span></h3>\r\n    <ul class=\"panel-body\">\r\n        <li><a href=\"#views/shop/shopList\">门店列表</a></li>\r\n    </ul>\r\n    <h3><img src=\"" + __webpack_require__(93) + "\" alt=\"\"><span>员工管理</span></h3>\r\n    <ul class=\"panel-body\">\r\n        <li><a href=\"#views/staff/staffList\">员工列表</a></li>\r\n    </ul>\r\n     <h3><img src=\"" + __webpack_require__(94) + "\" alt=\"\"><span>统计报表</span></h3>\r\n    <ul class=\"panel-body\">\r\n        <li><a href=\"#views/report/reconciliation\">对账表单</a></li>\r\n        <li><a href=\"#views/report/orderReport\">订单统计</a></li>\r\n        <li><a href=\"#views/report/cardReport\">开卡统计</a></li>\r\n        <li><a href=\"#views/report/memberReport\">会员统计</a></li>\r\n    </ul>\r\n    <h3><img src=\"" + __webpack_require__(95) + "\" alt=\"\"><span>广告管理</span></h3>\r\n    <ul class=\"panel-body\">\r\n        <li><a href=\"#views/advertisement/adPlaceList\">广告位列表</a></li>\r\n    </ul>\r\n    <h3><img src=\"" + __webpack_require__(96) + "\" alt=\"\"><span>权限管理</span></h3>\r\n    <ul class=\"panel-body\">\r\n        <li><a href=\"#views/permission/permissionList\">管理员列表</a></li>\r\n        <li><a href=\"#views/permission/roleList\">角色列表</a></li>\r\n        <!-- <li><a href=\"#views/permission/logList\">管理员日志</a></li> -->\r\n    </ul>\r\n    <h3><img src=\"" + __webpack_require__(97) + "\" alt=\"\"><span>系统管理</span></h3>\r\n    <ul class=\"panel-body\">\r\n        <li><a href=\"#views/advertisement/adArea\">城市开通地区</a></li>\r\n    </ul>\r\n    <h3><img src=\"" + __webpack_require__(98) + "\" alt=\"\"><span>回收站</span></h3>\r\n    <ul class=\"panel-body\">\r\n        <li><a href=\"#views/recycle/orderRecycleList\">订单回收</a></li>\r\n        <li><a href=\"#views/recycle/projectRecycleList\">服务项目回收</a></li>\r\n    </ul>\r\n</div>";

/***/ }),
/* 89 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAZCAYAAAAmNZ4aAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjJCNThGNDkzRUY3RDExRTc4NjU3QzI1OEUxMjQ2NkE2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjJCNThGNDk0RUY3RDExRTc4NjU3QzI1OEUxMjQ2NkE2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MkI1OEY0OTFFRjdEMTFFNzg2NTdDMjU4RTEyNDY2QTYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MkI1OEY0OTJFRjdEMTFFNzg2NTdDMjU4RTEyNDY2QTYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7CLF0RAAACIUlEQVR42rTWT0gVQRzA8dWe2hM9eBCjUkSe5sGjiFYWkUcFDQqvQgqRlxT05B80UkoIqkOHSG8dFOmQIIqgGB3FgxpqvdAk5XlQUUwoXb+/GC/Pnd2dx/aDjzzfzJvfzu5vdsaybdvyoQqfsINjRPEc2T5/f06y5R4X8BrDmEU5LuEhIljALSuR8LiyZ/iGPE37Y+yh2HTGbo2l2EehxyB9mAky8Qie+hgkjBgqTRIn/ct+PtKxiwJs+Hhi/chAs99HrCuuMkR9JpWYQqVJbekSX8YPg3HWcMUkcUjzfRr+GozzBxfVZ7mAAYRd+n/VJf6OYoPEJVhRn6+h3qN/ha64ZMYx3Ma8j8QfsIpO9X9EFZsu1t1K/g2GfCwNeXkc4moQy0kiD0u46THrCfXqbIn7Xu7WHc1vlr2urAufkaRpr8c6Mh3aZm197LrN2FKVuoh2jGiW0ROMOrQV4oauqr0SS7zFFrod1npUveVOTDenkEubbIGPcA81Du072MQ4+jAtm51Dvwe47vWMk1Grnqts+i8QcamBLPTgl9o+25AT12fV4Rkfnd3qVDSgFSl4ifc4MLhz1WjEXYzhFWbUmi6J6x+VK8rFMuZwH6FEjzOKjNeNbbzTrQj58xGDLksmUXIeW0Od7gXym6kX4acVfHQgF01O26Ks1SPr/4SMm6krii/oRQ8OA0xaoE6jA7pTZj4mpcTtYGNbHQQda+dUgAEAgTEUffkskhkAAAAASUVORK5CYII="

/***/ }),
/* 90 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkEwMjQzRjUzRUY3RDExRTc4RjlDOTdDOTE3RkI0Q0E3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkEwMjQzRjU0RUY3RDExRTc4RjlDOTdDOTE3RkI0Q0E3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTAyNDNGNTFFRjdEMTFFNzhGOUM5N0M5MTdGQjRDQTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTAyNDNGNTJFRjdEMTFFNzhGOUM5N0M5MTdGQjRDQTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6SguXfAAACIUlEQVR42rSWyytHQRTHXSSv8i7kmUSRSCJFVjbyiI0NG0lJYoOFlK0iG3+ARIqFsqJIeS0oyePnmURekUd5FD/Xd3Qm0zQzv99PnPp0u3Nec+6cOzOWbdteLiQR1IISkAViwQ3YAktgDBwYI7AkGorAlv0jTrALlmn8VdCdgjJdLF2CYSFAN8jS2KWCdvBAtlPA11USf7BBDv3Ax1CpTBf5XYIIU5JNMqz0ILhIAflfA0uVZJwMyoWxIBAOQg2EgWDBJ4PizMpJ8kkxKM1skhb4xQDTL0h+TRSvRkxyBj4U5Tts9+RR4XvLx33RxQkgDvQoOryB/gvTz2SBO8V4KxgFxSxjL80m4ZeLbYLJJOuAVWTLBX5efy+HIIh9rhzg0BjVk95pCOQNzsGAQrcDKnlJc5pyL2z3ReU/whSskk8QopllPygkG1Mlxxpd4HdnsG0EzzQ+8MeyDaLZLOZBAIj5hyQZYI1VkklnQwsYkoySQQR4NwRin/yJOkmUUjADqvkCse3hXrFwi24u+oHC94g3hLfQqqGgQ5qN083P8iG9l4MU0MYXniuWqZPywDqNxVPnfbrYVl7ACb1Hg0uwD9Ll45dt689UYvYvtxG2Nb1RjCjdoZUonN2NHiaoEtYo09UZHwlWhAtCHQgwBK8A22S/B5JkG8twJWqmP96f3vfo6vNMYyl0ReLSCfo8vRJx2Ok2QQebKFdgmiq1TDG+BBgASubHLgAVABkAAAAASUVORK5CYII="

/***/ }),
/* 91 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAYCAYAAAD6S912AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjA4MkQzRTMzRUY3RTExRTdBRjVGOEY3MUE5MERBOTJEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjA4MkQzRTM0RUY3RTExRTdBRjVGOEY3MUE5MERBOTJEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDgyRDNFMzFFRjdFMTFFN0FGNUY4RjcxQTkwREE5MkQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MDgyRDNFMzJFRjdFMTFFN0FGNUY4RjcxQTkwREE5MkQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7INVTjAAABNUlEQVR42mL8//8/AxSkArEhEDMB8T8G4gAjVP0tIJ4AxH8ZQAYC8e7/lIMXQCzFAjR1JhC7AHE0EO9kIA8YAPEeIN7OADX9LtSllODZIIOYoDa8ZKAcvGeABigIsFHBQHZkA6kGWHCICwHxHyL0fkJXh83Aj0DMR6SD/kGD6y8+A6cCsRQ00eIDoBzxFkrjdWEVNcMQ5KpeIFZAtxlHtgMltzwg/o3PQEsg1iPCQFAKuUfIhf+gBlLVy6B8zY/HhVeB+AaxBoL4uwg4AlQIuBJrIChwtYFYEIg5oS7+jxRmIPY1UnPKNUrCkOp5mQnJq5SC38gGclPBQEhWBRay+6GltioFpbUQEH8C4reMQEIAmuJBMfuVTNfBfGjPCK1GRYC4Fog10JIKcd5kYHgELaXOAwQYAJXbAoGluUkXAAAAAElFTkSuQmCC"

/***/ }),
/* 92 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAWCAYAAADafVyIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjBFRjFBN0UzRUY4MDExRTc5Q0UxOTNGQ0E3MzJCREUzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjBFRjFBN0U0RUY4MDExRTc5Q0UxOTNGQ0E3MzJCREUzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MEVGMUE3RTFFRjgwMTFFNzlDRTE5M0ZDQTczMkJERTMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MEVGMUE3RTJFRjgwMTFFNzlDRTE5M0ZDQTczMkJERTMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4F9/DGAAABd0lEQVR42rTVzysEYRjA8d2xyR78OBF78g/4XVpy4SROUg5qL/4AuSgulJSLszjYg7QH5YDzHuYgVyQOCFFqi9QmrTK+r56pt6c5jXee+uy+7zPvvs/M+87MpoIgSAk/cBdv6DLzps0HMYljPOEamVS8+EEdRnGGfHj2d1K52bqi/ziV+dpNJycd39HkRq/MuWc6Ren0OCxgVAJpmHhXB1tRxrjKF1CKmOwcKyq3ZBf4UAcXJX+i8g+S77ZynZKrqrEbYYF1GbArazetbrk59GHTyt1jCMO4sfJFGTsVJsJq5Yh7eRWPKneEtYixy3KCOsbC58DEBEZQww6e0YAF5HCFLRmbx4y0D+FLu4B+3OIAr3aBRMKz2i8oOZhzAJ8Y1AU60OagQAuyaNQFTNWqgwI1+9tTB7wk9yCd9CabCJIukEl6iVws05e95HaBJsf7kNVLso9ZfMtfX5xiZg/rpX3xdxnqVTEvT6AXc8PN7yrYxqVJ/AowAFG0vzfYaHx2AAAAAElFTkSuQmCC"

/***/ }),
/* 93 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAYCAYAAADkgu3FAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkNBQzQxNTczRUY4MDExRTc4MzYwODBFMzA5REE0OEZFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkNBQzQxNTc0RUY4MDExRTc4MzYwODBFMzA5REE0OEZFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0FDNDE1NzFFRjgwMTFFNzgzNjA4MEUzMDlEQTQ4RkUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0FDNDE1NzJFRjgwMTFFNzgzNjA4MEUzMDlEQTQ4RkUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7BQisxAAACRklEQVR42qTWS0hUURzH8RlfiTRRVLiJCqQmKbJFi7AoAss2LppZtghsEbRoI0GbFGndpk0auEgiCFcutILWpbvA6CFiBIFY+EgrxSlv33/8bp3Ge64zdw58mDvn9b/3zv+cM6kgCFIR0tiHUXzDusyjH1s947x8QS7iR+AvczhcaaAj+K4JJ5HDNrHrKbV9QSZpoAaMaKL32B4xyOqm1WcgaaA9WNQkuZiBOfX5hKokgZr0owd6Vb6BGfX5uUm/v6pSyUqgz3XnOrYUB1rFkq7bYsad1+cslku7tY3JMKzX8i4mGT6oT38l6Z3VInXTOyM5J8gsdlQSKMyq5ZgFa0FaKl2woRP4iFX8Eiuf0bHJxBeQR21cIHtFV7UYX3meaAaPFHBL0fgefFXq3wvb03+i/SutuIkOfZ/EOKacbNyPdhzCjK4n1NaLbkwr7ZswgGvunbQr06yMoxPHIvYzu7mjuIEu7FJ9r8ZaspzFcbxU3Z1wcLOTTXdxoMxj4LYT5JxT3xImVVjxTB0HS91SIoLYUmgrevI+tT23ijP6YjtyY4Iglo1vcNqpr8YDzTtme6hV3kcB3WUEqFGQgoKcctrq8NgJkg3T+63eYzknZl6H4wROOvWWykNOQmXddbSGBb3TUgNd12S3nHH1viCmhhyv1S6+G3MRO7pbCkWfK1ovdXiIPMZwWWvwv907zLhF/ctZ8LC2p9ipHWFJf2BeK63twHyBg76D7wqGdBZVIx3B+jU4u8Mo+rCGZuzFE1za8CQqvwUYAIgCd9KssgP+AAAAAElFTkSuQmCC"

/***/ }),
/* 94 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkY0N0E1NjQzRUY4MDExRTdBNUVBQ0M3MkNDQjBGMDZFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkY0N0E1NjQ0RUY4MDExRTdBNUVBQ0M3MkNDQjBGMDZFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjQ3QTU2NDFFRjgwMTFFN0E1RUFDQzcyQ0NCMEYwNkUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjQ3QTU2NDJFRjgwMTFFN0E1RUFDQzcyQ0NCMEYwNkUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7F76WHAAABcklEQVR42mL4//8/Awk44D8CxJKilxRLzKEWrAfi1VC2Ly0smgs1HMYHgV3E6mdiIB78RuN/B+K/xGpGt8gSiC8C8X0gjiBgESMQ/yLHIikgPgbEQkD8GoiXA7E3A2mAFYhrgbgSXYIFiZ0KpWWhNDAGGQqBeCuRlggA8SkgVoXyw4DYBoi/ovtIBE3jNyzBhQ8UQy0BmSMNxAZAnI7NR9+wBOsvEixSAeIfQPwWSUwdV2KgBHyFBjcy4MXmI0rBf2hKhIFyID5DC4vQQRe+fERNcAeIq+lhkTIQK9LDIhD4RC+LGEaGRTxY8gUnEp8TizwXEp8LS4blxGbRXSjNjKToJ5L8ZyyGIIt9wOIYRHGEVAtyA/E7aM35FkqbIsnLAfE3IP4JxF+g8vpI8upQsc9A/AuIf0D1YK3KpYF4GxAfQ7MEhpWBeC8QHwRiXSzyelC5vVC1cDlGsG3DKdWxQEtZGRrb8x0UdPeQyyRaAYAAAwAKKdDhxm89lAAAAABJRU5ErkJggg=="

/***/ }),
/* 95 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAWCAYAAAAxSueLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjlCOEQyRTMzRUY4MTExRTc4MEUwQTU3REU0MkUyMTQ2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjlCOEQyRTM0RUY4MTExRTc4MEUwQTU3REU0MkUyMTQ2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OUI4RDJFMzFFRjgxMTFFNzgwRTBBNTdERTQyRTIxNDYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OUI4RDJFMzJFRjgxMTFFNzgwRTBBNTdERTQyRTIxNDYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5zc5mWAAAA/UlEQVR42mL4//+/MhAf/09bcBuI7RiBxF0GBgYlIN4FxN+AmImBeuA/EDMDsQ8Q/2GA2rwPiBloiHtAlsB88YaBtuAdA1KQsdPYMk5ky77R2LIPIAKUQL4D6c9AfJKCxPERiP8BsSAWub9ArAXE0iDLQLbyM9AefARZ9g+a7KMoMOgUNPuI4JCvBuJCFlBQAvEXWIohE/xCTnVYwFuQPbA4YqMwiJgJyHMxULm0IAhGLRu1bPBZ9oVCc/4RkH+PbJk2rBqgQQiBMrwJrNRfCaTD6BCKV0BlYzgQXwdiFyDmICJI0AGobH0JbmMAqxGktgdMDlTFHAfiBoAAAwCYmPMFKnftIgAAAABJRU5ErkJggg=="

/***/ }),
/* 96 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAbCAYAAACX6BTbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQ2RkQ0NUMzRUY4MjExRTdBMzlDQkE1NjM2RjRBNzBEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQ2RkQ0NUM0RUY4MjExRTdBMzlDQkE1NjM2RjRBNzBEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDZGRDQ1QzFFRjgyMTFFN0EzOUNCQTU2MzZGNEE3MEQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDZGRDQ1QzJFRjgyMTFFN0EzOUNCQTU2MzZGNEE3MEQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz43YV0vAAACEklEQVR42qyWTShEURTHrzE+iiKZsJGyIIQFMzaysLCYjWJDKaTIQhaIUgoLiyllI1moWYzPJAslYiWRUkSaRGRj4zMZn+N/Oa9Or7lzH+PUb+7cc8793/vux7tPBINBYYEqsBb8sUvQAZJ17VSBdFDNBA3zgwCrn1JHuTrxDFALdkyCu6ABxLLcUjAP3lneA+jiHckfB/CxpE8wB+pAjIUpKwFj4Ixp7AOXDHaTYxXUWFwDFYXUkbQN6einiiNCYc4N2LYJIV7Fj2UJtbWBY3ALjkCDCG9SN2BjjihF4gAYB1ghsUw+L+gSOsPwe2hanCEez0WxfpN/hPzFimm5A5s2Td9ydG9g2OTvpSfp1M1NOHOAR0XsCaRGIj4NUkCeye8EicAXifgE8LMdIkWbwA440Inbhd6ctEu8zLcCaoWF/aize1ABBtliusHzf4gbdkKl32oDKR5H/wOa3CQqp8Cl5pR+gFg7E43XnTfWSaJmGyaATznyBXK0asSjqWynjTCqyKuh2Vg0jussHef8MG+6PsppDJOTSTkXIMpY0BbwAvboVIayZCrTFPFsttiV39NoetFLewY5ihtnBhSEiLnZLVSouqDLWFKzxYvBQ/nX5kGFSpYX9Tk1WKe66u68orwlYLf6aSEZYk/hYbe/FJlksfrffrcYFIEtJrTK/i+AtL98FJkpB4ckekZ1bbsvAQYAMT1FhXFPs4EAAAAASUVORK5CYII="

/***/ }),
/* 97 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjI2NjAwMjczRUY4MzExRTc4RDgwQjQ2QjU1Q0E5RjcxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjI2NjAwMjc0RUY4MzExRTc4RDgwQjQ2QjU1Q0E5RjcxIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjY2MDAyNzFFRjgzMTFFNzhEODBCNDZCNTVDQTlGNzEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjY2MDAyNzJFRjgzMTFFNzhEODBCNDZCNTVDQTlGNzEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5dxQuyAAACI0lEQVR42qyWTUhUURTH37zMVNBaRSEEggaCm+hj5aJABcVNiIKSGCqGMNAuiHKlULpqXDoLISRKQVy4KBjQzSiJHzTEIDKiQqHEJBFRDKXP/83/0+v1vDePwQO/ee+ee849991z7r1jOY5jBaAEzDjHsgJKg/haAQN0cOCHoJ3vQ7kGaAR9hm6Ig7ptJdOGzXMG9w3wRFuGr6AZvGV7VLPrp+4DaAILml/EK0ATDdTzPNhk+xfoFb70AfhGm12QD+6wHZYCvDKWQXEtwDqXGe2/4L0UoAgkwDooDJh8HRvMc2kveeXA/cTrOQQoom+XX5LHwT5zYPbdAiNM9j2hPwS2mfATAfJY325lSAkdYN8WSPE9KtjVsu8F6AYXlXJOKzHJ6Qb7HgsVV+czGSVJd9N0+qztGybO1H8ESz5+KrhjW4eStrylEGQE/W9Q4OO38/+XZankJ3gmzOQu++9rutvUtQr2jziWkrRSXOa6TVDZIjhF2RfXTtUpwc4t80meX+WmgXL+w5Iz++pBDMyCNo91VxW24bcPbnIGFTlstIJsG83mDL+D4hwCnAOr4DMPvlMBBoXDLj/gwHp7X8+PrZVVis8qPuMszyRoEMqwGiyAf+ATdVdACCSOrIzo7pH9A2TAU7BI3UvNLkzdGm+yL7w3lLzLdmWqs2gMXNB0EeHKjBl+r4WrNvCl38NBa3iSKhk+y38VV8EyB97j0lQG8T0QYACCCLtuXXiUYAAAAABJRU5ErkJggg=="

/***/ }),
/* 98 */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAAbFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8+T+BWAAAAI3RSTlMAKbfaR5L1llcuB/niil/t69PItaykoYN8bU4fHREMwW5mEu138r4AAACVSURBVCjP3dLHDsIwFETRwQGn995o8///SHhICYkTiTVnY43uypYhrpXPmV89sXgwsWYJHSyi7+Uwgji/2bTlXA3wEMKSwcUQsAwBjwUMBT0AJyoYFE+/pVoNwKDqnZTRBVxmRpIl499S+rlyupO6dgTGtlulHIb8+OVvkvpYR9hwdNxjElJbG5qNJ/+zsXyuBfepvAC5YBXLAQeigAAAAABJRU5ErkJggg=="

/***/ }),
/* 99 */
/***/ (function(module, exports) {

module.exports = "<span class=\"batchTitle\">批量操作</span>\r\n<select style=\"width: 100px;\">\r\n\t<option value=\"\">请选择</option>\r\n\t<% _.each(options,function(op,index){ %>\r\n\t\t<option value=\"<%=op.value %>\"><%=op.content %></option>\r\n\t<% }) %>\r\n</select>\r\n<a href=\"javascript:void(0)\">确定</a>";

/***/ }),
/* 100 */
/***/ (function(module, exports) {

module.exports = "<span>充值金额：</span>\r\n<input type=\"number\" min=\"0\" name=\"recharge_money\" step=\"5\" value=\"<%=charge %>\"> --- <span>赠送金额：</span>\r\n<input type=\"number\" min=\"0\" name=\"gift_amount\" step=\"5\" value=\"<%=give %>\"> <a num=\"<%=num %>\" href=\"javascript:void(0)\" id=\"delete\">删除</a> <% if(isNew){%> <label> new </label> <% }%>";

/***/ }),
/* 101 */
/***/ (function(module, exports) {

module.exports = "<% if(show){ %>\r\n<ul class=\"pagination pagination-sm\">\r\n\r\n    <% if(currentPage <= 1){ %>\r\n        <li class=\"disabled\"><a href=\"javascript:void(0)\" class=\"move\" name=\"left\">&laquo;</a></li>\r\n    <% }else{ %>\r\n        <li><a href=\"javascript:void(0)\" class=\"move\" name=\"left\">&laquo;</a></li>\r\n    <% } %>\r\n    <% if(totalPage <= pageRange){%>\r\n        <% for(var i = 1 ; i <= totalPage ; i++){ %>\r\n            <% if(currentPage == i){%>\r\n                <li class=\"active\"><a href=\"javascript:void(0)\"><%=i %></a></li>\r\n            <% }else{ %>\r\n                <li><a  href=\"javascript:void(0)\"><%=i %></a></li>\r\n           <% } %>\r\n        <% } %>\r\n    <% } %>\r\n\r\n    <% if(totalPage > pageRange){ %>\r\n        <% if(currentPage <=4 ){ %>\r\n           <% for(var i = 1 ; i <= pageRange ; i++){ %>\r\n               <% if(currentPage == i){%>\r\n                 <li class=\"active\"><a href=\"javascript:void(0)\"><%=i %></a></li>\r\n                <% }else{ %>\r\n                   <li><a  href=\"javascript:void(0)\"><%=i %></a></li>\r\n              <% } %>\r\n            <% } %>\r\n        <% }%>\r\n        <% if(currentPage >4  && currentPage < (totalPage-5)){ %>\r\n           <% for(var i = currentPage-4 ; i <= (currentPage+5) ; i++){ %>\r\n               <% if(currentPage == i){%>\r\n                 <li class=\"active\"><a href=\"javascript:void(0)\"><%=i %></a></li>\r\n                <% }else{ %>\r\n                   <li><a  href=\"javascript:void(0)\"><%=i %></a></li>\r\n              <% } %>\r\n            <% } %>\r\n        <% }%>\r\n     <% if(currentPage >= (totalPage-5)){ %>\r\n           <% for(var i = (totalPage-9) ; i <= totalPage ; i++){ %>\r\n               <% if(currentPage == i){%>\r\n                 <li class=\"active\"><a href=\"javascript:void(0)\"><%=i %></a></li>\r\n                <% }else{ %>\r\n                   <li><a  href=\"javascript:void(0)\"><%=i %></a></li>\r\n              <% } %>\r\n            <% } %>\r\n        <% }%>\r\n    <% }%>\r\n    <% if(currentPage >= totalPage){ %>\r\n        <li class=\"disabled\"><a href=\"javascript:void(0)\" class=\"move\" name=\"right\">&raquo;</a></li>\r\n    <% }else{ %>\r\n        <li><a href=\"javascript:void(0)\" class=\"move\" name=\"right\">&raquo;</a></li>\r\n    <% } %>\r\n   <span class=\"pagecomp\"> 共 <%=totalPage %> 页,</span>\r\n    <span>跳转至 </span><input style=\"width:30px;border-left-width:0px;border-top-width:0px;border-right-width:0px;border-bottom-color:black\" class=\"pageskip\" type=\"text\"><span>页，共 <%=total %> 条记录</span>\r\n</ul>\r\n\r\n<% } %>";

/***/ }),
/* 102 */
/***/ (function(module, exports) {

module.exports = "<thead>\r\n\t<th>分类名称</th>\r\n\t<th>数量</th>\r\n\t<th>是否出现在导航栏</th>\r\n\t<th>是否显示</th>\r\n\t<th>排序</th>\r\n\t<th style=\"width:200px\">操作</th>\r\n</thead>\r\n<tbody>\r\n\t\r\n</tbody>";

/***/ }),
/* 103 */
/***/ (function(module, exports) {

module.exports = "<% _.each(array,function(el,index){ %>\r\n    <tr pid=\"<%=el.pid %>\" uid=\"<%=el.id %>\">\r\n        <td>\r\n            <%=el.name %>\r\n                <% if(el.son){ %><a class=\"isShow\" href=\"javascript:void(0)\">展开</a>\r\n                    <% } %>\r\n        </td>\r\n        <td>\r\n            <%=el.num %>\r\n        </td>\r\n        <td>\r\n            <%=el.is_navigation==1?\"是\":\"否\" %>\r\n        </td>\r\n        <td>\r\n            <%=el.is_show==1?\"是\":\"否\" %>\r\n        </td>\r\n        <td>\r\n            <%=el.sort %>\r\n        </td>\r\n        <td><a class=\"btn btn-xs\" elID=\"<%=el.id %>\" href=\"#views/project/form/categoryEdit/code<%=el.id %>\">编辑</a>\r\n            <a name=\"del\" class=\"btn btn-xs\" elID=\"<%=el.id %>\" href=\"javascript:void(0)\">删除</a></td>\r\n    </tr>\r\n    <%})%>";

/***/ }),
/* 104 */
/***/ (function(module, exports) {

module.exports = "<% if(showSearch){%>\r\n    <div class=\"schMain\">\r\n        <% for(var i=0 ; i < linesNum ; i++){ %>\r\n            <div class=\"schItem item<%=i %>\"></div>\r\n        <% } %>\r\n    </div>\r\n    <% } %>\r\n        <div class=\"schOpration\">\r\n            <% if(showSearch){%>\r\n                <a href=\"javascript:void(0)\" class=\"btn btn-info searchBtn\">搜索</a>\r\n                <% } %>\r\n            <% if(showAdd){ %>\r\n                <a name=\"link\" href=\"<% if(addHref !=null){ %><%=addHref %><%}else{%>javascript:void(0)<%}%>\" class=\"btn btn-info searchBtn\"><%=addTitle %></a>\r\n                <% } %>\r\n        </div>";

/***/ }),
/* 105 */
/***/ (function(module, exports) {

module.exports = "<table class=\"table table-striped table-bordered table-hover table-condensed text-nowrap\">\r\n<% if(datas.length==0){ %>\r\n\t<th><div style=\"color:red;font-size:30px;text-align: center;\">很抱歉，没有可展示的数据</div></th>\r\n<% }else{ %>\r\n\t<thead>\r\n\t    <tr>\r\n\t    <% if(hasCheckBox){%>\r\n\t   \t\t<th style=\"width:35px\"><input type=\"checkbox\" name=\"checkall\" /></th>\r\n\t    <% }%>\r\n\t    <% _.each(theads,function(thead,index){ %>\r\n\t\t\t<th><%=thead %></th>\r\n\t    <% }) %>\r\n\t    <% if(hasOpration){%>\r\n\t    \t<th style=\"width:190px;\">操作</th>\r\n\t    <% } %>\r\n\t    </tr>\r\n\t</thead>\r\n\t<tbody>\r\n\t    <% _.each(datas,function(el,index){ %>\r\n\t        <tr>\r\n\t         <% if(hasCheckBox){%>\r\n\t \t\t\t   <td><input type=\"checkbox\" <% if(checkId != null){ %>checkId=\"<%=el[checkId]%>\" <% } %> /></td>\r\n\t\t\t <% }%>\r\n\t            <% _.each(rows,function(row,index){ %>\r\n\t            <% if(row.isSkip){%>\r\n\t            \t <td>\r\n\t                   <a href=\"#<%=row.link+ '/code' +el[row.code] %>\"><%=el[row.name] %></a> \r\n\t                </td>\r\n\t            <% }else{ %>\r\n\t                <td>\r\n\t                    <%=el[row.name] %>\r\n\t                </td>\r\n\t               <% } %>\r\n\t            <% })  %>\r\n\t             <% if(hasOpration){%>\r\n\t           \t\t<td>\r\n\t           \t\t<% _.each(opration,function(op,index){ %>\r\n\t           \t\t\t<a class=\"btn  btn-xs\" <% if(op.other){%>other=\"<%=el[op.other] %>\"<%}%> <% if(op.link){ %> href=\"#<%=op.link + '/code' + el[op.elID]%>\" <% }else{ %>href=\"javascript:void(0)\"<%}%> name=\"<%=op.elName %>\" elID=\"<%=el[op.elID] %>\"><%=op.name %></a>\r\n\t           \t\t<% }) %>\r\n\t           \t\t</td>\r\n\t            <% } %>\r\n\t        </tr>\r\n\t    <% }) %>\r\n\t</tbody>\r\n<% } %>\r\n</table>";

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(107);
const htmlItem = __webpack_require__(108);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click input[name='province']": "onClickLabel",
        "click #open": "onClickOpen"
    },

    initialize: function (loginKey) {
        this.key = loginKey;

        this.listenTo(this, "dataReady", this.fillPage);
        this.url = 'https://www.kziche.com/admin/Ad/locationInfo';
        this.tableParam = {
            key: this.key
        };
        this.queryData(this.url, this.tableParam);
    },

    render: function () {
        this.$el.append(this.template({
            titles: ["系统管理", "开通城市"],
            back: false
        }));
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {},
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param) {
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillPage: function (data) {
        var templateItem = _.template(htmlItem);
        this.$("#cont").append(templateItem({
            items: data
        }));
    },

    getValue: function () {
        var ids = [];
        this.$("input[type='checkbox']:checked").each(function (index, e) {
            ids.push($(e).attr("elid"));
        });
        return ids.join(",");
    },

    onClickLabel: function (e) {
        e.stopPropagation();
        var id = $(e.target).attr("elid");
        if ($(e.target).prop("checked")) {
            this.$el.find("input[pid='" + id + "']").prop("checked", true);
        } else {
            this.$el.find("input[pid='" + id + "']").prop("checked", false);
        }
    },

    removeEl: function () {
        this.remove();
    },

    onClickOpen: function () {
        var ids = this.getValue();
        var me = this;
        $.ajax({
            url: 'https://www.kziche.com/admin/Ad/openArea',
            type: 'get',
            data: {
                key: me.key,
                area_ids: ids
            },
            success: function (res) {
                if (res.code == 200) {
                    alert("上传成功");
                    this.trigger('confirmFinish');
                } else {
                    alert(res.msg);
                    this.trigger('confirmFail', res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"pageHead\">\r\n    <div class=\"phLeft\"><img src=\"" + __webpack_require__(10) + "\" alt=\"\">&nbsp&nbsp<span style=\"color:#9e9e9e;\">当前位置：</span>\r\n        <% _.each(titles,function(title,index){%>\r\n           <% if(titles.length-1 > index){ %>\r\n            \t<span><%=title%></span> >\r\n           <% }else{ %>\r\n            \t<span><%=title%></span>\r\n            <% } %>\r\n        <%})%>\r\n    </div>\r\n    <div class=\"phRight\">\r\n        <% if(back){%>\r\n            <a onClick=\"javascript :history.back(-1);\" href=\"javascript:void(0)\" class=\"btn btn-info back\">返回</a>\r\n        <% } %>\r\n    </div>\r\n</div>\r\n<div class=\"panel panel-default\">\r\n<div class=\"panel-body\">\r\n\t\r\n\t\t<div class=\"row\">\r\n\t\t\t<div class=\"col-md-12\" id=\"search\"><button type=\"button\" id=\"open\" class=\"btn btn-primary\">开&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp通</button></div>\r\n\t\t</div>\r\n\t\t<hr>\r\n\t\t<div class=\"row\">\r\n\t\t\t<div id=\"cont\" class=\"col-md-12\"></div>\r\n\t\t</div>\r\n</div>\r\n</div>";

/***/ }),
/* 108 */
/***/ (function(module, exports) {

module.exports = "<% _.each(items,function(item,index){%>\r\n<p>\r\n\t\t<h3><label><input name=\"province\" type=\"checkbox\" elid=\"<%=item.id%>\" value=\"<%=item.code %>\" <% if(item.is_open == 1){%>checked=\"checked\"<% } %>/><%=item.name %></label></h3>\r\n\t\r\n\t\t<% if(item.son){%>\r\n\t\t\t<% _.each(item.son,function(sub,index){%>\r\n\t\t\t\t<label><input type=\"checkbox\" pid=\"<%=sub.pid %>\" elid=\"<%=sub.id%>\" value=\"<%=sub.code %>\" <% if(sub.is_open == 1){%>checked=\"checked\"<% } %>/> <%=sub.name %></label>\r\n\t\t\t<%})%>\r\n\t\t<%}%>\r\n</p>\r\n<%})%>\r\n";

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function (loginKey) {
        this.$el.html(this.template({
            titles: ["广告管理", "广告位列表"],
            back: false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd: true,
            addLink: "#views/advertisement/form/adPlaceEdit",
            showSearch: true,
            linesNum: 1
        });
        this.key = loginKey;

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Ad/adPosition';
        this.tableParam = {
            key: this.key,
            searchCriteria: '',
            page: 1,
            getpage: 15
        };
        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        // this.$('#pg').append(this.pagement.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ["广告位名称", "高度(px)", "宽度(px)", "创建时间"]; //表头
        var rows = ["name", "height", "weight", "create_time"]; //表列
        var opration = [{ name: "查看广告", elID: "id", elName: "see", link: "views/advertisement/form/advertList" }, { name: "编辑", elID: "id", elName: "xq", link: "views/advertisement/form/adPlaceEdit" }, { name: "删除", elID: "id", elName: "sh" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("id");

        //搜索栏配置
        var searchComponents = [{
            type: 'text',
            line: 0,
            param: {
                title: "搜索条件",
                value: "",
                explain: "要查询的广告位名称",
                name: "text"
            }
        }];
        this.search.setParam(searchComponents);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        this.pagement.clearPage();
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1,
                            total: res.count
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function () {
        var searchText = this.search.getElByName('text');
        this.tableParam.searchCriteria = searchText.getValue();
        this.tableParam.page = 1;
        this.queryData(this.url, this.tableParam, true);
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        if (data.length == 0) {
            this.pagement.clearPage();
        }
        this.table.setData(data);
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(11);
const compText = __webpack_require__(7);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #confirm": "onClickConfirm",
        "click #clear": "onClickClear",
        "click #back": "onClickBack"
    },

    initialize: function (code, upUrl, loginKey) {
        this.code = code || 0;
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["广告管理", "广告位详情"],
            back: upUrl
        }));

        this.textName = new compText();
        this.textWeight = new compText();
        this.textHeight = new compText();

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this, 'confirmFinish', this.confirmFinish); //表单提交成功后的回调函数

        this.url = 'https://www.kziche.com/admin/Ad/showAdPosition';
        this.param = {
            key: this.key,
            id: code
            //如果传入参数则为编辑页面，没有则为添加页面
        };if (typeof code !== "undefined" && code != null) {
            this.queryData(this.url, this.param);
        }
    },

    render: function () {
        this.$('#main').append(this.textName.render().el);
        this.$('#main').append(this.textWeight.render().el);
        this.$('#main').append(this.textHeight.render().el);

        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        this.textName.setParam({
            title: "广告位名称"
        });
        this.textWeight.setParam({
            title: '宽度',
            msg: "格式为整数,单位是px",
            pattern: /^\d*$/,
            err: "请输入数字!"
        });
        this.textHeight.setParam({
            title: '高度',
            msg: "格式为整数,单位是px",
            pattern: /^\d*$/,
            err: "请输入数字!"
        });
    },

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function (url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillPage: function (data) {
        //这里再进行数据的装配
        this.textName.setValue(data.name);
        this.textWeight.setValue(data.weight);
        this.textHeight.setValue(data.height);
    },

    onClickClear: function () {},

    confirmFinish: function () {
        alert("提交成功");
        window.history.back();
    },

    onClickConfirm: function () {
        var name = this.textName.getValue();
        var weight = this.textWeight.getValue();
        var height = this.textHeight.getValue();

        $.ajax({
            url: 'https://www.kziche.com/admin/Ad/addAdPOsition',
            type: 'post',
            data: {
                key: this.key,
                id: this.code,
                name: name,
                weight: weight,
                height: height
            },
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('confirmFinish');
                } else {
                    var temp = {};
                    alert(res.msg);
                    // this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(11);
const compSelect = __webpack_require__(8);
const compText = __webpack_require__(7);
const compFile = __webpack_require__(13);
const compUeditor = __webpack_require__(15);
const compAdArea = __webpack_require__(27);
const compCheckbox = __webpack_require__(12);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #confirm": "onClickConfirm",
        "click #clear": "onClickClear",
        "click #back": "onClickBack"
    },

    initialize: function (code, upUrl, loginKey) {
        this.code = code || 0;
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["广告管理", "广告位列表", "广告详情"],
            back: upUrl
        }));

        this.textAdName = new compText();
        this.textAdLink = new compText();
        this.textAdDescribe = new compText();

        this.selectStatu = new compSelect();
        this.checkboxType = new compCheckbox();
        this.selectArea = new compAdArea();

        this.filePhoto = new compFile();
        this.ueditorDetail = new compUeditor();

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this, "pageReady", this.goQueryData); //等待页面所有元素加载完毕
        this.listenTo(this, "renderFinish", this.renderPlugin);
        this.listenTo(this, 'confirmFinish', this.confirmFinish); //表单提交成功后的回调函数
        this.listenTo(this, 'confirmFail', this.confirmFail);
    },

    render: function () {
        this.$('#main').append(this.textAdName.render().el);
        this.$('#main').append(this.textAdDescribe.render().el);
        this.$('#main').append(this.selectStatu.render().el);
        this.$('#main').append(this.selectArea.render().el);
        this.$('#main').append(this.filePhoto.render().el);
        this.$('#main').append(this.checkboxType.render().el);
        this.$('#main').append(this.textAdLink.render().el);
        this.$('#main').append(this.ueditorDetail.render().el);
        return this;
    },

    renderPlugin: function () {
        this.ueditorDetail.trigger("renderFinish");
    },

    goQueryData: function () {
        this.url = 'https://www.kziche.com/admin/Ad/showAd';
        this.param = {
            key: this.key,
            id: this.code
        };
        //如果传入参数则为编辑页面，没有则为添加页面
        if (this.code != 0) {
            this.queryData(this.url, this.param);
        }
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        this.textAdName.setParam({
            title: "广告名"
        });
        this.textAdDescribe.setParam({
            title: "广告简介",
            msg: "简要说明广告内容"
        });
        this.textAdLink.setParam({
            title: '广告链接',
            msg: "请提供广告的链接URL"
        });
        this.selectStatu.setParam({
            title: "广告状态",
            options: [{
                value: 1,
                content: "显示"
            }, {
                value: 2,
                content: "隐藏"
            }]
        });
        this.checkboxType.setParam({
            title: "广告投放方式",
            options: [{
                value: 1,
                content: "链接"
            }, {
                value: 2,
                content: "富文本"
            }]
        });
        this.filePhoto.setParam({
            title: "广告图片"
        });
        this.ueditorDetail.setParam({
            title: "广告富文本编辑",
            msg: "在这里编辑广告页面"
        });
        this.selectArea.setParam({
            title: "广告投放地区"
        });
        this.fillSelectOption();
    },

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function (url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillPage: function (data) {
        //这里再进行数据的装配
        this.textAdName.setValue(data.title);
        this.textAdLink.setValue(data.url);
        this.textAdDescribe.setValue(data.decribe);

        this.selectStatu.setValue(data.status);
        this.selectArea.setValue(data.location_ids.split(","));

        this.filePhoto.setFile(data.pic);
        this.ueditorDetail.setValue(data.content);
        this.checkboxType.setValue(data.type);
    },

    onClickClear: function () {},

    onClickConfirm: function () {
        var name = this.textAdName.getValue();
        var link = this.textAdLink.getValue();
        var position = window.sessionStorage.getItem("position");
        var statu = this.selectStatu.getValue();
        var photo = this.filePhoto.getFiles();
        var isChange = this.filePhoto.isChange();
        var content = this.ueditorDetail.getValue();
        var decribe = this.textAdDescribe.getValue();
        var area = this.selectArea.getValue();
        var adType = this.checkboxType.getValue();

        var form = new FormData();
        form.append('id', this.code);
        form.append('key', this.key);
        form.append('name', name);
        form.append('pic', photo[0]);
        form.append('status', statu);
        form.append('content', content);
        form.append('url', link);
        form.append('decribe', decribe);
        form.append('type', adType);
        form.append('location_ids', area);
        form.append('position_id', position);
        form.append('oss_photo_notnull', isChange);

        $.ajax({
            url: 'https://www.kziche.com/admin/Ad/addAd',
            type: 'post',
            data: form,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('confirmFinish');
                } else {
                    this.trigger('confirmFail', res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    /**
     * 填装多选组件的option,组件option为异步获取，所以在加载完成option后需出发pageReady事件。保证页面渲染完成
     * @return {[type]} [description]
     */
    fillSelectOption: function () {
        var me = this;
        var resArray = [];
        $.ajax({
            url: "https://www.kziche.com/admin/Ad/locationInfo",
            type: 'get',
            dataType: 'json',
            data: {
                key: me.key
            },
            success: function (res) {
                if (res.code == 200) {
                    for (let i = 0; i < res.data.length; i++) {
                        if (res.data[i].is_open == 1) {
                            resArray.push({
                                content: res.data[i].name,
                                value: res.data[i].code
                            });
                        }
                        if (res.data[i].son) {
                            var son = res.data[i].son;
                            for (let j = 0; j < son.length; j++) {
                                if (son[j].is_open == 1) {
                                    resArray.push({
                                        content: son[j].name,
                                        value: son[j].code
                                    });
                                }
                            }
                        }
                    }
                    me.selectArea.setOptions(resArray);
                }
                me.trigger("pageReady");
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    confirmFinish: function () {
        alert("提交成功");
        window.history.back();
    },

    confirmFail: function (msg) {
        alert(msg);
    },

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function (code, upUrl, loginKey) {
        window.sessionStorage.setItem('position', code);
        this.key = loginKey;

        this.code = code || 0;
        this.$el.html(this.template({
            titles: ["广告管理", "广告位列表", "广告列表"],
            back: true
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd: true,
            addLink: "#views/advertisement/form/advertEdit",
            showSearch: true,
            linesNum: 1
        });

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Ad/adList';
        this.tableParam = {
            key: this.key,
            searchCriteria: '',
            page: 1,
            getpage: 15,
            position_id: this.code
        };
        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        // this.$('#pg').append(this.pagement.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ["广告标题", "广告位", "状态", "显示类型"]; //表头
        var rows = ["title", "position_name", "status_name", "type_name"]; //表列
        var opration = [{ name: '编辑', elID: 'id', elName: "bj", link: "views/advertisement/form/advertEdit" }, { name: '隐藏', elID: 'id', elName: "hide" }, { name: '删除', elID: 'id', elName: "del" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("id");

        //搜索栏配置
        var searchComponents = [{
            type: 'text',
            line: 0,
            param: {
                title: "搜索条件",
                value: "",
                explain: "要查询的广告位名称",
                name: "text"
            }
        }];
        this.search.setParam(searchComponents);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        this.pagement.clearPage();
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1,
                            total: res.count
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function (param) {
        var searchText = this.search.getElByName('text');
        this.tableParam.searchCriteria = searchText.getValue();
        this.tableParam.page = 1;
        this.queryData(this.url, this.tableParam, true);
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        if (data.length == 0) {
            this.pagement.clearPage();
        }
        this.table.setData(data);
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);

var model = Backbone.Model.extend({
    url: "https://www.kziche.com/admin/Member/memberList",
    parse: function (response, param) {
        return response;
    }
});

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #test2": "onClickTest2"
    },

    initialize: function () {
        this.modelMem = new model();

        this.$el.html(this.template({
            titles: ["管理中心", "页面正式标题"],
            back: true
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd: false,
            addLink: "",
            showSearch: true,
            linesNum: 2
        });

        this.listenTo(this.search, "goSearch", this.goSearch);
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.tableParam = {
            isexport: 1,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            key: '1kzm151435708962984681'
        };

        this.modelMem.on("change", this.dataSuccess, this);
        this.modelMem.on("error", this.dataError, this);

        this.modelMem.fetch({
            type: 'get',
            dataType: 'json',
            data: this.tableParam,
            firstTime: true
        });
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ["用户名", "性别", "用户来源", "车牌", "手机号", "会员等级", "积分", "余额", "赠送金额", "注册日期", "实名认证"]; //表头
        var rows = ['nickname', 'sex', 'source_name', 'license_plate', 'phone', 'grade_name', 'integral', 'balance', 'gift_amount', 'create_time', 'is_validate']; //表列
        var opration = [{ name: '编辑', elID: 'id', elName: "edt", link: "views/member/form/memberEdit" }, { name: '订单', elID: 'id', elName: "ord", link: "views/order/orderList" }, { name: '冻结', elID: 'id', elName: "dj" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("id");

        //搜索栏配置
        var searchComponents = [{
            type: 'daterange',
            line: 0,
            param: {
                title: "时间范围",
                name: "daterange",
                startDate: this.getDate('month', 3),
                endDate: this.getDate()
            }
        }, {
            type: 'text',
            line: 1,
            param: {
                title: "输入条件",
                value: "",
                explain: "用户名/手机号",
                name: "text"
            }
        }];
        this.search.setParam(searchComponents);
    },

    dataSuccess: function (mod, option) {
        var code = mod.get("code");
        var firstTime = option.firstTime;
        if (code == 200) {
            this.trigger('dataReady', mod.get("data"));
            if (firstTime) {
                this.pagement.clearPage();
                var totalPage = Math.ceil(mod.get("count") / this.pagement.getPageSize());
                this.pagement.setParam({
                    totalPage: totalPage,
                    currentPage: 1
                });
                this.$('#pg').append(this.pagement.render().el);
            }
        } else {
            var temp = [];
            this.trigger('dataReady', temp);
        }
    },

    dataError: function (mod, option) {},

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.modelMem.fetch({
            type: 'get',
            dataType: 'json',
            data: this.tableParam,
            firstTime: false
        });
    },

    goSearch: function () {
        var dateRange = this.search.getElByName('daterange');
        var searchText = this.search.getElByName('text');

        this.tableParam.searchCriteria = searchText.getValue();
        this.tableParam.signStartTime = dateRange.getStartDate();
        this.tableParam.signEndTime = dateRange.getEndDate();
        this.tableParam.page = 1;
        this.modelMem.fetch({
            type: 'get',
            dataType: 'json',
            data: this.tableParam,
            firstTime: true
        });
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        if (data.length == 0) {
            this.pagement.clearPage();
        }
        this.table.setData(data);
    },

    getDate: function (type, param) {
        let date = new Date();
        if (type && type == "month") {
            date.setMonth(date.getMonth() - param);
        }
        if (type && type == "day") {
            date.setDate(date.getDate() - param);
        }
        let day = date.getDate();
        let month = date.getMonth() + 1;

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        let year = date.getFullYear();
        let result = year + "-" + month + "-" + day;
        return result;
    }
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(11);
const compCheckbox = __webpack_require__(12);
const compDate = __webpack_require__(14);
const compFile = __webpack_require__(20);
const compSelect = __webpack_require__(8);
const compText = __webpack_require__(7);

// require("/ueditor/ueditor.config.js");
// require("/ueditor/ueditor.all.js");
// require("/ueditor/lang/zh-cn/zh-cn.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "panel panel-default",

    template: _.template(htmlTpl),

    initialize: function (code) {
        this.$el.html(this.template({
            title: "表单页面",
            sub: "这个页面用于生成表单"
        }));

        this.checkbox = new compCheckbox();
        this.text = new compText();
        this.select = new compSelect();
        this.fileEl = new compFile();
        this.dateEl = new compDate({
            date: '2017-10-10'
        });

        this.listenTo(this, 'dataReady', this.fillPage);

        this.initParamOfPage();

        this.url = 'http://www.kzxueche.com/institutionapi/Baseinsti/security_guardList';
        this.param = {
            isexport: 1,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            key: '40kzm151243778659066910'
        };

        if (typeof code !== "undefined") {
            this.queryData(this.url, this.param);
        }
    },

    render: function () {
        this.$('#main').append(this.checkbox.render().el);
        this.$('#main').append(this.text.render().el);
        this.$('#main').append(this.dateEl.render().el);

        this.$('#main').append(this.select.render().el);
        this.$('#main').append(this.fileEl.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {},

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function (url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                console.log(res);
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillPage: function (data) {
        console.log(data);
    },

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(116);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSelect = __webpack_require__(30);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "change select[name='type']": "onSelectChange"
    },

    initialize: function (code, upUrl, loginKey) {
        this.$el.html(this.template({
            titles: ["会员管理", "会员列表", "会员详情", "会员账户"],
            back: true,
            code: code
        }));

        this.table = new compTable();
        this.pagement = new compPage();
        this.selectType = new compSelect();
        this.key = loginKey;

        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "tableDataReady", this.freshTable);
        this.listenTo(this, "pageDataReady", this.freshPage);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Member/memberAcount';
        this.tableParam = {
            member_id: code,
            type: 1,
            key: this.key
        };
        this.queryTableData(this.url, this.tableParam, true);

        this.pageUrl = 'https://www.kziche.com/admin/Member/memberDetail';
        this.pageParam = {
            key: this.key,
            member_id: code
        };
        this.queryPageData(this.pageUrl, this.pageParam);
    },

    render: function () {
        this.$('#cont').append(this.table.render().el);
        this.$('#op').append(this.selectType.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ["金额", "金额产生原因", "产生时间"]; //表头
        var rows = ['amout', "reason", "create_time"]; //表列
        var opration = []; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(false);
        this.table.setHasCheckBox(false);

        this.selectType.setParam({
            title: "请选择查看类型",
            name: "type",
            options: [{
                value: 1,
                content: "账户明细"
            }, {
                value: 2,
                content: "积分明细"
            }, {
                value: 3,
                content: "次卡明细"
            }, {
                value: 4,
                content: "优惠券明细"
            }]
        });
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryTableData: function (url, param, firstTime, type) {
        var me = this;
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('tableDataReady', res.data);
                    if (firstTime) {
                        this.pagement.clearPage();
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1,
                            total: res.count
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.trigger('tableDataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    /**
     * 查询页面除表格以外数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryPageData: function (url, param, type) {
        var me = this;
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('pageDataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('pageDataReady', temp);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryTableData(this.url, this.tableParam, false);
    },

    onSelectChange: function (e) {
        var type = $(e.target).val();
        this.tableParam.type = type;
        if (type != "") {
            this.queryTableData(this.url, this.tableParam, false);
        }
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        if (data.length == 0) {
            this.pagement.clearPage();
        }
        this.table.setData(data);
    },

    freshPage: function (data) {
        this.$("#user").text(data.nickname);
        this.$("#money").text(data.balance);
        this.$("#score").text(data.integral);
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"pageHead\">\r\n    <div class=\"phLeft\"><img src=\"" + __webpack_require__(10) + "\" alt=\"\">&nbsp&nbsp<span style=\"color:#9e9e9e;\">当前位置：</span>\r\n        <% _.each(titles,function(title,index){%>\r\n            <% if(titles.length-1 > index){ %>\r\n                <span><%=title%></span> >\r\n                <% }else{ %>\r\n                    <span><%=title%></span>\r\n                    <% } %>\r\n                        <%})%>\r\n    </div>\r\n    <div class=\"phRight\">\r\n        <% if(back){%>\r\n            <a onClick=\"javascript :history.back(-1);\" href=\"javascript:void(0)\" class=\"btn btn-info back\">返回</a>\r\n            <% } %>\r\n    </div>\r\n</div>\r\n<div class=\"panel panel-default\">\r\n    <div class=\"panel-body\">\r\n        <div id=\"msg\" style=\"font-size: 20px;margin-left: 35px;\">\r\n            当前用户：<span id=\"user\"></span>，可用资金：<span id=\"money\"></span>，积分：<span id=\"score\"></span>&nbsp\r\n            <a class=\"btn btn-danger\" href=\"#views/member/form/memberAccountChange/code<%=code %>\">变更账户</a>\r\n        </div>\r\n        <div id=\"op\" style=\"margin-left: 35px;\"></div>\r\n        \r\n        <hr>\r\n        <div class=\"row\">\r\n            <div id=\"cont\" class=\"col-md-12\"></div>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-xs-7\"></div>\r\n            <div class=\"col-xs-5\" id=\"pg\"></div>\r\n        </div>\r\n    </div>\r\n</div>";

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(118);
const compText = __webpack_require__(7);
const compMultSelect = __webpack_require__(27);

var multiSelectModel = Backbone.Model.extend({
    url: "https://www.kziche.com/admin/Member/cardList"
});

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #confirm": "onClickConfirm",
        "click #clear": "onClickClear"
    },

    initialize: function (code, upUrl, loginKey) {
        this.memberId = code;
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["会员管理", "会员列表", "会员详情", "会员账户", "账户变更"],
            back: true
        }));

        this.textReason = new compText();
        this.multCard = new compMultSelect();

        this.selectModel = new multiSelectModel();
        this.selectModel.on("change", this.fillSelectOption, this);

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this, 'confirmFinish', this.confirmFinish); //表单提交成功后的回调函数

        this.url = 'https://www.kziche.com/admin/Member/memberDetail';
        this.param = {
            key: this.key,
            member_id: code
            //如果传入参数则为编辑页面，没有则为添加页面
        };if (typeof code !== "undefined") {
            this.queryData(this.url, this.param);
        }
    },

    render: function () {
        this.$('#main').append(this.textReason.render().el);
        this.$('#main').append(this.multCard.render().el);

        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        this.textReason.setParam({
            title: "变更原因"
        });

        this.multCard.setParam({
            title: "添加次卡"
        });
        //获取次卡数据
        this.selectModel.fetch({
            type: 'get',
            dataType: 'json',
            data: {
                key: this.key,
                page: 1,
                pagesize: 20
            }
        });
    },

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function (url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillPage: function (data) {
        this.$("#user").text(data.nickname);
        this.$("#money").text(data.balance);
        this.$("#score").text(data.integral);
    },

    onClickClear: function (e) {},

    confirmFinish: function () {
        alert("提交成功");
        window.history.back();
    },

    onClickConfirm: function (e) {
        var me = this;
        var moneyOp = this.$("select[name='money']").val();
        var money = this.$("input[name='money']").val();
        var reason = this.textReason.getValue();
        var card_id = this.multCard.getValue();

        $.ajax({
            url: 'https://www.kziche.com/admin/Member/changeAccount',
            type: 'post',
            dataType: 'json',
            data: {
                key: me.key,
                member_id: me.memberId,
                accountState: moneyOp,
                reason: reason,
                accountNum: money,
                integralState: 1,
                integralNum: 2,
                card_id: card_id
            },
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('confirmFinish', res.data);
                } else {
                    alert(res.msg);
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    fillSelectOption: function (mod, option) {
        var data = mod.get("data");
        var options = [];
        _.each(data, function (val, index) {
            var temp = {};
            temp.value = val.id;
            temp.content = val.name;
            options.push(temp);
        });

        this.multCard.setOptions(options);
    },

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"pageHead\">\r\n    <div class=\"phLeft\"><img src=\"" + __webpack_require__(10) + "\" alt=\"\">&nbsp&nbsp<span style=\"color:#9e9e9e;\">当前位置：</span>\r\n        <% _.each(titles,function(title,index){%>\r\n           <% if(titles.length-1 > index){ %>\r\n                <span><%=title%></span> >\r\n           <% }else{ %>\r\n                <span><%=title%></span>\r\n            <% } %>\r\n        <%})%>\r\n    </div>\r\n    <div class=\"phRight\">\r\n        <% if(back){%>\r\n            <a onClick=\"javascript :history.back(-1);\" href=\"javascript:void(0)\" class=\"btn btn-info back\">返回</a>\r\n        <% } %>\r\n    </div>\r\n</div>\r\n<div class=\"panel panel-default\">\r\n<div class=\"panel-body\">\r\n\t<div class=\"formElement\">\r\n\t\t<span class=\"formTitle\">当前用户</span><div class=\"detail_content\"><span id=\"user\"></span> ，可用资金：<span id=\"money\"></span>，积分：<span id=\"score\"></span></div>\r\n\t</div>\r\n     <div  id=\"main\">\r\n\t</div>\r\n\t<div class=\"formElement\">\r\n\t\t<span class=\"formTitle\"> 资金账户</span>\r\n\t\t<select name=\"money\" style=\"width:100px;height: 44px\">\r\n\t\t\t<option value=\"1\">增加</option>\r\n\t\t\t<option value=\"2\">减少</option>\r\n\t\t</select>&nbsp&nbsp\r\n\t\t<input type=\"text\" name=\"money\" placeholder=\"输入金额\"  />\r\n\t</div>\r\n\t<!-- <p>\r\n\t\t<label class=\"control-label\"> 次卡变更：</label>\r\n\t\t<select name=\"card\" style=\"width:100px;height: 27px\">\r\n\t\t\t<option value=\"1\">增加</option>\r\n\t\t</select>\r\n\t\t\r\n\t</p> -->\r\n <div class=\"op-container\">\r\n\t<button type=\"button\" id=\"confirm\" class=\"btn btn-primary btn-lg\">提&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp交</button>\r\n\t<button type=\"button\" id=\"clear\" class=\"btn btn-primary btn-lg\">重&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp置</button>\r\n\t</div>\r\n</div>\r\n</div>";

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(120);
const htmlCar = __webpack_require__(121);
const compCheckbox = __webpack_require__(12);
const compDate = __webpack_require__(14);
const compSelect = __webpack_require__(8);
const compText = __webpack_require__(7);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #confirm": "onClickConfirm",
        "click #clear": "onClickClear"
    },

    initialize: function (code, upUrl, loginKey) {
        this.key = loginKey;
        var isAdd = false;
        code != null && typeof code !== "undefined" ? isAdd = false : isAdd = true;

        this.$el.html(this.template({
            titles: ["会员管理", "会员列表", "会员详情"],
            isAdd: isAdd,
            code: code,
            back: upUrl
        }));

        this.textUserName = new compText();
        this.textRealName = new compText();
        this.textEmail = new compText();
        this.textPhone = new compText();
        this.textPassword = new compText();
        this.textConfirmPassword = new compText();

        this.checkboxSex = new compCheckbox();

        this.selectRank = new compSelect();
        this.dateBirthday = new compDate();

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        // this.listenTo(this, 'confirmSuccess',this.confirmFinish);//表单提交成功后的回调函数

        this.url = 'https://www.kziche.com/admin/Member/memberDetail';
        this.param = {
            key: this.key,
            member_id: code
            //如果传入参数则为编辑页面，没有则为添加页面
        };if (typeof code !== "undefined" && code != null) {
            this.queryData(this.url, this.param);
        }
    },

    render: function () {
        this.$('#main').append(this.textUserName.render().el);
        // this.$('#main').append(this.textRealName.render().el);
        this.$('#main').append(this.textEmail.render().el);
        this.$('#main').append(this.textPhone.render().el);
        this.$('#main').append(this.textPassword.render().el);
        this.$('#main').append(this.textConfirmPassword.render().el);
        // this.$('#main').append(this.selectRank.render().el);
        this.$('#main').append(this.checkboxSex.render().el);
        this.$('#main').append(this.dateBirthday.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        this.textUserName.setParam({
            title: "用户姓名"
        });
        this.textEmail.setParam({
            title: "邮箱",
            msg: "按照正确的邮箱格式输入例：abc@qq.com",
            pattern: /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/,
            err: "邮箱格式错误"
        });
        this.textPhone.setParam({
            title: "手机号码",
            msg: "输入例子:13300000000",
            err: "号码格式错误",
            pattern: /^1\d{10}$/
        });
        this.textPassword.setParam({
            title: "登陆密码"
        });
        this.textConfirmPassword.setParam({
            title: "确认密码"
        });
        this.textRealName.setParam({
            title: '实名',
            msg: "用户真实姓名"
        });

        this.selectRank.setParam({
            title: "会员等级",
            options: [{
                value: 1,
                content: "铜牌会员"
            }, {
                value: 2,
                content: "银牌会员"
            }, {
                value: 3,
                content: "金牌会员"
            }, {
                value: 4,
                content: "钻石会员"
            }]
        });
        this.checkboxSex.setParam({
            title: '性别',
            options: [{
                value: "男",
                content: "男"
            }, {
                value: "女",
                content: "女"
            }, {
                value: "保密",
                content: "保密"
            }]
        });
        this.dateBirthday.setParam({
            title: "用户生日"
        });
    },

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function (url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillPage: function (data) {
        //这里再进行数据的装配
        this.textUserName.setValue(data.name);
        this.textEmail.setValue(data.email);
        this.textPhone.setValue(data.phone);
        this.checkboxSex.setValue(data.sex);
        this.dateBirthday.setValue(data.birthday);
        this.$("#balance").text(data.balance);

        var temp = _.template(htmlCar);
        this.$("#carMsg").append(temp({
            items: data.car
        }));
    },

    onClickClear: function (e) {},

    onClickConfirm: function (e) {
        //会员编辑还没有接口
    },

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"pageHead\">\r\n    <div class=\"phLeft\"><img src=\"" + __webpack_require__(10) + "\" alt=\"\">&nbsp&nbsp<span style=\"color:#9e9e9e;\">当前位置：</span>\r\n        <% _.each(titles,function(title,index){%>\r\n           <% if(titles.length-1 > index){ %>\r\n                <span><%=title%></span> >\r\n           <% }else{ %>\r\n                <span><%=title%></span>\r\n            <% } %>\r\n        <%})%>\r\n    </div>\r\n    <div class=\"phRight\">\r\n        <% if(back){%>\r\n            <a onClick=\"javascript :history.back(-1);\" href=\"javascript:void(0)\" class=\"btn btn-info back\">返回</a>\r\n        <% } %>\r\n    </div>\r\n</div>\r\n<div class=\"panel panel-default\">\r\n<div class=\"panel-body\">\r\n     <div class=\"control-group\" id=\"main\">\r\n    \r\n\t</div>\r\n    <% if(!isAdd){%> \r\n    <div class=\"formElement\">\r\n        <span class=\"formTitle\">可用资金(元)</span><div class=\"detail_content\"><span id=\"balance\"></span><a href=\"#views/member/form/memberAccount/code<%=code %>\">[ 资金明细 ]</a></div>\r\n     </div>\r\n     <% } %>\r\n     <hr>\r\n     <div id=\"carMsg\" class=\"control-group\">\r\n     </div>\r\n\t<button type=\"button\" id=\"confirm\" class=\"btn btn-primary btn-lg\">提&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp交</button>\r\n\t<button type=\"button\" id=\"clear\" class=\"btn btn-primary btn-lg\">重&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp置</button>\r\n\t<!-- <a href=\"<% if(back!='#'){%><%=back %><% }else{ %> javascript:void(0)<% } %>\" id=\"back\" class=\"btn btn-info btn-lg\">返&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp回</a> -->\r\n</div>\r\n</div>";

/***/ }),
/* 121 */
/***/ (function(module, exports) {

module.exports = "<h3>绑定车辆</h3>\r\n<% if(items.length != 0){%>\r\n<div class=\"row\">\r\n        <div class=\"col-md-2 col-xs-2\">牌照</div>\r\n        <div class=\"col-md-2 col-xs-2\">品牌</div>\r\n        <div class=\"col-md-2 col-xs-2\">车型</div>\r\n        <div class=\"col-md-2 col-xs-2\">车情</div>\r\n    </div>\r\n<% _.each(items,function(item,index){%>\r\n    <div class=\"row\">\r\n        <div class=\"col-md-2 col-xs-2\"><%=item.license_plate %></div>\r\n        <div class=\"col-md-2 col-xs-2\"><%=item.brand_name %></div>\r\n        <div class=\"col-md-2 col-xs-2\"><%=item.model_name %></div>\r\n        <div class=\"col-md-2 col-xs-2\"><%=item.details %></div>\r\n    </div>\r\n<% }) %>\r\n<%}else{%>\r\n    <div class=\"row\">\r\n        <div class=\"col-md-6 col-xs-6 text-right\"><span class=\"glyphicon glyphicon-exclamation-sign\" style=\"color: rgb(177, 0, 60); font-size: 23px;\"> 该用户还没有绑定车辆</span></div>\r\n    </div>\r\n<%}%>";

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(123);
const compRegular = __webpack_require__(47);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        'click #add': 'addRegular',
        'click #confirm': 'onClickComfirm'
    },

    initialize: function (loginKey) {
        this.data = []; //默认
        this.count = 0; //数组元素中的序号
        this.key = loginKey; //登陆秘钥

        this.$el.html(this.template({
            titles: ["会员管理", "充值规则"],
            back: false
        }));

        this.regulars = []; //已有数据
        this.listenTo(this, "dataReady", this.initPage);

        this.url = 'https://www.kziche.com/admin/Member/RechargeRule';
        //查询参数当前对象内共用，保证条件的一致
        this.param = {
            key: this.key
        };
        this.queryData(this.url, this.param);
    },

    render: function () {
        // var me = this;
        // _.each(me.regulars, function(val, index) {
        //     me.$('.opedit').append(val.e.render().el);
        // })

        return this;
    },

    /**
     * 初始化页面
     * @return {[type]} [description]
     */
    initPage: function (data) {
        var me = this;
        for (let i = 0; i < data.length; i++) {
            this.count++;
            let regular = new compRegular();
            this.listenTo(regular, "delete", this.removeRegular);
            regular.setParam({
                charge: data[i].recharge_money,
                give: data[i].gift_amount,
                isNew: false,
                num: this.count,
                elid: data[i].id
            });
            // me.$('.opedit').append(regular.render().el)
            this.regulars.push({
                num: this.count,
                e: regular
            });
        }
        _.each(me.regulars, function (val, index) {
            me.$('.opedit').append(val.e.render().el);
        });
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    addRegular: function (e) {
        this.count++;
        var charge = this.$('input[name="newCharge"]').val();
        var gift = this.$('input[name="newGift"]').val();
        var regular = new compRegular({
            isNew: true,
            charge: charge,
            give: gift,
            num: this.count,
            elid: 0
        });
        this.listenTo(regular, "delete", this.removeRegular);
        this.regulars.push({
            e: regular,
            num: this.count
        });
        this.$('.opedit').prepend(regular.render().el);
    },

    removeRegular: function (num) {
        var me = this;
        for (let i = 0; i < this.regulars.length; i++) {
            if (this.regulars[i].num == parseInt(num)) {
                if (this.regulars[i].e.elid != 0) {
                    $.ajax({
                        url: "https://www.kziche.com/admin/Member/delRule",
                        type: 'get',
                        dataType: 'json',
                        data: {
                            key: this.key,
                            id: me.regulars[i].e.elid
                        },
                        success: function (res) {
                            if (res.code == 200) {
                                alert(res.msg);
                                this.trigger('confirmSuccess', res.data);
                            } else {
                                alert(res.msg);
                            }
                        }.bind(this),
                        error: function () {
                            console.log('页面出错');
                        }.bind(this)
                    });
                }
                this.regulars.splice(i, 1);
            }
        }
    },

    onClickComfirm: function () {
        var me = this;
        var newRegulars = [];
        for (let i = 0; i < this.regulars.length; i++) {
            if (this.regulars[i].e.elid == 0) {
                var temp = this.regulars[i].e.getValue();
                temp.id = 0;
                newRegulars.push(temp);
            }
        }

        $.ajax({
            url: 'https://www.kziche.com/admin/Member/addRechargeRule',
            type: 'post',
            dataType: 'json',
            data: {
                key: me.key,
                obj: newRegulars
            },
            success: function (res) {

                if (res.code == 200) {
                    alert("添加记录成功");
                    this.trigger('confirmSuccess', res.data);
                } else {
                    alert(res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"pageHead\">\r\n    <div class=\"phLeft\"><img src=\"" + __webpack_require__(10) + "\" alt=\"\">&nbsp&nbsp<span style=\"color:#9e9e9e;\">当前位置：</span>\r\n        <% _.each(titles,function(title,index){%>\r\n           <% if(titles.length-1 > index){ %>\r\n                <span><%=title%></span> >\r\n           <% }else{ %>\r\n                <span><%=title%></span>\r\n            <% } %>\r\n        <%})%>\r\n    </div>\r\n    <div class=\"phRight\">\r\n        <% if(back){%>\r\n            <a onClick=\"javascript :history.back(-1);\" href=\"javascript:void(0)\" class=\"btn btn-info back\">返回</a>\r\n        <% } %>\r\n    </div>\r\n</div>\r\n<div class=\"panel panel-default\">\r\n<div class=\"panel-body\">\r\n    <div id=\"cont\">\r\n        <div class=\"opview\"><h3>添加操作</h3>\r\n            <p><span>充值金额：</span>\r\n                <input type=\"number\" min=\"0\" name=\"newCharge\" step=\"5\" value=\"0\"> --- <span>赠送金额：</span>\r\n                <input type=\"number\" min=\"0\" name=\"newGift\" step=\"5\" value=\"0\"> <a href=\"javascript:void(0)\" id=\"add\">添加</a>\r\n            </p>\r\n        </div>\r\n        <hr>\r\n        <p><h3>编辑删除部分</h3>\r\n            <div class=\"opedit\"></div>\r\n        </p>\r\n    </div>\r\n    <hr>\r\n    <div class=\"op-container\">\r\n        <button type=\"button\" id=\"confirm\" class=\"btn btn-primary btn-lg\">提&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp交</button>\r\n        <button type=\"button\" id=\"clear\" class=\"btn btn-primary btn-lg\">重&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp置</button>\r\n    </div>\r\n</div>\r\n</div>";

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);

// require("/ueditor/ueditor.config.js");
// require("/ueditor/ueditor.all.js");
// require("/ueditor/lang/zh-cn/zh-cn.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "panel panel-default",

    template: _.template(htmlTpl),

    initialize: function () {
        this.$el.html(this.template({
            title: "充值提现",
            sub: ""
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch();

        this.listenTo(this.search, "goSearch", this.goSearch);
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'http://www.kzxueche.com/institutionapi/Baseinsti/security_guardList';
        this.tableParam = {
            isexport: 1,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            key: '40kzm151243778659066910'
        };
        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);

        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ['安全员编号', "姓名", "性别", "身份证号", "联系电话", "联系地址", "驾驶证号", "在职状态", "入职日期", "同步状态"]; //表头
        var rows = ['secunum', { name: 'name', isSkip: true, link: "views/formExample", code: "id" }, 'sex', 'idcard', 'mobile', 'address', 'drilicence', 'employstatus_name', 'hiredate', 'synchro_flag']; //表列
        var opration = [{ name: '审核', elID: 'code', elName: "sh" }, { name: '编辑', elID: 'code', elName: "bj" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(false);
        this.table.setHasCheckBox(true);

        //搜索栏配置
        var searchComponents = [{
            type: 'daterange',
            param: {
                title: "时间范围",
                startDate: "2017-11-27",
                endDate: "2017-11-28",
                startTime: "12:00:01"
            }
        }, {
            type: 'select',
            param: {
                title: "下拉框",
                options: [{
                    value: '1',
                    content: "hehehe"
                }, {
                    value: '1',
                    content: "hehehe"
                }, {
                    value: '1',
                    content: "hehehe"
                }, {
                    value: '1',
                    content: "hehehe"
                }],
                name: "name"
            }
        }, {
            type: 'text',
            param: {
                title: "搜索条件",
                value: "",
                explain: "要查询的姓名、订单",
                name: "name"
            }
        }];
        this.search.setParam(searchComponents);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function (param) {
        var dateRange = this.search.getElByName('daterange');
        console.log(dateRange.getStartDate());
        console.log(dateRange.getEndDate());
        console.log(param);
        //this.tableParam 属性设置
        // this.queryData(this.url,this.tableParam,false);
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        this.table.setData(data);
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function (loginKey) {
        this.$el.html(this.template({
            titles: ["会员管理", "会员列表"],
            back: false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd: false,
            addLink: "",
            showSearch: true,
            linesNum: 1
        });
        this.key = loginKey; //登陆秘钥

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange); //监听页数变化事件
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Member/memberList';
        //查询参数当前对象内共用，保证条件的一致
        this.tableParam = {
            key: this.key,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            signStartTime: this.getDate('month', 3),
            signEndTime: this.getDate(),
            grade_name: ''
        };
        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);

        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ["用户名", "性别", "用户来源", "车牌", "手机号", "会员等级", "积分", "余额", "赠送金额", "注册日期", "实名认证"]; //表头
        var rows = ['nickname', 'sex', 'source_name', 'license_plate', 'phone', 'grade_name', 'integral', 'balance', 'gift_amount', 'create_time', 'is_validate']; //表列
        var opration = [{ name: '编辑', elID: 'id', elName: "edt", link: "views/member/form/memberEdit" }, { name: '订单', elID: 'id', elName: "ord", link: "views/order/orderList" }, { name: '冻结', elID: 'id', elName: "dj" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("id");

        //搜索栏配置
        var searchComponents = [{
            type: 'daterange',
            line: 0,
            param: {
                title: "时间范围",
                name: "daterange",
                startDate: this.getDate('month', 3),
                endDate: this.getDate()
            }
        }, {
            type: 'text',
            line: 0,
            param: {
                title: "输入条件",
                value: "",
                explain: "用户名/手机号",
                name: "text"
            }
        }];
        this.search.setParam(searchComponents);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        this.pagement.clearPage();
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1,
                            total: res.count
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function () {
        var dateRange = this.search.getElByName('daterange');
        var searchText = this.search.getElByName('text');

        this.tableParam.searchCriteria = searchText.getValue();
        this.tableParam.signStartTime = dateRange.getStartDate();
        this.tableParam.signEndTime = dateRange.getEndDate();
        this.tableParam.page = 1;
        this.queryData(this.url, this.tableParam, true);
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        if (data.length == 0) {
            this.pagement.clearPage();
        }
        this.table.setData(data);
    },
    /**
     * 获取日期
     * @param  {string} type  [修改的类型month月份,day天数]
     * @param  {num} param [与当前日期回退的type数量]
     * @return {[type]}       [description]
     */
    getDate: function (type, param) {
        let date = new Date();
        if (type && type == "month") {
            date.setMonth(date.getMonth() - param);
        }
        if (type && type == "day") {
            date.setDate(date.getDate() - param);
        }
        let day = date.getDate();
        let month = date.getMonth() + 1;

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        let year = date.getFullYear();
        let result = year + "-" + month + "-" + day;
        return result;
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "panel panel-default",

    template: _.template(htmlTpl),

    initialize: function () {
        this.$el.html(this.template({
            title: "会员等级",
            sub: ""
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch();

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'http://www.kzxueche.com/institutionapi/Baseinsti/security_guardList';
        this.tableParam = {
            isexport: 1,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            key: '40kzm151243778659066910'
        };
        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        // this.$('#pg').append(this.pagement.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ['安全员编号', "姓名", "身份证号", "联系电话", "联系地址", "驾驶证号", "在职状态", "入职日期", "同步状态"]; //表头
        var rows = ['secunum', { name: 'name', isSkip: true, link: "views/formExample", code: "id" }, 'idcard', 'mobile', 'address', 'drilicence', 'employstatus_name', 'hiredate', 'synchro_flag']; //表列
        var opration = [{ name: '审核', elID: 'code', elName: "sh" }, { name: '编辑', elID: 'code', elName: "bj" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(false);
        this.table.setHasCheckBox(true);

        //搜索栏配置
        var searchComponents = [{
            type: 'daterange',
            param: {
                title: "时间范围",
                startDate: "2017-11-27",
                endDate: "2017-11-28",
                startTime: "12:00:01"
            }
        }, {
            type: 'select',
            param: {
                title: "下拉框",
                options: [{
                    value: '1',
                    content: "hehehe"
                }, {
                    value: '1',
                    content: "hehehe"
                }, {
                    value: '1',
                    content: "hehehe"
                }, {
                    value: '1',
                    content: "hehehe"
                }],
                name: "name"
            }
        }, {
            type: 'text',
            param: {
                title: "搜索条件",
                value: "",
                explain: "要查询的姓名、订单",
                name: "name"
            }
        }];
        this.search.setParam(searchComponents);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        this.table.setData(data);
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);
const compBatch = __webpack_require__(9);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function (loginKey) {
        this.$el.html(this.template({
            titles: ["订单管理", "评价列表"],
            back: false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd: false,
            addLink: "",
            showSearch: true,
            linesNum: 2
        });
        this.batch = new compBatch();
        this.key = loginKey;

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.listenTo(this.batch, "goBatch", this.goBatch);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Order/orderComment';
        this.tableParam = {
            key: this.key,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            signStartTime: this.getDate('month', 3),
            signEndTime: this.getDate(),
            state: ''
        };
        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        this.$('#batch').append(this.batch.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ["会员昵称", "订单号", "评价时间", "订单内容", "是否回复", "门店"]; //表头
        var rows = ["nickname", "order_sn", "create_time", "items_name", "state_name", "store_name"]; //表列
        var opration = [{ name: '详情', elID: 'commnet_id', elName: "bj", other: "order_id", link: "views/order/form/replyEdit" }, { name: '删除', elID: 'commnet_id', elName: "del" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("commnet_id");

        //搜索栏配置
        var searchComponents = [{
            type: 'daterange',
            line: 0,
            param: {
                title: "时间范围",
                startDate: this.getDate('month', 3),
                endDate: this.getDate(),
                name: "daterange"
            }
        }, {
            type: 'text',
            line: 0,
            param: {
                title: "搜索条件",
                value: "",
                explain: "要查询的会员名、订单",
                name: "text"
            }
        }, {
            type: 'select',
            line: 0,
            param: {
                title: "回复状态",
                options: [{
                    value: '1',
                    content: "未回复"
                }, {
                    value: '2',
                    content: "已回复"
                }],
                name: "state"
            }
        }];
        this.search.setParam(searchComponents);

        /*
        批量操作组件配置
         */
        var batchOptions = [{ value: "del", content: "删除" }];
        this.batch.setParam(batchOptions);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        this.pagement.clearPage(); //清空分页dom内容
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1,
                            total: res.count
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function (param) {
        var dateRange = this.search.getElByName('daterange');
        var searchText = this.search.getElByName('text');
        var searchSelect = this.search.getElByName('state');

        this.tableParam.searchCriteria = searchText.getValue();
        this.tableParam.signStartTime = dateRange.getStartDate();
        this.tableParam.signEndTime = dateRange.getEndDate();
        this.tableParam.state = searchSelect.getValue();
        this.tableParam.page = 1;
        this.queryData(this.url, this.tableParam, true);
    },

    goBatch: function (type) {
        var ids = [];
        var url = "";
        var param = null;

        this.$("#cont tbody input[type='checkbox']:checked").each(function (index, e) {
            ids.push($(e).attr("checkid"));
        });

        if (ids.length == 0) {
            alert("未选取任何记录");
            return;
        }

        var idsString = ids.join(",");

        url = "https://www.kziche.com/admin/Order/delComment";
        param = {
            key: this.key,
            comment_ids: idsString
        };
        this.batchAjax(url, param);
    },

    batchAjax: function (tempUrl, param) {
        var me = this;
        $.ajax({
            url: tempUrl,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    alert(res.msg);
                    this.tableParam.page = 1;
                    this.queryData(me.url, me.tableParam, true);
                } else {
                    alert(res.msg);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        if (data.length == 0) {
            this.pagement.clearPage();
        }
        this.table.setData(data);
        this.$('a[name="bj"]').click(function (e) {
            sessionStorage.setItem("orderid", $(e.target).attr('other'));
        });

        var me = this;
        this.$('a[name="del"]').click(function (el) {
            var ids = $(el.target).attr("elid");
            var text = $(el.target).text();
            var url = "https://www.kziche.com/admin/Order/delComment";
            var param = {
                key: this.key,
                comment_ids: ids
            };
            var sure = window.confirm("确定执行 " + text + " 操作?");
            if (sure) {
                me.batchAjax(url, param);
            }
        });
    },

    /**
     * 获取日期
     * @param  {string} type  [修改的类型month月份,day天数]
     * @param  {num} param [与当前日期回退的type数量]
     * @return {[type]}       [description]
     */
    getDate: function (type, param) {
        let date = new Date();
        if (type && type == "month") {
            date.setMonth(date.getMonth() - param);
        }
        if (type && type == "day") {
            date.setDate(date.getDate() - param);
        }
        let day = date.getDate();
        let month = date.getMonth() + 1;

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        let year = date.getFullYear();
        let result = year + "-" + month + "-" + day;
        return result;
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(129);
const htmlPay = __webpack_require__(49);
__webpack_require__(31);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function (code, upUrl, loginKey) {
        this.code = code || 0;
        this.key = loginKey;

        this.listenTo(this, 'dataReady', this.fillPage);

        this.url = 'https://www.kziche.com/admin/Order/orderDetail';
        this.param = {
            key: this.key,
            order_id: this.code
        };

        if (typeof code !== "undefined" && code != null) {
            this.queryData(this.url, this.param);
        }
    },

    render: function () {
        this.$el.append(this.template({
            titles: ["订单管理", "订单列表", "订单详情"],
            back: true
        }));
        return this;
    },

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function (url, param) {
        var me = this;
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillPage: function (data) {
        this.$("#nickname").html(data.nickname);
        this.$("#store").html(data.store_name);
        this.$("#order").html(data.order_sn);
        this.$("#createTime").html(data.create_time);
        this.$("#sumAcount").html(data.sum_money);
        this.$("#actual").html(data.actual_money);
        this.$("#payType").html(data.pay_type_name);
        this.$("#wechat_sn").html(data.wechat_sn);
        var temp = _.template(htmlPay);
        this.$("#orderDetail").append(temp({
            items: data.content
        }));
    },

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"pageHead\">\r\n    <div class=\"phLeft\"><img src=\"" + __webpack_require__(10) + "\" alt=\"\">&nbsp&nbsp<span style=\"color:#9e9e9e;\">当前位置：</span>\r\n        <% _.each(titles,function(title,index){%>\r\n            <% if(titles.length-1 > index){ %>\r\n                <span><%=title%></span> >\r\n                <% }else{ %>\r\n                    <span><%=title%></span>\r\n                    <% } %>\r\n                        <%})%>\r\n    </div>\r\n    <div class=\"phRight\">\r\n        <% if(back){%>\r\n            <a onClick=\"javascript :history.back(-1);\" href=\"javascript:void(0)\" class=\"btn btn-info back\">返回</a>\r\n            <% } %>\r\n    </div>\r\n</div>\r\n<div class=\"panel panel-default\">\r\n    <div class=\"panel-body\">\r\n        <div class=\"vtContainer\">\r\n            <div class=\"vtBigTitle\">\r\n                <span>基本信息</span>\r\n            </div>\r\n            <div class=\"vtBox\">\r\n                <div class=\"vt left\">\r\n                    <div class=\"vtSmallTitle\">用户</div>\r\n                    <div id=\"nickname\" class=\"vtcontent\">wange</div>\r\n                </div>\r\n                <div class=\"vt right\">\r\n                    <div class=\"vtSmallTitle\">订单门店</div>\r\n                    <div id=\"store\" class=\"vtcontent\">store</div>\r\n                </div>\r\n            </div>\r\n            <div class=\"vtBox\">\r\n                <div class=\"vt left\">\r\n                    <div class=\"vtSmallTitle\">订单号</div>\r\n                    <div id=\"order\" class=\"vtcontent\">10000000111111110</div>\r\n                </div>\r\n                <div class=\"vt right\">\r\n                    <div class=\"vtSmallTitle\">生成时间</div>\r\n                    <div id=\"createTime\" class=\"vtcontent\">2017-11-11</div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <hr>\r\n        <div class=\"vtContainer\">\r\n            <div class=\"vtBigTitle\">\r\n                <span>支付情况</span>\r\n            </div>\r\n            <div class=\"vtBox\">\r\n                <div class=\"vt left\">\r\n                    <div class=\"vtSmallTitle\">支付订单号</div>\r\n                    <div id=\"wechat_sn\" class=\"vtcontent\">1000294700</div>\r\n                </div>\r\n                <div class=\"vt right\">\r\n                    <div class=\"vtSmallTitle\">支付方式</div>\r\n                    <div id=\"payType\" class=\"vtcontent\">微信支付</div>\r\n                </div>\r\n            </div>\r\n            <div class=\"vtBox\">\r\n                <div class=\"vt left\">\r\n                    <div class=\"vtSmallTitle\">应付金额</div>\r\n                    <div id=\"sumAcount\" class=\"vtcontent\">499</div>\r\n                </div>\r\n                <div class=\"vt right\">\r\n                    <div class=\"vtSmallTitle\">实付金额</div>\r\n                    <div id=\"actual\" class=\"vtcontent\">499</div>\r\n                </div>\r\n            </div>\r\n           \r\n        </div>\r\n         <hr>\r\n            <div id=\"orderDetail\" class=\"text-left\">\r\n            </div>\r\n    </div>\r\n</div>";

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(11);
const compText = __webpack_require__(7);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #confirm": "onClickConfirm",
        "click #clear": "onClickClear",
        "click #back": "onClickBack"
    },

    initialize: function (code, upUrl, loginKey) {
        this.orderid = sessionStorage.getItem("orderid");
        this.code = code || 0;
        this.key = loginKey;

        this.$el.html(this.template({
            titles: ["订单管理", "退款原因", "退款原因详情"],
            back: upUrl
        }));

        this.textReason = new compText();

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this, 'confirmFinish', this.confirmFinish); //表单提交成功后的回调函数

        this.url = 'https://www.kziche.com/admin/Order/refundReasonDetail';
        this.param = {
            key: this.key,
            id: this.code
            //如果传入参数则为编辑页面，没有则为添加页面
        };if (typeof code !== "undefined" && code != null) {
            this.queryData(this.url, this.param);
        }
    },

    render: function () {
        this.$('#main').append(this.textReason.render().el);

        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        this.textReason.setParam({
            title: '退款原因',
            msg: "退款原因尽量简短"
        });
    },

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function (url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillPage: function (res) {
        this.textReason.setValue(res.data);
    },

    onClickClear: function () {},

    confirmFinish: function () {
        alert("提交成功");
        window.history.back();
    },

    onClickConfirm: function () {
        var content = this.textReason.getValue();
        var me = this;
        $.ajax({
            url: 'https://www.kziche.com/admin/Order/addrefundReason',
            type: 'post',
            data: {
                key: me.key,
                id: me.code,
                name: content
            },
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('confirmFinish');
                } else {
                    alert(res.msg);
                    this.trigger('confirmFail', res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(132);
const htmlPay = __webpack_require__(49);
__webpack_require__(31);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    events: {
        "click #agree": "onClickAgree",
        "click #notagree": "onClickNotagree",
        "click #submit": "onClickSubmit",
        "click #cancel": "onClickCancel"
    },

    template: _.template(htmlTpl),

    initialize: function (code, upUrl, loginKey) {
        this.code = code || 0;
        this.key = loginKey;

        this.listenTo(this, 'dataReady', this.fillPage);

        this.url = 'https://www.kziche.com/admin/Order/refundDetail';
        this.param = {
            key: this.key,
            refund_id: this.code
        };

        if (typeof code !== "undefined" && code != null) {
            this.queryData(this.url, this.param);
        }
    },

    render: function () {
        this.$el.append(this.template({
            titles: ["订单管理", "退款申请列表", "退款详情"],
            back: true
        }));
        return this;
    },

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function (url, param) {
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillPage: function (data) {
        this.$("#nickname").html(data.nickname);
        this.$("#phone").html(data.phone);
        this.$("#reason").html(data.refund_name + data.reason);
        this.$("#order").html(data.order_sn);
        this.$("#createTime").html(data.create_time);
        this.$("#amount").html(data.amount);
        this.$("#actual").html(data.actual_money);
        var temp = _.template(htmlPay);
        this.$("#orderDetail").append(temp({
            items: data.content
        }));

        this.param = {
            key: this.key,
            order_sn: data.order_sn,
            refund_id: this.code,
            amount: data.amount,
            order_id: data.order_id,
            member_id: data.member_id,
            pay_type: data.pay_type
        };
    },

    onClickAgree: function (e) {
        this.$("#confirm").show();
    },

    onClickNotagree: function (e) {
        var content = this.$("#suggestion").val();
        var isAgree = 2;
        this.param.is_agree = isAgree;
        this.param.advice = content;
        $.ajax({
            url: 'https://www.kziche.com/admin/Order/refund',
            type: 'post',
            data: this.param,
            success: function (res) {
                if (res.code == 200) {
                    alert("提交成功");
                    this.trigger('confirmFinish');
                } else {
                    alert(res.msg);
                    this.trigger('confirmFail', res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    onClickSubmit: function (e) {
        var content = this.$("#suggestion").val();
        var isAgree = 1;
        this.param.is_agree = isAgree;
        this.param.advice = content;
        $.ajax({
            url: 'https://www.kziche.com/admin/Order/refund',
            type: 'post',
            data: this.param,
            success: function (res) {
                if (res.code == 200) {
                    alert("上传成功");
                    this.trigger('confirmFinish');
                } else {
                    alert(res.msg);
                    this.trigger('confirmFail', res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    onClickCancel: function (e) {
        this.$("#confirm").hide();
    },

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"pageHead\">\r\n    <div class=\"phLeft\"><img src=\"" + __webpack_require__(10) + "\" alt=\"\">&nbsp&nbsp<span style=\"color:#9e9e9e;\">当前位置：</span>\r\n        <% _.each(titles,function(title,index){%>\r\n            <% if(titles.length-1 > index){ %>\r\n                <span><%=title%></span> >\r\n                <% }else{ %>\r\n                    <span><%=title%></span>\r\n                    <% } %>\r\n                        <%})%>\r\n    </div>\r\n    <div class=\"phRight\">\r\n        <% if(back){%>\r\n            <a onClick=\"javascript :history.back(-1);\" href=\"javascript:void(0)\" class=\"btn btn-info back\">返回</a>\r\n            <% } %>\r\n    </div>\r\n</div>\r\n<div class=\"panel panel-default\">\r\n    <div class=\"panel-body\">\r\n        <div class=\"vtContainer\">\r\n            <div class=\"vtBigTitle\">\r\n                <span>基本信息</span>\r\n            </div>\r\n            <div class=\"vtBox\">\r\n                <div class=\"vt left\">\r\n                    <div class=\"vtSmallTitle\">订单号</div>\r\n                    <div id=\"order\" class=\"vtcontent\"></div>\r\n                </div>\r\n                <div class=\"vt right\">\r\n                    <div class=\"vtSmallTitle\">订单生成时间</div>\r\n                    <div id=\"createTime\" class=\"vtcontent\">store</div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <hr>\r\n        <div id=\"orderDetail\">\r\n        </div>\r\n        <hr>\r\n        <div class=\"vtContainer\">\r\n            <div class=\"vtBigTitle\">\r\n                <span>退款处理</span>\r\n            </div>\r\n            <div class=\"vtBox\">\r\n                <div class=\"vt left\">\r\n                    <div class=\"vtSmallTitle\">退款申请原因</div>\r\n                    <div id=\"reason\" class=\"vtcontent\"></div>\r\n                </div>\r\n            </div>\r\n            <div class=\"vtBox\">\r\n                <div class=\"vt left\">\r\n                    <div class=\"vtSmallTitle\" style=\"align-self:flex-start;\">处理建议</div>\r\n                    <div class=\"vtcontent\">\r\n                        <textarea id=\"suggestion\" style=\"width:640px;height:140px;\" type=\"textarea\" placeholder=\"处理原因\"></textarea>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n            <div class=\"op-container\">\r\n                <a id=\"agree\" href=\"javascript:void(0)\" class=\"btn btn-info\"><span class=\"glyphicon glyphicon-ok\" style=\"color: #fff; font-size: 15px;\"> 同意退款</span></a>&nbsp\r\n                <a id=\"notagree\" href=\"javascript:void(0)\" class=\"btn btn-info\"><span class=\"glyphicon glyphicon-remove\" style=\"color: #fff; font-size: 15px;\"> 拒绝退款</span></a>\r\n            </div>\r\n        </div>\r\n        <hr>\r\n        <div id=\"confirm\" style=\"display: none;\">\r\n            <div class=\"vtContainer\">\r\n                <div class=\"vtBigTitle\">\r\n                    <span>退款确认</span>\r\n                </div>\r\n                <div class=\"vtBox\">\r\n                    <div class=\"vt left\">\r\n                        <div class=\"vtSmallTitle\">退款金额流向</div>\r\n                        <div id=\"direction\" class=\"vtcontent\">原路返回</div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"vtBox\">\r\n                    <div class=\"vt left\">\r\n                        <div class=\"vtSmallTitle\">退款金额</div>\r\n                        <div id=\"amount\" class=\"vtcontent\"></div>\r\n                    </div>\r\n                </div>\r\n                <div class=\"op-container\">\r\n                    <a id=\"submit\" href=\"javascript:void(0)\" class=\"btn btn-info\"><span class=\"glyphicon glyphicon-ok\" style=\"color: #fff; font-size: 15px;\"> 提&nbsp交</span></a>&nbsp\r\n                    <a id=\"cancel\" href=\"javascript:void(0)\" class=\"btn btn-info\"><span class=\"glyphicon glyphicon-remove\" style=\"color: #fff; font-size: 15px;\"> 取&nbsp消</span></a>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>";

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(134);
const htmlDetail = __webpack_require__(135);
const compText = __webpack_require__(7);
__webpack_require__(31);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #confirm": "onClickConfirm",
        "click #clear": "onClickClear",
        "click #back": "onClickBack"
    },

    initialize: function (code, upUrl, loginKey) {
        this.orderid = sessionStorage.getItem("orderid");
        this.code = code || 0;
        this.key = loginKey;

        this.$el.html(this.template({
            titles: ["订单管理", "评价列表", "评价详情"],
            back: upUrl
        }));

        this.textReply = new compText();

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        // this.listenTo(this, 'confirmSuccess',this.confirmFinish);//表单提交成功后的回调函数

        this.url = 'https://www.kziche.com/admin/Order/commentDetail';
        this.param = {
            key: this.key,
            comment_id: this.code,
            order_id: this.orderid
            //如果传入参数则为编辑页面，没有则为添加页面
            // if ((typeof code) !== "undefined" && code != null){
        };this.queryData(this.url, this.param);
        // }
    },

    render: function () {
        this.$('#reply').append(this.textReply.render().el);

        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        this.textReply.setParam({
            title: '回复用户内容'
        });
    },

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function (url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillPage: function (res) {
        this.textReply.setValue(res.reply);
        var templateDetail = _.template(htmlDetail);
        this.$("#orderDetail").append(templateDetail({
            items: res.items
        }));
        this.$("#order").append(res.data.order_sn);
        this.$("#createTime").append(res.data.create_time);
        this.$("#nickname").append(res.data.nickname);
        this.$("#score").append(res.data.score);
        this.$("#comment").append(res.data.content);
        this.$("#storename").append(res.data.store_name);
    },

    onClickClear: function () {},

    onClickConfirm: function () {
        var content = this.textReply.getValue();
        var me = this;
        $.ajax({
            url: 'https://www.kziche.com/admin/Order/commentReply',
            type: 'post',
            data: {
                key: me.key,
                comment_id: this.code,
                content: content
            },
            success: function (res) {
                if (res.code == 200) {
                    alert("上传成功");
                    this.trigger('confirmFinish');
                } else {
                    alert(res.msg);
                    this.trigger('confirmFail', res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = "<div class=\"pageHead\">\r\n    <div class=\"phLeft\"><img src=\"" + __webpack_require__(10) + "\" alt=\"\">&nbsp&nbsp<span style=\"color:#9e9e9e;\">当前位置：</span>\r\n        <% _.each(titles,function(title,index){%>\r\n            <% if(titles.length-1 > index){ %>\r\n                <span><%=title%></span> >\r\n                <% }else{ %>\r\n                    <span><%=title%></span>\r\n                    <% } %>\r\n                        <%})%>\r\n    </div>\r\n    <div class=\"phRight\">\r\n        <% if(back){%>\r\n            <a onClick=\"javascript :history.back(-1);\" href=\"javascript:void(0)\" class=\"btn btn-info back\">返回</a>\r\n            <% } %>\r\n    </div>\r\n</div>\r\n<div class=\"panel panel-default\">\r\n    <div class=\"panel-body\">\r\n        <div class=\"vtContainer\">\r\n            <div class=\"vtBigTitle\">\r\n                <span>基本信息</span>\r\n            </div>\r\n             <div class=\"vtBox\">\r\n                <div class=\"vt left\">\r\n                    <div class=\"vtSmallTitle\">订单号</div>\r\n                    <div id=\"order\" class=\"vtcontent\"></div>\r\n                </div>\r\n                 <div class=\"vt right\">\r\n                    <div class=\"vtSmallTitle\">订单生成时间</div>\r\n                    <div id=\"createTime\" class=\"vtcontent\">store</div>\r\n                </div>\r\n            </div>\r\n    \r\n             <div class=\"vtBox\">\r\n                <div class=\"vt left\">\r\n                    <div class=\"vtSmallTitle\">用户</div>\r\n                    <div id=\"nickname\" class=\"vtcontent\"></div>\r\n                </div>\r\n                 <div class=\"vt right\">\r\n                    <div class=\"vtSmallTitle\">门店名称</div>\r\n                    <div id=\"storename\" class=\"vtcontent\">store</div>\r\n                </div>\r\n            </div>\r\n           \r\n        </div>\r\n            <hr>\r\n            <div id=\"orderDetail\">\r\n            </div>\r\n            <hr>\r\n             <div class=\"vtContainer\">\r\n             <div class=\"vtBigTitle\">\r\n                <span>用户评价信息</span>\r\n            </div>\r\n            <div class=\"vtBox\">\r\n                <div class=\"vt left\">\r\n                    <div class=\"vtSmallTitle\">用户评价分数</div>\r\n                    <div id=\"score\" class=\"vtcontent\"></div>       \r\n                </div>\r\n            </div>\r\n            <div class=\"vtBox\">\r\n            <div class=\"vt left\">\r\n                <div class=\"vtSmallTitle\">用户评价内容</div>\r\n                <div id=\"comment\" class=\"vtcontent\"></div>\r\n            </div>\r\n            </div>\r\n            <div id=\"reply\" class=\"orderReply\">\r\n            </div>\r\n            </div>\r\n            \r\n            <div class=\"op-container\">\r\n                <button type=\"button\" id=\"confirm\" class=\"btn btn-primary\">提&nbsp&nbsp&nbsp&nbsp&nbsp交</button>\r\n                <button type=\"button\" id=\"clear\" class=\"btn btn-primary\">重&nbsp&nbsp&nbsp&nbsp&nbsp置</button>\r\n            </div>\r\n      \r\n    </div>\r\n</div>\r\n</div>";

/***/ }),
/* 135 */
/***/ (function(module, exports) {

module.exports = "<div class=\"vtContainer\">\r\n    <div class=\"vtBigTitle\">\r\n        <span>订单详情</span>\r\n    </div>\r\n    <% if(items && items.length != 0){%>\r\n    <div class=\"vtBox\">\r\n        <div class=\"vt vtTablehead\">\r\n            <div>项目名称</div>\r\n            <div>价格(元)</div>\r\n            <div>数量</div>\r\n        </div>\r\n    </div>\r\n    <% _.each(items,function(item,index){%>\r\n    <div class=\"vtBox\">\r\n        <div class=\"vt vtTable\">\r\n            <div><%=item.items_name %></div>\r\n            <div><%=item.price %></div>\r\n            <div>X <%=item.num %></div>\r\n        </div>\r\n    </div>\r\n    <% }) %>\r\n<%}else{%>\r\n    <div class=\"vtBox\">\r\n        <div class=\"vt\">\r\n            <span class=\"glyphicon glyphicon-exclamation-sign\" style=\"color: rgb(177, 0, 60); font-size: 23px;\"> 该订单没有相关详情记录</span>\r\n        </div>\r\n    </div>\r\n<%}%>\r\n</div>";

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function (loginKey) {
        this.$el.html(this.template({
            titles: ["订单管理", "退款申请列表"],
            back: false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd: false,
            addLink: "",
            showSearch: true,
            linesNum: 2
        });
        this.key = loginKey;

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Order/refundList';
        this.tableParam = {
            key: this.key,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            signStartTime: this.getDate('month', 3),
            signEndTime: this.getDate(),
            state: ''
        };
        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        // this.$('#pg').append(this.pagement.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ["会员", "订单号", "申请时间", "内容", "付款方式", "金额", "状态"]; //表头
        var rows = ["nickname", "order_sn", "create_time", "items_name", "pay_type_name", "amount", "state_name"]; //表列
        var opration = [{ name: '详情', elID: 'refund_id', elName: "xq", link: "views/order/form/refundView" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("refund_id");

        //搜索栏配置
        var searchComponents = [{
            type: 'daterange',
            line: 0,
            param: {
                title: "时间范围",
                startDate: this.getDate('month', 3),
                endDate: this.getDate(),
                name: 'daterange'
            }
        }, {
            type: 'text',
            line: 0,
            param: {
                title: "搜索条件",
                value: "",
                explain: "要查询的会员名、订单",
                name: "text"
            }
        }, {
            type: 'select',
            line: 0,
            param: {
                title: "处理状态",
                options: [{
                    value: '1',
                    content: "未处理"
                }, {
                    value: '2',
                    content: "已处理"
                }],
                name: "state"
            }
        }];
        this.search.setParam(searchComponents);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        this.pagement.clearPage();
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1,
                            total: res.count
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function () {
        var dateRange = this.search.getElByName('daterange');
        var searchText = this.search.getElByName('text');
        var searchSelect = this.search.getElByName('state');

        this.tableParam.searchCriteria = searchText.getValue();
        this.tableParam.signStartTime = dateRange.getStartDate();
        this.tableParam.signEndTime = dateRange.getEndDate();
        this.tableParam.state = searchSelect.getValue();
        this.tableParam.page = 1;
        this.queryData(this.url, this.tableParam, true);
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        if (data.length == 0) {
            this.pagement.clearPage();
        }
        this.table.setData(data);
    },

    /**
     * 获取日期
     * @param  {string} type  [修改的类型month月份,day天数]
     * @param  {num} param [与当前日期回退的type数量]
     * @return {[type]}       [description]
     */
    getDate: function (type, param) {
        let date = new Date();
        if (type && type == "month") {
            date.setMonth(date.getMonth() - param);
        }
        if (type && type == "day") {
            date.setDate(date.getDate() - param);
        }
        let day = date.getDate();
        let month = date.getMonth() + 1;

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        let year = date.getFullYear();
        let result = year + "-" + month + "-" + day;
        return result;
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compSearch = __webpack_require__(3);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function (loginKey) {
        this.$el.html(this.template({
            titles: ["订单管理", "退款原因"],
            back: false
        }));
        this.table = new compTable();
        this.search = new compSearch({
            showAdd: true,
            addLink: "#views/order/form/refundReason",
            showSearch: false,
            linesNum: 0
        });
        this.key = loginKey;

        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Order/refundReason';
        this.tableParam = {
            key: this.key
        };
        this.queryData(this.url, this.tableParam);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ["退款原因"]; //表头
        var rows = ["name"]; //表列
        var opration = [{ name: '编辑', elID: 'id', elName: "edit", link: "views/order/form/refundReason" }, { name: '删除', elID: 'id', elName: "del" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("id");
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param) {
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    },

    onClickDelet: function (e) {
        var sure = window.confirm("是否删除该条记录");
        console.log(sure);
        if (!sure) {
            return;
        }
        var id = $(e.target).attr("elid");
        var me = this;
        $.ajax({
            url: "https://www.kziche.com/admin/Order/delrefundReason",
            type: 'get',
            dataType: 'json',
            data: {
                key: me.key,
                ids: id
            },
            success: function (res) {
                if (res.code == 200) {
                    alert("删除成功");
                    $(me).closest("tr").hide();
                } else {
                    alert(res.msg);
                    // var temp = [];
                    // this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                alert("网页出错");
            }.bind(this)
        });
    },

    freshTable: function (data) {
        this.table.setData(data);
        this.$("a[name='del']").click(this.onClickDelet);
    },

    /**
     * 获取日期
     * @param  {string} type  [修改的类型month月份,day天数]
     * @param  {num} param [与当前日期回退的type数量]
     * @return {[type]}       [description]
     */
    getDate: function (type, param) {
        let date = new Date();
        if (type && type == "month") {
            date.setMonth(date.getMonth() - param);
        }
        if (type && type == "day") {
            date.setDate(date.getDate() - param);
        }
        let day = date.getDate();
        let month = date.getMonth() + 1;

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        let year = date.getFullYear();
        let result = year + "-" + month + "-" + day;
        return result;
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(11);
const compSelect = __webpack_require__(8);
const compText = __webpack_require__(7);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #confirm": "onClickConfirm",
        "click #clear": "onClickClear",
        "click #back": "onClickBack"
    },

    initialize: function (code, upUrl, loginKey) {
        this.code = code || 0;
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["权限管理", "管理员列表", "管理员详情"],
            back: upUrl
        }));

        this.textUserName = new compText();
        this.textPassword = new compText();
        this.textConfirmPassword = new compText();
        this.textName = new compText();

        this.selectRole = new compSelect();

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this, 'confirmFinish', this.confirmFinish); //表单提交成功后的回调函数
        this.listenTo(this, 'renderFinish', this.renderPageComplete); //页面渲染完成，主要是看下拉框渲染完成

        this.url = 'https://www.kziche.com/admin/Order/manageDetail';
        this.param = {
            key: this.key,
            manage_id: this.code
        };
    },

    render: function () {
        this.$('#main').append(this.textUserName.render().el);
        this.$('#main').append(this.textName.render().el);
        this.$('#main').append(this.textPassword.render().el);
        this.$('#main').append(this.textConfirmPassword.render().el);
        this.$('#main').append(this.selectRole.render().el);
        return this;
    },

    renderPageComplete: function () {
        //如果传入参数则为编辑页面，没有则为添加页面
        if (typeof this.code !== "undefined" && this.code != null) {
            this.queryData(this.url, this.param);
        }
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        this.textUserName.setParam({
            title: "手机号码"
        });
        this.textName.setParam({
            title: "姓名"
        });
        this.textPassword.setParam({
            title: "登陆密码"
        });
        this.textConfirmPassword.setParam({
            title: "确认密码"
        });
        this.selectRole.setParam({
            title: "角色",
            name: "role",
            options: [{
                value: 1,
                content: "超级管理员"
            }, {
                value: 2,
                content: "客服"
            }]
        });
        this.fillSelectOption();
    },

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function (url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillPage: function (data) {
        //这里再进行数据的装配
        this.textUserName.setValue(data.phone);
        this.textName.setValue(data.name);
        this.selectRole.setValue(data.role_id);
    },

    onClickClear: function (e) {},

    confirmFinish: function () {
        alert("提交成功");
        window.history.back();
    },

    onClickConfirm: function (e) {
        var me = this;
        var userName = this.textUserName.getValue();
        var password = this.textPassword.getValue();
        var confirmPassword = this.textConfirmPassword.getValue();
        var name = this.textName.getValue();
        var role = this.selectRole.getValue();

        $.ajax({
            url: 'https://www.kziche.com/admin/Order/addManage',
            type: 'post',
            dataType: 'json',
            data: {
                key: me.key,
                id: me.code,
                phone: userName,
                password: password,
                repassword: confirmPassword,
                role_id: role,
                name: name
            },
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('confirmFinish');
                } else {
                    alert(res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    fillSelectOption: function () {
        var me = this;
        $.ajax({
            url: "https://www.kziche.com/admin/Order/roleList",
            type: 'get',
            dataType: 'json',
            data: {
                key: me.key
            },
            success: function (res) {
                if (res.code == 200) {
                    me.selectRole.setOptions(res.data);
                    this.trigger("renderFinish");
                } else {
                    var temp = [];
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(11);
const compSelect = __webpack_require__(8);
const compText = __webpack_require__(7);
const compPermission = __webpack_require__(41);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #confirm": "onClickConfirm",
        "click #back": "onClickBack"
    },

    initialize: function (code, upUrl, loginKey) {
        this.code = code || 0;
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["权限管理", "角色列表", "角色详情"],
            back: upUrl
        }));
        this.textName = new compText();
        this.permission = new compPermission(this.key);
        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this.permission, "permissionReady", this.startGetData); //因为该组件也需要异步调用数据，所以需要等待该组件渲染完毕
        this.listenTo(this, 'confirmFinish', this.confirmFinish); //表单提交成功后的回调函数
    },

    render: function () {
        this.$('#main').append(this.textName.render().el);
        this.$('#main').append(this.permission.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        this.textName.setParam({
            title: "角色名称",
            msg: "管理角色名称"
        });

        this.permission.setParam({
            name: 'permission'
        });
    },

    startGetData: function () {
        this.url = 'https://www.kziche.com/admin/Order/roleDetail';
        this.param = {
            key: this.key,
            id: this.code
            //如果传入参数则为编辑页面，没有则为添加页面
        };if (typeof this.code !== "undefined" && this.code != null) {
            this.queryData(this.url, this.param);
        }
    },

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function (url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillPage: function (data) {
        //这里再进行数据的装配
        this.textName.setValue(data.name);
        this.permission.setValue(data.authority);
    },

    onClickClear: function (e) {},

    confirmFinish: function () {
        alert("提交成功");
        window.history.back();
    },

    onClickConfirm: function (e) {
        var me = this;
        var name = this.textName.getValue();
        var authority = this.permission.getValue();

        $.ajax({
            url: 'https://www.kziche.com/admin/Order/addRole',
            type: 'post',
            dataType: 'json',
            data: {
                key: me.key,
                id: me.code,
                name: name,
                authority: authority
            },
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('confirmFinish');
                } else {
                    alert(res.msg);
                    this.trigger('confirmFail', res.msg);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "panel panel-default",

    template: _.template(htmlTpl),

    initialize: function () {
        this.$el.html(this.template({
            title: "表格页面",
            sub: "页面说明"
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch();
        // var ue = UE.getEditor('editor');

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'http://www.kzxueche.com/institutionapi/Baseinsti/security_guardList';
        this.tableParam = {
            isexport: 1,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            key: '40kzm151243778659066910'
        };
        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        // this.$('#pg').append(this.pagement.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ['安全员编号', "姓名", "性别", "身份证号", "联系电话", "联系地址", "驾驶证号", "在职状态", "入职日期", "同步状态"]; //表头
        var rows = ['secunum', { name: 'name', isSkip: true, link: "views/formExample", code: "id" }, 'sex', 'idcard', 'mobile', 'address', 'drilicence', 'employstatus_name', 'hiredate', 'synchro_flag']; //表列
        var opration = [{ name: '审核', elID: 'code', elName: "sh" }, { name: '编辑', elID: 'code', elName: "bj" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(false);
        this.table.setHasCheckBox(true);

        //搜索栏配置
        var searchComponents = [{
            type: 'daterange',
            param: {
                title: "时间范围",
                startDate: "2017-11-27",
                endDate: "2017-11-28",
                startTime: "12:00:01"
            }
        }, {
            type: 'text',
            param: {
                title: "搜索条件",
                value: "",
                explain: "要查询的姓名、订单",
                name: "name"
            }
        }];
        this.search.setParam(searchComponents);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function (param) {
        // var dateRange = this.search.getElByName('daterange');
        // console.log(dateRange.getStartDate());
        // console.log(dateRange.getEndDate());
        console.log(param);
        //this.tableParam 属性设置
        // this.queryData(this.url,this.tableParam,false);
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        this.table.setData(data);
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);
const compBatch = __webpack_require__(9);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function (loginKey) {
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["权限管理", "管理员列表"],
            back: false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd: true,
            addLink: "#views/permission/form/adminEdit",
            showSearch: true,
            linesNum: 1
        });
        this.batch = new compBatch();

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.listenTo(this.batch, "goBatch", this.goBatch);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Order/manageList';
        this.tableParam = {
            key: this.key,
            searchCriteria: '',
            page: 1,
            pagesize: 15
        };
        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        this.$('#batch').append(this.batch.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ['用户名', "管理员归属", "加入时间", "最后登录时间", "操作人"]; //表头
        var rows = ['username', 'type_name', 'create_time', 'last_login_time', 'manage_name']; //表列
        var opration = [{ name: '编辑', elID: 'manage_id', elName: "bj", link: "views/permission/form/adminEdit" }, { name: '封号', elID: 'manage_id', elName: "fh" }, { name: '解封', elID: 'manage_id', elName: "jf" }, { name: '删除', elID: 'manage_id', elName: "del" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("manage_id");

        //搜索栏配置
        var searchComponents = [{
            type: 'text',
            line: 0,
            param: {
                title: "搜索条件",
                value: "",
                explain: "要查询的用户名、手机号码",
                name: "text"
            }
        }];
        this.search.setParam(searchComponents);

        var batchOptions = [{ value: "1", content: "解封" }, { value: "2", content: "封号" }, { value: "3", content: "删除" }];
        this.batch.setParam(batchOptions);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        this.pagement.clearPage();
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1,
                            total: res.count
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function (param) {
        var searchText = this.search.getElByName('text');
        this.tableParam.searchCriteria = searchText.getValue();
        this.tableParam.page = 1;
        this.queryData(this.url, this.tableParam, true);
    },

    goBatch: function (type) {
        var ids = [];
        var url = "";
        var param = null;

        this.$("#cont tbody input[type='checkbox']:checked").each(function (index, e) {
            ids.push($(e).attr("checkid"));
        });

        if (ids.length == 0) {
            alert("未选取任何记录");
            return;
        }

        var idsString = ids.join(",");

        if (type == "1") {
            url = "https://www.kziche.com/admin/Order/sealManage";
            param = {
                key: this.key,
                manage_ids: idsString,
                type: type
            };
        }
        if (type == "2") {
            url = "https://www.kziche.com/admin/Order/sealManage";
            param = {
                key: this.key,
                manage_ids: idsString,
                type: type
            };
        }
        if (type == "3") {
            url = "https://www.kziche.com/admin/Order/delManage";
            param = {
                key: this.key,
                manage_ids: idsString
            };
        }
        this.batchAjax(url, param);
    },

    batchAjax: function (tempUrl, param) {
        var me = this;
        $.ajax({
            url: tempUrl,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    alert(res.msg);
                    this.tableParam.page = 1;
                    this.queryData(me.url, me.tableParam, true);
                } else {
                    alert(res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        if (data.length == 0) {
            this.pagement.clearPage();
        }
        this.table.setData(data);
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compSearch = __webpack_require__(3);
const compBatch = __webpack_require__(9);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function (loginKey) {
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["权限管理", "角色列表"],
            back: false
        }));
        this.table = new compTable();
        this.search = new compSearch({
            showAdd: true,
            addLink: "#views/permission/form/roleEdit",
            showSearch: false,
            linesNum: 0
        });
        this.batch = new compBatch();

        this.listenTo(this, "dataReady", this.freshTable);
        this.listenTo(this.batch, "goBatch", this.goBatch);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Order/roleList';
        this.tableParam = {
            key: this.key
        };
        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        this.$('#batch').append(this.batch.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ["角色ID", "角色"]; //表头
        var rows = ["id", "name"]; //表列
        var opration = [{ name: '编辑', elID: 'id', elName: "bj", link: "views/permission/form/roleEdit" }, { name: '删除', elID: 'id', elName: "del" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("id");

        var batchOptions = [{ value: "3", content: "删除" }];
        this.batch.setParam(batchOptions);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    goBatch: function (type) {
        var ids = [];
        var url = "";
        var param = null;

        this.$("#cont tbody input[type='checkbox']:checked").each(function (index, e) {
            ids.push($(e).attr("checkid"));
        });

        if (ids.length == 0) {
            alert("未选取任何记录");
            return;
        }

        var idsString = ids.join(",");
        if (type == "3") {
            url = "https://www.kziche.com/admin/Order/delrole";
            param = {
                key: this.key,
                role_ids: idsString
            };
        }
        this.batchAjax(url, param);
    },

    batchAjax: function (tempUrl, param) {
        var me = this;
        $.ajax({
            url: tempUrl,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    alert(res.msg);
                    this.tableParam.page = 1;
                    this.queryData(me.url, me.tableParam, true);
                } else {
                    alert(res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        if (data.length == 0) {
            this.pagement.clearPage();
        }
        this.table.setData(data);
        var me = this;
        /*
        绑定操作点击事件
         */
        this.$('a[name="del"]').click(function (el) {
            var ids = $(el.target).attr("elid");
            var text = $(el.target).text();
            var url = "https://www.kziche.com/admin/Order/delrole";
            var param = {
                key: me.key,
                role_ids: ids
            };
            var sure = window.confirm("确定执行 " + text + " 操作?");
            if (sure) {
                me.batchAjax(url, param);
            }
        });
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(51);

// require("/ueditor/ueditor.config.js");
// require("/ueditor/ueditor.all.js");
// require("/ueditor/lang/zh-cn/zh-cn.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "panel panel-default",

    template: _.template(htmlTpl),

    events: {
        "click ul>li>a": "onClickA"
    },

    initialize: function () {
        this.$el.html(this.template({
            title: "表格页面",
            sub: "页面说明"
        }));
        // this.table = new compTable();
        // this.pagement = new compPage();
        // this.search = new compSearch();
        // var ue = UE.getEditor('editor');

        // this.listenTo(this.search, "goSearch", this.queryData);
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        // this.url = 'http://www.kzxueche.com/institutionapi/Baseinsti/security_guardList';
        // this.tableParam = {
        //     isexport: 1,
        //     searchCriteria: '',
        //     page: 1,
        //     pagesize: 15,
        //     key: '40kzm151243778659066910'
        // }
        // this.queryData(this.url, this.tableParam,true);
    },

    render: function () {

        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {},
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    onClickA: function (e) {
        this.$('ul').find('li').removeClass('active');
        $(e.target).closest('li').addClass('active');
        var targetId = $(e.target).attr('targetId');
        console.log(targetId);
        this.$('#myTabContent>div').removeClass('in').removeClass('active');
        this.$('#' + targetId).addClass('in').addClass('active');
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {}

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(11);
const compCheckbox = __webpack_require__(12);
const compSelect = __webpack_require__(8);
const compText = __webpack_require__(7);
const compFile = __webpack_require__(13);
const compUeditor = __webpack_require__(15);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #confirm": "onClickConfirm",
        "click #clear": "onClickClear",
        "click #back": "onClickBack"
    },

    initialize: function (code, upUrl, loginKey) {
        this.code = code || 0;
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["服务管理", "次卡详情"],
            back: upUrl
        }));

        this.textCardName = new compText();
        this.textCardContent = new compText();
        this.textMoney = new compText();
        this.textNumber = new compText();
        this.ueditorDetail = new compUeditor();

        this.checkboxIsBuy = new compCheckbox();
        this.selectType = new compSelect();
        this.selectWay = new compSelect();
        this.filePhoto = new compFile();
        this.fileUsedPhoto = new compFile();

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this, "renderFinish", this.renderPlugin);
        this.listenTo(this, 'confirmFinish', this.confirmFinish); //表单提交成功后的回调函数

        this.url = 'https://www.kziche.com/admin/Member/cardDetail';
        this.param = {
            key: this.key,
            card_id: code
            //如果传入参数则为编辑页面，没有则为添加页面
        };if (typeof code !== "undefined" && code != null) {
            this.queryData(this.url, this.param);
        }
    },

    render: function () {
        this.$('#main').append(this.textCardName.render().el);
        this.$('#main').append(this.textCardContent.render().el);
        this.$('#main').append(this.textMoney.render().el);
        this.$('#main').append(this.textNumber.render().el);

        // this.$('#main').append(this.selectType.render().el);
        // this.$('#main').append(this.selectWay.render().el);

        this.$('#main').append(this.checkboxIsBuy.render().el);
        this.$('#main').append(this.filePhoto.render().el);
        this.$('#main').append(this.fileUsedPhoto.render().el);
        this.$('#main').append(this.ueditorDetail.render().el);

        return this;
    },

    renderPlugin: function () {
        this.ueditorDetail.trigger("renderFinish");
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        this.textCardName.setParam({
            title: "次卡名称"
        });
        this.textMoney.setParam({
            title: "购买金额",
            msg: "只接受整数金额"
        });
        this.textNumber.setParam({
            title: "有效次数",
            msg: "次卡使用次数"
        });
        this.textCardContent.setParam({
            title: '次卡描述',
            msg: "描述该次卡的用途"
        });
        this.ueditorDetail.setParam({
            title: "次卡详情",
            msg: "请在这里编辑次卡的详情信息"
        });
        this.selectType.setParam({
            title: "使用类型",
            options: [{
                value: 1,
                content: "标准洗车"
            }]
        });
        this.selectWay.setParam({
            title: "使用方式",
            options: [{
                value: 1,
                content: "单独使用"
            }, {
                value: 2,
                content: "混合使用"
            }, {
                value: 3,
                content: "余额支付"
            }]
        });
        this.checkboxIsBuy.setParam({
            title: '是否余额购买',
            options: [{
                value: 1,
                content: "是"
            }, {
                value: 2,
                content: "否"
            }]
        });
        this.filePhoto.setParam({
            title: "次卡图片",
            msg: "只上传1个图片"
        });
        this.fileUsedPhoto.setParam({
            title: "使用后图片",
            msg: "只上传1个图片"
        });
    },

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function (url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillPage: function (data) {
        //这里再进行数据的装配
        this.textCardName.setValue(data.name);
        this.textCardContent.setValue(data.describe);
        this.textMoney.setValue(data.price);
        this.selectWay.setValue(data.rule);
        this.checkboxIsBuy.setValue(data.is_balance);
        this.selectType.setValue(data.category_id);
        this.ueditorDetail.setValue(data.detail);
        this.filePhoto.setFile(data.pic);
        this.fileUsedPhoto.setFile(data.finished_pic);
        this.textNumber.setValue(data.number);
    },

    onClickClear: function (e) {},

    onClickConfirm: function (e) {
        var form = new FormData();
        var name = this.textCardName.getValue();
        var price = this.textMoney.getValue();
        var describe = this.textCardContent.getValue();
        // var rule = this.selectWay.getValue();
        var isBalance = this.checkboxIsBuy.getValue();
        // var categoryId = this.selectType.getValue();
        var pic = this.filePhoto.getFiles();
        var ossPic = this.filePhoto.isChange();

        var usedPic = this.fileUsedPhoto.getFiles();
        var ossUsed = this.fileUsedPhoto.isChange();

        var detail = this.ueditorDetail.getValue();
        var number = this.textNumber.getValue();

        form.append('key', this.key);
        form.append('id', this.code);
        form.append('name', name);
        form.append('price', price);
        form.append('describe', describe);
        form.append('detail', detail);
        // form.append('category_id',categoryId);
        // form.append('rule',rule);
        form.append('pic', pic[0]);
        form.append('oss_photo_notnull', ossPic);
        form.append('finished_pic', usedPic[0]);
        form.append('oss_photo_notnull1', ossUsed);
        form.append('number', number);
        form.append('is_balance', isBalance);

        $.ajax({
            url: 'https://www.kziche.com/admin/Member/addCard',
            type: 'post',
            data: form,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.code == 200) {
                    alert("上传成功");
                    this.trigger('confirmFinish');
                } else {
                    alert(res.msg);
                    this.trigger('confirmFail', res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    confirmFinish: function () {
        alert("提交成功");
        window.history.back();
    },

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(11);
const compCheckbox = __webpack_require__(12);
const compSelect = __webpack_require__(8);
const compText = __webpack_require__(7);
const compFile = __webpack_require__(13);
const compColor = __webpack_require__(26);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #confirm": "onClickConfirm",
        "click #clear": "onClickClear",
        "click #back": "onClickBack"
    },

    initialize: function (code, upUrl, loginKey) {
        this.code = code || 0;
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["服务管理", " 分类详情"],
            back: upUrl
        }));

        this.textCateName = new compText();
        this.textSort = new compText();
        this.textDescribe = new compText();

        this.checkboxIsShow = new compCheckbox();
        this.checkboxIsShowOnSide = new compCheckbox();

        this.color = new compColor();
        this.selectUpCate = new compSelect();
        this.filePhoto = new compFile();

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this, 'confirmFinish', this.confirmFinish); //表单提交成功后的回调函数

        this.url = 'https://www.kziche.com/admin/Member/serviceCateDetail';
        this.param = {
            key: this.key,
            cate_id: this.code
            //如果传入参数则为编辑页面，没有则为添加页面
        };if (typeof code !== "undefined" && code != null) {
            this.queryData(this.url, this.param);
        }
    },

    render: function () {
        this.$('#main').append(this.textCateName.render().el);
        this.$('#main').append(this.selectUpCate.render().el);
        this.$('#main').append(this.textSort.render().el);
        this.$('#main').append(this.checkboxIsShow.render().el);
        this.$('#main').append(this.checkboxIsShowOnSide.render().el);
        this.$('#main').append(this.color.render().el);

        this.$('#main').append(this.textDescribe.render().el);

        this.$('#main').append(this.filePhoto.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        this.textCateName.setParam({
            title: "分类名称"
        });
        this.textDescribe.setParam({
            title: "分类描述",
            msg: "简要描述该分类"
        });

        this.textSort.setParam({
            title: '排序',
            msg: "该分类的排序"
        });
        this.selectUpCate.setParam({
            title: "上级分类",
            options: [{
                value: 0,
                content: "顶级分类"
            }]
        });
        this.color.setParam({
            title: "图表颜色",
            msg: "选择在图表中显示的颜色(rgb格式)"
        });

        this.checkboxIsShow.setParam({
            title: "是否显示",
            options: [{
                value: 1,
                content: "是"
            }, {
                value: 2,
                content: "否"
            }]
        });
        this.checkboxIsShowOnSide.setParam({
            title: "是否显示在导航栏",
            options: [{
                value: 1,
                content: "是"
            }, {
                value: 2,
                content: "否"
            }]
        });
        this.filePhoto.setParam({
            title: "分类图片"
        });
    },

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function (url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillPage: function (data) {
        //这里再进行数据的装配
        this.textCateName.setValue(data.name);
        this.textSort.setValue(data.sort);
        this.textDescribe.setValue(data.describe);
        this.checkboxIsShow.setValue(data.is_show);
        this.checkboxIsShowOnSide.setValue(data.is_navigation);
        this.selectUpCate.setValue(data.pid);
        this.filePhoto.setFile(data.pic);
        this.color.setValue(data.colour);
    },

    onClickClear: function (e) {},

    confirmFinish: function () {
        alert("提交成功");
        window.history.back();
    },

    onClickConfirm: function (e) {
        var name = this.textCateName.getValue();
        var sort = this.textSort.getValue();
        var describe = this.textDescribe.getValue();
        var isShow = this.checkboxIsShow.getValue();
        var isNavigation = this.checkboxIsShowOnSide.getValue();
        var pid = this.selectUpCate.getValue();
        var photo = this.filePhoto.getFiles();
        var ossPhoto = this.filePhoto.isChange();
        var color = this.color.getValue();

        var form = new FormData();
        form.append('id', this.code);
        form.append('key', this.key);
        form.append('name', name);
        form.append('colour', color);
        form.append('pic', photo[0]);

        form.append('is_show', isShow);
        form.append('is_navigation', isNavigation);
        form.append('describe', describe);
        form.append('sort', sort);
        form.append('pid', pid);
        form.append('oss_photo_notnull', ossPhoto);

        $.ajax({
            url: 'https://www.kziche.com/admin/Member/addServiceCate',
            type: 'post',
            data: form,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('confirmFinish');
                } else {
                    alert(res.msg);
                    this.trigger('confirmFail', res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(51);
const normalEdit = __webpack_require__(52);
const detailEdit = __webpack_require__(54);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click ul>li>a": "onClickA",
        "click #allConfirm": "onConfirm",
        "click #allClear": "onClear"
    },

    initialize: function (code, upUrl, loginKey) {
        this.code = code || 0;
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["服务管理", "服务项目详情"],
            back: upUrl
        }));

        this.normalProject = new normalEdit(this.code, upUrl, this.key);
        this.detailProject = new detailEdit(this.code, upUrl, this.key);

        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.fillPage);
        this.listenTo(this, "renderFinish", this.renderPlugin);
        this.listenTo(this, 'confirmFinish', this.confirmFinish); //表单提交成功后的回调函数

        this.url = 'https://www.kziche.com/admin/Member/showServiceItems';
        this.param = {
            key: this.key,
            items_id: this.code
        };

        if (typeof code !== "undefined" && code != null) {
            this.queryData(this.url, this.param);
        }
    },

    render: function () {
        this.$("#normal").append(this.normalProject.render().el);
        this.$("#detail").append(this.detailProject.render().el);
        return this;
    },

    renderPlugin: function () {
        this.detailProject.trigger("renderFinish");
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillPage: function (data) {
        this.normalProject.fillPage(data);
        this.detailProject.fillPage(data);
    },
    /**
     * 点击导航栏触发的回调函数
     */
    onClickA: function (e) {
        this.$('ul').find('li').removeClass('active');
        $(e.target).closest('li').addClass('active');
        var targetId = $(e.target).attr('targetId');
        this.$('#myTabContent>div').removeClass('in').removeClass('active');
        this.$('#' + targetId).addClass('in').addClass('active');
    },

    onClear: function (e) {},

    confirmFinish: function () {
        alert("提交成功");
        window.history.back();
    },

    onConfirm: function (e) {
        var normal = this.normalProject.getFormData();
        var detail = this.detailProject.getFormData();
        var form = new FormData();
        form.append('key', this.key);
        form.append('id', this.code);
        form.append('name', normal.name);
        form.append('category_id', normal.category_id);
        form.append('actual_price', normal.actual_price);
        form.append('market_price', normal.market_price);
        form.append('keyword', normal.keyword);
        form.append('thumbnail', normal.thumbnail);
        form.append('oss_photo_notnull', normal.oss_photo_notnull);
        form.append('colour', normal.colour);
        for (let i = 0; i < normal.main.length; i++) {
            form.append('pic[]', normal.main[i]);
        }

        form.append('describe', detail.describe);
        form.append('brief_introduction', detail.brief_introduction);
        $.ajax({
            url: 'https://www.kziche.com/admin/Member/addServiceItems',
            type: 'post',
            data: form,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('confirmFinish');
                } else {
                    alert(res.msg);
                    this.trigger('confirmFail', res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);
const compBatch = __webpack_require__(9);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function (loginKey) {
        this.$el.html(this.template({
            titles: ["服务管理", "次卡列表"],
            back: false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd: true,
            addLink: "#views/project/form/cardEdit",
            showSearch: false,
            linesNum: 0
        });
        this.batch = new compBatch();
        this.key = loginKey;

        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.listenTo(this.batch, "goBatch", this.goBatch);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Member/cardList';
        this.tableParam = {
            key: this.key,
            page: 1,
            pagesize: 15
        };
        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        this.$('#batch').append(this.batch.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ['次卡名称', "使用类型", "使用方式", "价格", "次数", "是否上架"]; //表头
        var rows = ['name', 'category_name', 'rule_name', 'price', 'number', 'state_name']; //表列
        var opration = [{ name: '编辑', elID: 'id', elName: "edt", link: "views/project/form/cardEdit" }];
        // ,{ name: '下架', elID: 'id', elName: "xj" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("id");

        // var searchComponents = [
        //     {
        //         type: 'text',
        //         param: {
        //             title: "条件查找",
        //             value: "",
        //             explain: "要查询的次卡名",
        //             name: "text"
        //         }
        //     }
        // ];
        // this.search.setParam(searchComponents);

        var batchOptions = [{ value: "1", content: "上架" }, { value: "2", content: "下架" }];
        this.batch.setParam(batchOptions);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        this.pagement.clearPage();
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1,
                            total: res.count
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function (param) {
        // var dateRange = this.search.getElByName('daterange');
        // console.log(dateRange.getStartDate());
        // console.log(dateRange.getEndDate());

        //this.tableParam 属性设置
        // this.queryData(this.url,this.tableParam,false);
    },

    goBatch: function (type) {
        var ids = [];
        var url = "";
        var param = null;

        this.$("#cont tbody input[type='checkbox']:checked").each(function (index, e) {
            ids.push($(e).attr("checkid"));
        });

        if (ids.length == 0) {
            alert("未选取任何记录");
            return;
        }

        var idsString = ids.join(",");

        if (type == "1") {
            url = "https://www.kziche.com/admin/Member/cardShelves";
            param = {
                key: this.key,
                card_ids: idsString,
                type: type
            };
        }
        if (type == "2") {
            url = "https://www.kziche.com/admin/Member/cardShelves";
            param = {
                key: this.key,
                card_ids: idsString,
                type: type
            };
        }

        this.batchAjax(url, param);
    },

    batchAjax: function (tempUrl, param) {
        var me = this;
        $.ajax({
            url: tempUrl,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    alert(res.msg);
                    this.tableParam.page = 1;
                    this.queryData(me.url, me.tableParam, true);
                } else {
                    alert(res.msg);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        if (data.length == 0) {
            this.pagement.clearPage();
        }
        this.table.setData(data);
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(48);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function (loginKey) {
        this.$el.html(this.template({
            titles: ["服务管理", "服务项目分类"],
            back: false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd: true,
            addLink: "#views/project/form/categoryEdit",
            showSearch: false,
            linesNum: 0
        });
        this.key = loginKey;

        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Member/serviceItemsCategory';
        this.tableParam = {
            key: this.key
        };
        this.queryData(this.url, this.tableParam);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);

        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {},
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    this.trigger("dataFail");
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam);
    },

    goSearch: function (param) {},

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        this.table.setData(data);
        var me = this;
        this.$('a[name="del"]').click(function (el) {
            var sure = confirm("是否删除该分类?");
            if (!sure) {
                return;
            }
            var cateid = $(el.target).attr("elid");
            var param = {
                key: me.key,
                cate_id: cateid
            };
            $.ajax({
                url: 'https://www.kziche.com/admin/Member/delItemsCate',
                type: 'get',
                dataType: 'json',
                data: param,
                success: function (res) {
                    if (res.code == 200) {
                        alert(res.msg);
                        me.queryData(me.url, me.tableParam);
                    } else {
                        alert(res.msg);
                    }
                }.bind(this),
                error: function () {
                    alert('页面出错');
                }.bind(this)
            });
        });
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);
const compBatch = __webpack_require__(9);

var selectKindModel = Backbone.Model.extend({
    url: "https://www.kziche.com/admin/Member/showServiceCate"
});

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function (loginKey) {
        this.$el.html(this.template({
            titles: ["服务管理", "服务项目列表"],
            back: false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd: true,
            addLink: "#views/project/form/projectEdit",
            showSearch: true,
            linesNum: 1
        });
        this.batch = new compBatch();
        this.key = loginKey;

        //通过model形式对数据进行更新
        this.kindModel = new selectKindModel();
        this.kindModel.on("change", this.fillSelectOption, this);

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this.batch, "goBatch", this.goBatch);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Member/serviceItems';
        this.tableParam = {
            key: this.key,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            keyword: '',
            shelves_state: '',
            category_id: ''
        };
        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        this.$('#batch').append(this.batch.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ["服务项目", "项目编码", "所属门店", "审核状态", "是否上架"]; //表头
        var rows = ["items_name", "code", { name: 'store_name', isSkip: false, link: "views/formExample", code: "id" }, "examine_state_name", "shelves_state_name"]; //表列
        var opration = [{ name: '编辑', elID: 'id', elName: "bj", link: "views/project/form/projectEdit" },
        // { name: '上架', elID: 'id', elName: "sj" }, { name: '下架', elID: 'id', elName: "xj" }, 
        { name: '回收站', elID: 'id', elName: "hsz" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("id");

        //搜索栏配置
        var searchComponents = [{
            type: 'text',
            line: 0,
            param: {
                title: "关键字",
                value: "",
                explain: "要查询的关键字",
                name: "keyword"
            }
        }, {
            type: 'select',
            line: 0,
            param: {
                title: "服务状态",
                options: [{
                    value: '1',
                    content: "上架"
                }, {
                    value: '2',
                    content: "下架"
                }],
                name: "state"
            }
        }, {
            type: 'select',
            line: 0,
            param: {
                title: "服务分类",
                options: [{
                    value: '1',
                    content: "分类1"
                }, {
                    value: '2',
                    content: "分类2"
                }],
                name: "kind"
            }
        }];

        this.search.setParam(searchComponents);
        this.kindModel.fetch({
            type: 'get',
            dataType: 'json',
            data: {
                key: this.key
            }
        });
        /*
        批量操作组件配置
        */
        var batchOptions = [{ value: "1", content: "上架" }, { value: "2", content: "下架" }, { value: "3", content: "放入回收站" }];
        this.batch.setParam(batchOptions);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        this.pagement.clearPage();
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1,
                            total: res.count
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function (param) {
        var searchKind = this.search.getElByName('kind');
        var searchState = this.search.getElByName('state');
        var searchKeyword = this.search.getElByName('keyword');

        this.tableParam.keyword = searchKeyword.getValue();
        this.tableParam.shelves_state = searchState.getValue();
        this.tableParam.category_id = searchKind.getValue();
        this.tableParam.page = 1;
        this.queryData(this.url, this.tableParam, true);
    },

    goBatch: function (type) {
        var ids = [];
        var url = "";
        var param = null;
        //获取选取的记录ID
        this.$("#cont tbody input[type='checkbox']:checked").each(function (index, e) {
            ids.push($(e).attr("checkid"));
        });

        if (ids.length == 0) {
            alert("未选取任何记录");
            return;
        }

        var idsString = ids.join(",");

        if (type == "1") {
            url = "https://www.kziche.com/admin/Member/serviceItemsShelves";
            param = {
                key: this.key,
                items_ids: idsString,
                type: type
            };
        }
        if (type == "2") {
            url = "https://www.kziche.com/admin/Member/serviceItemsShelves";
            param = {
                key: this.key,
                items_ids: idsString,
                type: type
            };
        }
        if (type == "3") {
            url = "https://www.kziche.com/admin/Member/delItems";
            param = {
                key: this.key,
                items_ids: idsString,
                type: 2
            };
        }
        this.batchAjax(url, param);
    },

    batchAjax: function (tempUrl, param) {
        var me = this;
        $.ajax({
            url: tempUrl,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    alert(res.msg);
                    this.tableParam.page = 1;
                    this.queryData(me.url, me.tableParam, true);
                } else {
                    alert(res.msg);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        if (data.length == 0) {
            this.pagement.clearPage();
        }
        this.table.setData(data);

        /*
        绑定操作点击事件
        */
        var me = this;
        this.$('a[name="hsz"]').click(function (el) {
            var ids = $(el.target).attr("elid");
            var text = $(el.target).text();
            var url = "https://www.kziche.com/admin/Member/delItems";
            var param = {
                key: me.key,
                items_ids: ids,
                type: 2
            };
            var sure = window.confirm("确定执行 " + text + " 操作?");
            if (sure) {
                me.batchAjax(url, param);
            }
        });
    },

    fillSelectOption: function (mod, option) {
        var me = this;
        var searchKind = me.search.getElByName("kind");
        searchKind.setOptions(mod.get("data"));
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);
const compBatch = __webpack_require__(9);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function (loginKey, code, upUrl) {
        this.$el.html(this.template({
            titles: ["回收站", "订单回收"],
            back: false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd: false,
            addLink: "",
            showSearch: true,
            linesNum: 1
        });
        this.batch = new compBatch();
        this.key = loginKey;

        this.listenTo(this.search, "goSearch", this.goSearch);
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.listenTo(this.batch, "goBatch", this.goBatch);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Order/orderList';
        this.tableParam = {
            key: this.key,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            signStartTime: this.getDate('month', 3),
            signEndTime: this.getDate(),
            logical_deletion: 2
        };

        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        this.$('#batch').append(this.batch.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ["会员", "订单号", "内容", "付款方式", "所属门店", "金额", "状态", "创建时间"];
        var rows = ["nickname", { name: 'order_sn', isSkip: false, link: "views/formExample", code: "id" }, "items_name", "pay_type_name", "store_name", "actual_money", "state_name", "create_time"]; //表列
        var opration = [{ name: '恢复', elID: 'order_id', elName: "rec" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("order_id");

        //搜索栏配置
        var searchComponents = [{
            type: 'daterange',
            line: 0,
            param: {
                title: "时间范围",
                startDate: this.getDate('month', 3),
                endDate: this.getDate(),
                name: "daterange"
            }
        }, {
            type: 'text',
            line: 0,
            param: {
                title: "搜索条件",
                value: "",
                explain: "要查询的会员名、订单号、状态、支付方式、内容",
                name: "text"
            }
        }];
        this.search.setParam(searchComponents);

        var batchOptions = [{ value: "1", content: "恢复" }];
        this.batch.setParam(batchOptions);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        this.pagement.clearPage();
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1,
                            total: res.count
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function (param) {
        var dateRange = this.search.getElByName('daterange');
        var searchText = this.search.getElByName('text');
        var searchPay = this.search.getElByName('pay'); //接口没有涉及

        this.tableParam.searchCriteria = searchText.getValue();
        this.tableParam.signStartTime = dateRange.getStartDate();
        this.tableParam.signEndTime = dateRange.getEndDate();
        this.tableParam.page = 1;
        this.queryData(this.url, this.tableParam, true);
    },

    goBatch: function (type) {
        var ids = [];
        var url = "";
        var param = null;

        this.$("#cont tbody input[type='checkbox']:checked").each(function (index, e) {
            ids.push($(e).attr("checkid"));
        });

        if (ids.length == 0) {
            alert("未选取任何记录");
            return;
        }

        var idsString = ids.join(",");

        if (type == "1") {
            url = "https://www.kziche.com/admin/Order/delOrder";
            param = {
                key: this.key,
                order_ids: idsString,
                type: type
            };
        }
        this.batchAjax(url, param);
    },

    batchAjax: function (tempUrl, param) {
        var me = this;
        $.ajax({
            url: tempUrl,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    alert(res.msg);
                    this.tableParam.page = 1;
                    this.queryData(me.url, me.tableParam, true);
                } else {
                    alert(res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        if (data.length == 0) {
            this.pagement.clearPage();
        }
        this.table.setData(data);
        var me = this;
        this.$('a[name="rec"]').click(function (el) {
            var ids = $(el.target).attr("elid");
            var text = $(el.target).text();
            var url = "https://www.kziche.com/admin/Order/delOrder";
            var param = {
                key: me.key,
                order_ids: ids,
                type: "1"
            };
            var sure = window.confirm("确定执行 " + text + " 操作?");
            if (sure) {
                me.batchAjax(url, param);
            }
        });
    },

    /**
    * 获取日期
    * @param  {string} type  [修改的类型month月份,day天数]
    * @param  {num} param [与当前日期回退的type数量]
    * @return {[type]}       [description]
    */
    getDate: function (type, param) {
        let date = new Date();
        if (type && type == "month") {
            date.setMonth(date.getMonth() - param);
        }
        if (type && type == "day") {
            date.setDate(date.getDate() - param);
        }
        let day = date.getDate();
        let month = date.getMonth() + 1;

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        let year = date.getFullYear();
        let result = year + "-" + month + "-" + day;
        return result;
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);
const compBatch = __webpack_require__(9);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function (loginKey) {
        this.$el.html(this.template({
            titles: ["回收站", "服务项目回收"],
            back: false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd: false,
            addLink: "",
            showSearch: true,
            linesNum: 1
        });
        this.batch = new compBatch();
        this.key = loginKey;

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this.batch, "goBatch", this.goBatch);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Member/serviceItems';
        this.tableParam = {
            key: this.key,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            keyword: '',
            shelves_state: '',
            category_id: '',
            logical_deletion: 2
        };
        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        this.$('#batch').append(this.batch.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ["服务项目", "项目编码", "所属门店", "审核状态", "是否上架"]; //表头
        var rows = ["items_name", "code", { name: 'store_name', isSkip: false, link: "views/formExample", code: "id" }, "examine_state_name", "shelves_state_name"]; //表列
        var opration = [{ name: '恢复', elID: 'id', elName: "hf" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("id");

        //搜索栏配置
        var searchComponents = [{
            type: 'text',
            line: 0,
            param: {
                title: "关键字",
                value: "",
                explain: "要查询的关键字",
                name: "keyword"
            }
        }, {
            type: 'select',
            line: 0,
            param: {
                title: "状态",
                options: [{
                    value: '1',
                    content: "上架"
                }, {
                    value: '2',
                    content: "下架"
                }],
                name: "state"
            }
        }, {
            type: 'select',
            line: 0,
            param: {
                title: "项目分类",
                options: [{
                    value: '1',
                    content: "分类1"
                }, {
                    value: '2',
                    content: "分类2"
                }],
                name: "kind"
            }
        }];

        this.search.setParam(searchComponents);
        this.fillSelectOption();
        /*
        批量操作组件配置
        */
        var batchOptions = [{ value: "1", content: "恢复" }];
        this.batch.setParam(batchOptions);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        this.pagement.clearPage();
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1,
                            total: res.count
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function (param) {
        var searchKind = this.search.getElByName('kind');
        var searchState = this.search.getElByName('state');
        var searchKeyword = this.search.getElByName('keyword');

        this.tableParam.keyword = searchKeyword.getValue();
        this.tableParam.shelves_state = searchState.getValue();
        this.tableParam.category_id = searchKind.getValue();
        this.tableParam.page = 1;
        this.queryData(this.url, this.tableParam, true);
    },

    goBatch: function (type) {
        var ids = [];
        var url = "";
        var param = null;

        this.$("#cont tbody input[type='checkbox']:checked").each(function (index, e) {
            ids.push($(e).attr("checkid"));
        });

        if (ids.length == 0) {
            alert("未选取任何记录");
            return;
        }

        var idsString = ids.join(",");

        if (type == "1") {
            url = "https://www.kziche.com/admin/Member/delItems";
            param = {
                key: this.key,
                items_ids: idsString,
                type: type
            };
        }
        this.batchAjax(url, param);
    },

    batchAjax: function (tempUrl, param) {
        var me = this;
        $.ajax({
            url: tempUrl,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    alert(res.msg);
                    this.tableParam.page = 1;
                    this.queryData(me.url, me.tableParam, true);
                } else {
                    alert(res.msg);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        if (data.length == 0) {
            this.pagement.clearPage();
        }
        this.table.setData(data);

        var me = this;
        this.$('a[name="hf"]').click(function (el) {
            var ids = $(el.target).attr("elid");
            var text = $(el.target).text();
            var url = "https://www.kziche.com/admin/Member/delItems";
            var param = {
                key: this.key,
                items_ids: ids,
                type: "1"
            };
            var sure = window.confirm("确定执行 " + text + " 操作?");
            if (sure) {
                me.batchAjax(url, param);
            }
        });
    },

    fillSelectOption: function () {
        var me = this;
        var searchKind = me.search.getElByName("kind");
        $.ajax({
            url: "https://www.kziche.com/admin/Member/showServiceCate",
            type: 'get',
            dataType: 'json',
            data: {
                key: me.key
            },
            success: function (res) {
                if (res.code == 200) {
                    searchKind.setOptions(res.data);
                } else {
                    var temp = [];
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(33);
const compEchart = __webpack_require__(19);
const compSearch = __webpack_require__(3);
const barOption = __webpack_require__(18);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "panel panel-default",

    template: _.template(htmlTpl),

    initialize: function (loginKey) {
        this.$el.html(this.template());

        this.ecCount = new compEchart();
        this.ecAmount = new compEchart();
        this.search = new compSearch({
            showAdd: false,
            addLink: "",
            showSearch: true,
            linesNum: 1
        });
        this.key = loginKey; //登陆秘钥

        this.ecList = []; //元素是该页面的所有图表，方便对所有图表进行批量操作

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this, "renderFinish", this.renderEchart);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.ecCount.render().el);
        this.$('#cont').append(this.ecAmount.render().el);
        return this;
    },

    renderEchart: function () {
        this.ecCount.trigger("renderFinish");
        this.ecAmount.trigger("renderFinish");
        this.startListenWindowSize("cont");
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        // 搜索栏配置
        var searchComponents = [{
            type: 'daterange',
            line: 0,
            param: {
                title: "时间范围",
                name: "daterange",
                startDate: this.getDate('month', 1),
                endDate: this.getDate()
            }
        }, {
            type: 'select',
            line: 0,
            param: {
                title: "门店名称",
                options: [],
                name: "shop",
                defaultTitle: '所有门店'
            }
        }, {
            type: 'select',
            line: 0,
            param: {
                title: "数据来源",
                defaultTitle: '所有来源',
                options: [{
                    value: 1,
                    content: "线上"
                }, {
                    value: 2,
                    content: "线下"
                }],
                name: "source"
            }
        }];
        this.search.setParam(searchComponents);
        this.fillSelectOption();

        /**
         * 配置参数说明
         * id : 图表对应的父容器dom的ID,多个图表ID不可重复
         * url : 图表对应数据接口url
         * dataParam : 接口条件参数
         * title : 图表标题
         * legend : 图例名称
         * xaxis  : X轴对应的数据参数名
         * ecSeries : name:对应的图例名称,Y轴对应的数据参数名
         */
        this.ecCount.setEchartOption(barOption);
        this.ecCount.setParam({
            id: "orderCount",
            url: 'https://www.kziche.com/admin/Report/Astatistical',
            dataParam: {
                key: this.key,
                startTime: this.getDate('month', 1),
                endTime: this.getDate(),
                storeId: "",
                source: ""
            },
            title: "门店充值/开卡次数(个)",
            legend: ["充值次数", "开卡次数"],
            xaxis: "date",
            ecSeries: [{
                name: "充值次数",
                dataName: "rechargeCount"
            }, {
                name: "开卡次数",
                dataName: "cardCount"
            }]
        });

        this.ecAmount.setEchartOption(barOption);
        this.ecAmount.setParam({
            id: "orderAmount",
            url: 'https://www.kziche.com/admin/Report/Astatistical',
            dataParam: {
                key: this.key,
                startTime: this.getDate('month', 1),
                endTime: this.getDate(),
                storeId: "",
                source: ""
            },
            title: "门店充值/开卡/赠送金额(元)",
            legend: ["充值金额", "开卡金额", "赠送金额"],
            xaxis: "date",
            ecSeries: [{
                name: "充值金额",
                dataName: "rechargeAmount"
            }, {
                name: "开卡金额",
                dataName: "cardAmount"
            }, {
                name: "赠送金额",
                dataName: "giftAmount"
            }]
        });

        this.ecList.push(this.ecCount);
        this.ecList.push(this.ecAmount);
    },

    goSearch: function () {
        var dateRange = this.search.getElByName('daterange');
        var searchShop = this.search.getElByName('shop');
        var searchSource = this.search.getElByName('source');
        var dataParam = {
            key: this.key,
            startTime: "",
            endTime: "",
            storeId: "",
            source: ""
        };

        var start = dateRange.getStartDate();
        var end = dateRange.getEndDate();
        var shopid = searchShop.getValue();
        var source = searchSource.getValue();
        dataParam.startTime = start;
        dataParam.endTime = end;
        dataParam.storeId = shopid;
        dataParam.source = source;
        this.ecCount.freshEchart(dataParam);
        this.ecAmount.freshEchart(dataParam);
    },
    // 监听窗口大小变化
    startListenWindowSize: function (id) {
        var me = this;
        var firstDom = document.getElementById(id);
        this.currentWidth = firstDom.clientWidth;

        window.onresize = function () {
            var dom = document.getElementById(id);
            var changeWidth = dom.clientWidth - 100;
            var changeSize = changeWidth - me.currentWidth;
            if (Math.abs(changeSize) > 40) {
                _.each(me.ecList, function (ec, index) {
                    ec.resizeEchart(changeWidth);
                });
                me.currentWidth = dom.clientWidth - 100;
            }
        };
    },

    removeEl: function () {
        var me = this;
        _.each(me.ecList, function (el, index) {
            el.dispose();
        });
        this.remove();
    },

    freshTable: function (data) {},

    fillSelectOption: function () {
        var me = this;
        var searchShop = me.search.getElByName("shop");
        $.ajax({
            url: "https://www.kziche.com/admin/Report/storeList",
            type: 'get',
            dataType: 'json',
            data: {
                key: me.key
            },
            success: function (res) {
                if (res.code == 200) {
                    searchShop.setOptions(res.data);
                } else {
                    var temp = [];
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },
    /**
     * 获取日期
     * @param  {string} type  [修改的类型month月份,day天数]
     * @param  {num} param [与当前日期回退的type数量]
     * @return {[type]}       [description]
     */
    getDate: function (type, param) {
        let date = new Date();
        if (type && type == "month") {
            date.setMonth(date.getMonth() - param);
        }
        if (type && type == "day") {
            date.setDate(date.getDate() - param);
        }
        let day = date.getDate();
        let month = date.getMonth() + 1;

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        let year = date.getFullYear();
        let result = year + "-" + month + "-" + day;
        return result;
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _) {const htmlTpl = __webpack_require__(33);
const compEchart = __webpack_require__(19);
const compSearch = __webpack_require__(3);
const barOption = __webpack_require__(18);
const barMemOption = __webpack_require__(37);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "panel panel-default",

    template: _.template(htmlTpl),

    initialize: function (loginKey) {
        this.$el.html(this.template({}));

        this.ecMember = new compEchart();
        this.ecActive = new compEchart();
        this.search = new compSearch({
            showAdd: false,
            addLink: "",
            showSearch: true,
            linesNum: 1
        });
        this.key = loginKey; //登陆秘钥

        this.ecList = []; //元素是该页面的所有图表，方便对所有图表进行批量操作

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this, "renderFinish", this.renderEchart);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.ecMember.render().el);
        this.$('#cont').append(this.ecActive.render().el);
        return this;
    },

    renderEchart: function () {
        this.ecMember.trigger("renderFinish");
        this.ecActive.trigger("renderFinish");
        this.startListenWindowSize("cont");
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        // 搜索栏配置
        var searchComponents = [{
            type: 'daterange',
            line: 0,
            param: {
                title: "时间范围",
                name: "daterange",
                startDate: this.getDate('month', 1),
                endDate: this.getDate()
            }
        }];
        this.search.setParam(searchComponents);
        /**
         * 配置参数说明
         * id : 图表对应的父容器dom的ID,多个图表ID不可重复
         * url : 图表对应数据接口url
         * dataParam : 接口条件参数
         * title : 图表标题
         * legend : 图例名称
         * xaxis  : X轴对应的数据参数名
         * ecSeries : name:对应的图例名称,Y轴对应的数据参数名
         */
        this.ecMember.setEchartOption(barOption);
        this.ecMember.setParam({
            id: "member",
            url: 'https://www.kziche.com/admin/Report/membershipStatistics',
            dataParam: {
                key: this.key,
                startTime: this.getDate('month', 1),
                endTime: this.getDate()
            },
            title: "新增会员",
            legend: ["线上", "线下"],
            xaxis: "date",
            ecSeries: [{
                name: "线上",
                dataName: "wechatCount"
            }, {
                name: "线下",
                dataName: "lineCount"
            }]
        });

        this.ecActive.setEchartOption(barMemOption);
        this.ecActive.setParam({
            id: "activeMem",
            url: 'https://www.kziche.com/admin/Report/membershipStatistics',
            dataParam: {
                key: this.key,
                startTime: this.getDate('month', 1),
                endTime: this.getDate()
            },
            title: "用户活跃",
            legend: ["新用户", "活跃用户", "稳定用户", "睡眠用户"],
            xaxis: "date",
            ecSeries: [{
                name: "新用户",
                dataName: "tatalCount"
            }, {
                name: "活跃用户",
                dataName: "activeCount"
            }, {
                name: "稳定用户",
                dataName: "stableCount"
            }, {
                name: "睡眠用户",
                dataName: "sleepCount"
            }]
        });

        this.ecList.push(this.ecMember);
        this.ecList.push(this.ecActive);
    },

    goSearch: function () {
        var dateRange = this.search.getElByName('daterange');
        var dataParam = {
            key: this.key,
            startTime: "",
            endTime: ""
        };

        var start = dateRange.getStartDate();
        var end = dateRange.getEndDate();

        dataParam.startTime = start;
        dataParam.endTime = end;
        this.ecMember.freshEchart(dataParam);
        this.ecActive.freshEchart(dataParam);
    },
    // 监听窗口大小变化
    startListenWindowSize: function (id) {
        var me = this;
        var firstDom = document.getElementById(id);
        this.currentWidth = firstDom.clientWidth;

        window.onresize = function () {
            var dom = document.getElementById(id);
            var changeWidth = dom.clientWidth - 100;
            var changeSize = changeWidth - me.currentWidth;
            if (Math.abs(changeSize) > 40) {
                _.each(me.ecList, function (ec, index) {
                    ec.resizeEchart(changeWidth);
                });
                me.currentWidth = dom.clientWidth - 100;
            }
        };
    },

    removeEl: function () {
        var me = this;
        _.each(me.ecList, function (el, index) {
            el.dispose();
        });
        this.remove();
    },

    freshTable: function (data) {},

    /**
     * 获取日期
     * @param  {string} type  [修改的类型month月份,day天数]
     * @param  {num} param [与当前日期回退的type数量]
     * @return {[type]}       [description]
     */
    getDate: function (type, param) {
        let date = new Date();
        if (type && type == "month") {
            date.setMonth(date.getMonth() - param);
        }
        if (type && type == "day") {
            date.setDate(date.getDate() - param);
        }
        let day = date.getDate();
        let month = date.getMonth() + 1;

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        let year = date.getFullYear();
        let result = year + "-" + month + "-" + day;
        return result;
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1)))

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(33);
const compEchart = __webpack_require__(19);
const compSearch = __webpack_require__(3);
const barOption = __webpack_require__(18);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "panel panel-default",

    template: _.template(htmlTpl),

    initialize: function (loginKey) {
        this.$el.html(this.template({}));

        this.ecCount = new compEchart();
        this.ecAmount = new compEchart();
        this.search = new compSearch({
            showAdd: false,
            addLink: "",
            showSearch: true,
            linesNum: 1
        });
        this.key = loginKey; //登陆秘钥

        this.ecList = []; //元素是该页面的所有图表，方便对所有图表进行批量操作

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this, "renderFinish", this.renderEchart);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.ecCount.render().el);
        this.$('#cont').append(this.ecAmount.render().el);
        return this;
    },

    renderEchart: function () {
        this.ecCount.trigger("renderFinish");
        this.ecAmount.trigger("renderFinish");
        this.startListenWindowSize("cont");
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        // 搜索栏配置
        var searchComponents = [{
            type: 'daterange',
            line: 0,
            param: {
                title: "时间范围",
                name: "daterange",
                startDate: this.getDate('month', 1),
                endDate: this.getDate()
            }
        }, {
            type: 'select',
            line: 0,
            param: {
                defaultTitle: '所有门店',
                title: "门店名称",
                options: [],
                name: "shop"
            }
        }];
        this.search.setParam(searchComponents);
        this.fillSelectOption();

        /**
         * 配置参数说明
         * id : 图表对应的父容器dom的ID,多个图表ID不可重复
         * url : 图表对应数据接口url
         * dataParam : 接口条件参数
         * title : 图表标题
         * legend : 图例名称
         * xaxis  : X轴对应的数据参数名
         * ecSeries : name:对应的图例名称,Y轴对应的数据参数名
         */
        this.ecCount.setEchartOption(barOption);
        this.ecCount.setParam({
            id: "orderCount",
            url: 'https://www.kziche.com/admin/Report/reconciliation',
            dataParam: {
                key: this.key,
                startTime: this.getDate('month', 1),
                endTime: this.getDate(),
                storeId: ""
            },
            title: "门店订单数量(个 )",
            legend: ["订单数"],
            xaxis: "date",
            ecSeries: [{
                name: "订单数",
                dataName: "count"
            }]
        });

        this.ecAmount.setEchartOption(barOption);
        this.ecAmount.setParam({
            id: "orderAmount",
            url: 'https://www.kziche.com/admin/Report/reconciliation',
            dataParam: {
                key: this.key,
                startTime: this.getDate('month', 1),
                endTime: this.getDate(),
                storeId: ""
            },
            title: "门店订单金额(元)",
            legend: ["订单金额"],
            xaxis: "date",
            ecSeries: [{
                name: "订单金额",
                dataName: "amout"
            }]
        });

        this.ecList.push(this.ecCount);
        this.ecList.push(this.ecAmount);
    },

    goSearch: function () {
        var dateRange = this.search.getElByName('daterange');
        var searchShop = this.search.getElByName('shop');
        var dataParam = {
            key: this.key,
            startTime: "",
            endTime: "",
            storeId: ""
        };

        var start = dateRange.getStartDate();
        var end = dateRange.getEndDate();
        var shopid = searchShop.getValue();
        dataParam.startTime = start;
        dataParam.endTime = end;
        dataParam.storeId = shopid;
        this.ecCount.freshEchart(dataParam);
        this.ecAmount.freshEchart(dataParam);
    },
    // 监听窗口大小变化
    startListenWindowSize: function (id) {
        var me = this;
        var firstDom = document.getElementById(id);
        this.currentWidth = firstDom.clientWidth;

        window.onresize = function () {
            var dom = document.getElementById(id);
            var changeWidth = dom.clientWidth - 100;
            var changeSize = changeWidth - me.currentWidth;
            if (Math.abs(changeSize) > 40) {
                _.each(me.ecList, function (ec, index) {
                    ec.resizeEchart(changeWidth);
                });
                me.currentWidth = dom.clientWidth - 100;
            }
        };
    },

    removeEl: function () {
        var me = this;
        _.each(me.ecList, function (el, index) {
            el.dispose();
        });
        this.remove();
    },

    freshTable: function (data) {},

    fillSelectOption: function () {
        var me = this;
        var searchShop = me.search.getElByName("shop");
        $.ajax({
            url: "https://www.kziche.com/admin/Report/storeList",
            type: 'get',
            dataType: 'json',
            data: {
                key: me.key
            },
            success: function (res) {
                if (res.code == 200) {
                    searchShop.setOptions(res.data);
                } else {
                    var temp = [];
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },
    /**
     * 获取日期
     * @param  {string} type  [修改的类型month月份,day天数]
     * @param  {num} param [与当前日期回退的type数量]
     * @return {[type]}       [description]
     */
    getDate: function (type, param) {
        let date = new Date();
        if (type && type == "month") {
            date.setMonth(date.getMonth() - param);
        }
        if (type && type == "day") {
            date.setDate(date.getDate() - param);
        }
        let day = date.getDate();
        let month = date.getMonth() + 1;

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        let year = date.getFullYear();
        let result = year + "-" + month + "-" + day;
        return result;
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compSearch = __webpack_require__(3);
const compPage = __webpack_require__(5);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click a[name='link']": "onClickLink"
    },

    initialize: function (loginKey, code, upUrl) {
        this.$el.html(this.template({
            titles: ["统计报表", "对账表单"],
            back: false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd: true,
            addLink: "",
            addTitle: "下载Excel",
            showSearch: true,
            linesNum: 1
        });
        this.key = loginKey;
        this.count = 0; //当前查询条件下的记录总数

        this.listenTo(this.search, "goSearch", this.goSearch);
        this.listenTo(this.pagement, "pageChange", this.pageChange); //监听页数变化事件
        this.listenTo(this, "dataReady", this.freshTable);

        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Report/orderStatistics';
        this.tableParam = {
            key: this.key,
            storeId: '',
            startTime: this.getDate('month', 1),
            endTime: this.getDate(),
            isExcel: 1,
            pagesize: 15,
            page: 1
        };

        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ["时间", "订单号", "车牌号", "项目", "微信收款", "余额收款", "次卡收款", "线下收款", "合计", "总产值和收款差异", "备注"]; //表头
        var rows = ["date", "order_sn", "license_plate", "items", "wechat_amount", "balance_amount", "card_amount", "line_amount", "actual_money", "a", "b"]; //表列
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setHasOpration(false);
        this.table.setHasCheckBox(false);

        //搜索栏配置
        var searchComponents = [{
            type: 'daterange',
            line: 0,
            param: {
                title: "时间范围",
                startDate: this.getDate('month', 1),
                endDate: this.getDate(),
                name: "daterange"
            }
        }, {
            type: 'select',
            line: 0,
            param: {
                defaultTitle: '所有门店',
                title: "门店名称",
                options: [],
                name: "shop"
            }
        }];
        this.search.setParam(searchComponents);
        this.fillSelectOption();
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.count = res.count;
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        this.pagement.clearPage();
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1,
                            total: res.count
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.count = 0;
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function (param) {
        var dateRange = this.search.getElByName('daterange');
        var searchShop = this.search.getElByName('shop'); //接口没有涉及
        this.tableParam.isExcel = 1;
        this.tableParam.storeId = searchShop.getValue();
        this.tableParam.startTime = dateRange.getStartDate();
        this.tableParam.endTime = dateRange.getEndDate();
        this.tableParam.page = 1;
        this.queryData(this.url, this.tableParam, true);
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        this.dataLength = data.length;
        if (data.length == 0) {
            this.pagement.clearPage();
        }
        this.table.setData(data);
    },

    fillSelectOption: function () {
        var me = this;
        var searchShop = me.search.getElByName("shop");
        $.ajax({
            url: "https://www.kziche.com/admin/Report/storeList",
            type: 'get',
            dataType: 'json',
            data: {
                key: me.key
            },
            success: function (res) {
                if (res.code == 200) {
                    searchShop.setOptions(res.data);
                } else {
                    var temp = [];
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    onClickLink: function (e) {
        if (this.dataLength == 0) {
            return;
        }
        var start = this.tableParam.startTime;
        var end = this.tableParam.endTime;
        var storeId = this.tableParam.storeId;
        var count = this.count;
        var key = this.key;
        var downloadUrl = "https://www.kziche.com/admin/Report/orderStatistics?key=" + key + "&storeId=" + storeId + "&startTime=" + start + "&endTime=" + end + "&isExcel=2&page=1&pagesize=" + count;
        window.location.href = downloadUrl;
    },

    /**
    * 获取日期
    * @param  {string} type  [修改的类型month月份,day天数]
    * @param  {num} param [与当前日期回退的type数量]
    * @return {[type]}       [description]
    */
    getDate: function (type, param) {
        let date = new Date();
        if (type && type == "month") {
            date.setMonth(date.getMonth() - param);
        }
        if (type && type == "day") {
            date.setDate(date.getDate() - param);
        }
        let day = date.getDate();
        let month = date.getMonth() + 1;

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }
        let year = date.getFullYear();
        let result = year + "-" + month + "-" + day;
        return result;
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(11);
const compFile = __webpack_require__(13);
const compSelect = __webpack_require__(8);
const compText = __webpack_require__(7);
const compUeditor = __webpack_require__(15);
const compMap = __webpack_require__(40);
const compArea = __webpack_require__(38);
const compDate = __webpack_require__(14);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #confirm": "onClickConfirm",
        "click #clear": "onClickClear",
        "click #back": "onClickBack"
    },

    initialize: function (code, upUrl, loginKey) {
        this.code = code || 0;
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["门店管理", "店铺详情"],
            back: upUrl
        }));

        this.textShopName = new compText();
        this.textPhone = new compText();
        this.textShopIntro = new compText();
        this.textShopAddr = new compText();
        this.selectShopType = new compSelect();
        this.selectShopRight = new compSelect();
        this.fileShopPic = new compFile();
        this.fileHeadPic = new compFile();
        this.selectArea = new compSelect();
        this.ueditorIntro = new compUeditor();
        this.mapShop = new compMap();
        this.area = new compArea(this.key);
        this.dateStart = new compDate();
        this.dateEnd = new compDate();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this, "renderFinish", this.renderPlugin);
        this.listenTo(this, 'confirmFinish', this.confirmFinish);
        this.listenTo(this, 'confirmFail', this.confirmFail);

        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Order/storeDetail';
        this.param = {
            key: this.key,
            store_id: this.code
        };

        if (typeof code !== "undefined" && code != null) {
            this.queryData(this.url, this.param);
        }
    },

    render: function () {
        this.$('#main').append(this.textShopName.render().el);
        this.$('#main').append(this.textShopIntro.render().el);
        this.$('#main').append(this.textPhone.render().el);
        this.$('#main').append(this.selectShopType.render().el);
        this.$('#main').append(this.selectShopRight.render().el);
        this.$('#main').append(this.area.render().el);
        this.$('#main').append(this.dateStart.render().el);
        this.$('#main').append(this.dateEnd.render().el);

        this.$('#main').append(this.fileShopPic.render().el);
        this.$('#main').append(this.fileHeadPic.render().el);

        this.$('#main').append(this.textShopAddr.render().el);
        this.$('#main').append(this.mapShop.render().el);

        this.$('#main').append(this.ueditorIntro.render().el);

        return this;
    },

    renderPlugin: function () {
        this.ueditorIntro.trigger("renderFinish");
        this.mapShop.trigger("renderFinish");
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        this.textShopName.setParam({
            title: "门店名"
        });
        this.textShopIntro.setParam({
            title: "门店简介"
        });
        this.textPhone.setParam({
            title: "联系电话",
            err: "电话号码格式错误!",
            pattern: /^1\d{10}$/
        });
        this.selectShopType.setParam({
            title: "门店类型",
            options: [{
                value: 1,
                content: "快洗"
            }]
        });
        this.selectShopRight.setParam({
            title: "门店权限",
            options: [{
                value: 1,
                content: "直营"
            }]
        });
        this.fileShopPic.setParam({
            title: "门店略缩图"
        });
        this.fileHeadPic.setParam({
            title: "门店头图"
        });
        this.ueditorIntro.setParam({
            title: "门店介绍",
            msg: "这里是门店对外页面的编辑器"
        });
        this.mapShop.setParam({
            title: "门店地理位置",
            msg: "点击地图标注门店的位置"
        });
        this.area.setParam({
            title: "所属城市"
        });
        this.textShopAddr.setParam({
            title: "门店详细地址",
            msg: "门店的具体地址"
        });
        this.dateStart.setParam({
            title: "每日营业开始时间",
            showTime: "show",
            showDate: "hide"
        });
        this.dateEnd.setParam({
            title: "每日营业结束时间",
            showTime: "show",
            showDate: "hide"
        });
    },

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function (url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillPage: function (data) {
        this.textShopName.setValue(data.store_name);
        this.textPhone.setValue(data.phone);
        this.selectShopType.setValue(data.category_id);
        this.selectShopRight.setValue(data.authority_id);
        this.mapShop.setPosition(data.longitude, data.latitude);
        this.area.setValue(data.province_id, data.city_id);
        this.fileShopPic.setFile(data.thumbnail);
        this.fileHeadPic.setFile(data.head_figure);
        this.textShopIntro.setValue(data.brief_introduction);
        this.ueditorIntro.setValue(data.introduce);
        this.textShopAddr.setValue(data.address);
        this.dateStart.setValue(data.start_time);
        this.dateEnd.setValue(data.end_time);
    },

    confirmFinish: function () {
        alert("提交成功");
        window.history.back();
    },

    confirmFail: function (msg) {
        alert(msg);
    },

    onClickClear: function () {},

    onClickConfirm: function () {

        var name = this.textShopName.getValue();
        var phone = this.textPhone.getValue();
        var shopType = this.selectShopType.getValue();
        var shopRight = this.selectShopRight.getValue();
        var shopPic = this.fileShopPic.getFiles();
        var ossShop = this.fileShopPic.isChange();

        var headPic = this.fileHeadPic.getFiles();
        var ossHead = this.fileHeadPic.isChange();
        var area = this.area.getValue();
        var introduce = this.ueditorIntro.getValue();
        var positionObj = this.mapShop.getPosition();
        var lng = positionObj.lng || "112.9252020";
        var lat = positionObj.lat || "28.1980240";
        var brief = this.textShopIntro.getValue();
        var addr = this.textShopAddr.getValue();
        var starttime = this.dateStart.getValue();
        var endtime = this.dateEnd.getValue();

        var form = new FormData();
        form.append('id', this.code);
        form.append('key', this.key);
        form.append('name', name);
        form.append('phone', phone);
        form.append('thumbnail', shopPic[0]);
        form.append('oss_photo_notnull', ossShop);

        form.append('head_figure', headPic[0]);
        form.append('oss_photo_notnull1', ossHead);

        form.append('category_id', shopType);
        form.append('authority', shopRight);
        form.append('introduce', introduce);
        form.append('brief_introduction', brief);
        form.append('longitude', lng);
        form.append('latitude', lat);
        form.append('province_id', area.province);
        form.append('city_id', area.city);
        form.append('address', addr);
        form.append('start_time', starttime);
        form.append('end_time', endtime);

        $.ajax({
            url: 'https://www.kziche.com/admin/Order/addStore',
            type: 'post',
            data: form,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('confirmFinish');
                } else {
                    alert(res.msg);
                    this.trigger('confirmFail', res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        // this.ueditorIntro.destroyUeditor();
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);
const compBatch = __webpack_require__(9);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function (loginKey) {
        this.$el.html(this.template({
            titles: ["门店管理", "门店列表"],
            back: false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd: true,
            addLink: "#views/shop/form/shopEdit",
            showSearch: true,
            linesNum: 1
        });
        this.batch = new compBatch();
        this.key = loginKey;

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this.batch, "goBatch", this.goBatch);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Order/storeList';
        this.tableParam = {
            key: this.key,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            store_name: "",
            province_id: "",
            city_id: "",
            cate: ""
        };
        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        this.$('#batch').append(this.batch.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ["门店名", "所属城市", "门店权限", "门店类型", "店长", "开通日期", "状态"]; //表头
        var rows = ["store_name", "city_name", "authority", "cate_name", "staff_name", "create_time", "state_name"]; //表列
        var opration = [{ name: '编辑', elID: 'store_id', elName: "sh", link: "views/shop/form/shopEdit" }, { name: '订单', elID: 'store_id', elName: "bj", link: "views/order/orderList" }, { name: '冻结', elID: 'store_id', elName: "sh" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("store_id");

        //搜索栏配置
        var searchComponents = [{
            type: 'select',
            line: 0,
            param: {
                title: "门店类型",
                options: [{
                    value: '1',
                    content: "快洗"
                }, {
                    value: '2',
                    content: "快修"
                }],
                name: "type"
            }
        }, {
            type: 'text',
            line: 0,
            param: {
                title: "门店名称",
                value: "",
                explain: "要查询的门店名",
                name: "name"
            }
        }, {
            type: 'select',
            line: 0,
            param: {
                title: "所在城市",
                options: [{
                    value: '1',
                    content: "新余"
                }],
                name: "city"
            }
        }];
        this.search.setParam(searchComponents);
        var batchOptions = [{ value: "1", content: "删除" }];
        this.batch.setParam(batchOptions);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        this.pagement.clearPage();
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1,
                            total: res.count
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function (param) {
        var searchType = this.search.getElByName('type');
        var searchCity = this.search.getElByName('city');
        var searchName = this.search.getElByName('name');

        this.tableParam.cate = searchType.getValue();
        // this.tableParam.city_id   = searchCity.getValue();
        this.tableParam.store_name = searchName.getValue();
        this.tableParam.page = 1;
        this.queryData(this.url, this.tableParam, true);
    },

    goBatch: function (type) {
        var ids = [];
        var url = "";
        var param = null;

        this.$("#cont tbody input[type='checkbox']:checked").each(function (index, e) {
            ids.push($(e).attr("checkid"));
        });

        if (ids.length == 0) {
            alert("未选取任何记录");
            return;
        }

        var idsString = ids.join(",");

        if (type == "1") {
            url = "https://www.kziche.com/admin/Order/delStore";
            param = {
                key: this.key,
                store_ids: idsString
            };
        }
        this.batchAjax(url, param);
    },

    batchAjax: function (tempUrl, param) {
        var me = this;
        $.ajax({
            url: tempUrl,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    alert(res.msg);
                    this.tableParam.page = 1;
                    this.queryData(me.url, me.tableParam, true);
                } else {
                    alert(res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        if (data.length == 0) {
            this.pagement.clearPage();
        }
        this.table.setData(data);
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(11);
const compCheckbox = __webpack_require__(12);
const compDate = __webpack_require__(14);
const compSelect = __webpack_require__(8);
const compText = __webpack_require__(7);
const compFile = __webpack_require__(13);
const compShop = __webpack_require__(42);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    events: {
        "click #confirm": "onClickConfirm",
        "click #clear": "onClickClear",
        "click #back": "onClickBack"
    },

    initialize: function (code, upUrl, loginKey) {
        this.code = code || 0;
        this.key = loginKey;
        this.$el.html(this.template({
            titles: ["员工管理", "员工详情"],
            back: upUrl
        }));

        this.textUserName = new compText();
        this.textRealName = new compText();
        this.textPassword = new compText();
        this.textConfirmPassword = new compText();
        this.textPhone = new compText();

        this.checkboxSex = new compCheckbox();
        this.selectRole = new compSelect();
        this.dateBirthday = new compDate();
        this.selectShop = new compShop(this.key);

        this.filePhoto = new compFile();

        this.initParamOfPage();

        this.listenTo(this, 'dataReady', this.fillPage);
        this.listenTo(this, 'confirmFinish', this.confirmFinish); //表单提交成功后的回调函数

        this.url = 'https://www.kziche.com/admin/Order/staffDetail';
        this.param = {
            key: this.key,
            staff_id: this.code
            //如果传入参数则为编辑页面，没有则为添加页面
        };if (typeof code !== "undefined" && code != null) {
            this.queryData(this.url, this.param);
        }
    },

    render: function () {
        this.$('#main').append(this.textUserName.render().el);
        this.$('#main').append(this.textRealName.render().el);
        this.$('#main').append(this.textPassword.render().el);
        this.$('#main').append(this.textConfirmPassword.render().el);
        this.$('#main').append(this.selectRole.render().el);
        this.$('#main').append(this.checkboxSex.render().el);
        this.$('#main').append(this.dateBirthday.render().el);
        this.$('#main').append(this.selectShop.render().el);
        this.$('#main').append(this.filePhoto.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        this.textUserName.setParam({
            title: "员工账户",
            msg: "员工用户名统一为手机号码",
            readonly: this.code == 0 ? false : true
        });
        this.textPassword.setParam({
            title: "密码",
            msg: "密码长度为6-12位"
            // err : "密码格式不符",
            // pattern : /^\w{6,12}$/
        });
        this.textConfirmPassword.setParam({
            title: "确认密码"

        });
        this.textRealName.setParam({
            title: '姓名',
            msg: "员工真实姓名"
        });
        this.dateBirthday.setParam({
            title: '员工生日'
        });
        this.selectRole.setParam({
            title: "员工角色",
            options: [{
                value: 2,
                content: "员工"
            }, {
                value: 1,
                content: "店长"
            }]
        });
        this.checkboxSex.setParam({
            title: '性别',
            options: [{
                value: 0,
                content: "保密"
            }, {
                value: 1,
                content: "男"
            }, {
                value: 2,
                content: "女"
            }]
        });
        this.filePhoto.setParam({
            title: "员工照片"
        });
        this.selectShop.setParam({
            title: "所属店铺"
        });
    },

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function (url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillPage: function (data) {
        //这里再进行数据的装配
        this.textUserName.setValue(data.phone);
        this.textRealName.setValue(data.staff_name);
        // this.textPassword = new compText();
        // this.textConfirmPassword = new compText();
        // this.textPhone = new compText();

        this.checkboxSex.setValue(data.sex);

        this.selectRole.setValue(data.role_id);
        this.dateBirthday.setValue(data.birth);
        this.selectShop.setValue(data.province_id, data.city_id, data.store_id);
        this.filePhoto.setFile(data.pic);
    },

    onClickBack: function () {},

    onClickClear: function () {},

    onClickConfirm: function () {
        if (!this.checkFormContent()) {
            alert("表单内容填写格式有误");
            return;
        }

        var form = new FormData();
        var name = this.textRealName.getValue();
        var password = this.textPassword.getValue();
        var confirmPassword = this.textConfirmPassword.getValue();
        var role = this.selectRole.getValue();
        var sex = this.checkboxSex.getValue();
        var birthday = this.dateBirthday.getValue();
        var store_id = this.selectShop.getValue();
        var file = this.filePhoto.getFiles();
        var ossPhoto = this.filePhoto.isChange();
        var phone = this.textUserName.getValue();

        form.append('id', this.code);
        form.append('password', password);
        form.append('repassword', confirmPassword);
        form.append('role_id', role);
        form.append('store_id', store_id.shop);
        form.append('name', name);
        form.append('sex', sex);
        form.append('phone', phone);
        form.append('cardid', ""); //身份证号码
        form.append('pic', file[0]);
        form.append('oss_photo_notnull', ossPhoto);
        form.append('birth', birthday);

        $.ajax({
            url: 'https://www.kziche.com/admin/Order/addStaff',
            type: 'post',
            data: form,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('confirmFinish');
                } else {
                    alert(res.msg);
                    this.trigger('confirmFail', res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    confirmFinish: function () {
        alert("提交成功");
        window.history.back();
    },

    checkFormContent: function () {
        var passBol = this.textPassword.checkValue();
        var passSame = this.textConfirmPassword.getValue() == this.textPassword.getValue();
        return passBol && passSame;
    },

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);
const compBatch = __webpack_require__(9);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function (loginKey) {
        this.$el.html(this.template({
            titles: ["员工管理", "员工列表"],
            back: false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch({
            showAdd: true,
            addLink: "#views/staff/form/staffEdit",
            showSearch: true,
            linesNum: 1
        });
        this.batch = new compBatch();
        this.key = loginKey;

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.listenTo(this.batch, "goBatch", this.goBatch);

        this.initParamOfPage();

        this.url = 'https://www.kziche.com/admin/Order/staffList';
        this.tableParam = {
            key: this.key,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            role_id: ""
        };
        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        this.$('#batch').append(this.batch.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ["姓名", "员工角色", "联系方式", "所属门店", "注册日期", "状态", "实名认证"]; //表头
        var rows = ["staff_name", "role_name", "phone", "store_name", "create_time", "state_name", "is_validate"]; //表列
        var opration = [{ name: '编辑', elID: 'staff_id', elName: "edt", link: "views/staff/form/staffEdit" }, { name: '订单', elID: 'staff_id', elName: "ord", link: "views/order/orderList" },
        // { name: '冻结', elID: 'staff_id', elName: "dj" }, 
        // { name: '删除', elID: 'staff_id', elName: "del" }, 
        { name: '短信', elID: 'staff_id', elName: "msg" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(true);
        this.table.setHasCheckBox(true);
        this.table.setCheckId("staff_id");

        //搜索栏配置
        var searchComponents = [{
            type: 'select',
            line: 0,
            param: {
                title: "员工角色",
                options: [{ value: '2', content: "员工" }, { value: '1', content: "店长" }],
                name: "role"
            }
        }, {
            type: 'text',
            line: 0,
            param: {
                title: "搜索条件",
                value: "",
                explain: "要查询的手机号码、姓名、门店名",
                name: "text"
            }
        }];
        this.search.setParam(searchComponents);

        var batchOptions = [{ value: "1", content: "恢复" }, { value: "2", content: "冻结" }, { value: "3", content: "删除" }];
        this.batch.setParam(batchOptions);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        this.pagement.clearPage();
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1,
                            total: res.count
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function (param) {
        var searchRole = this.search.getElByName('role');
        var searchText = this.search.getElByName('text');

        this.tableParam.searchCriteria = searchText.getValue();
        this.tableParam.role_id = searchRole.getValue();
        this.tableParam.page = 1;
        this.queryData(this.url, this.tableParam, true);
    },

    goBatch: function (type) {
        var ids = [];
        var url = "";
        var param = null;

        this.$("#cont tbody input[type='checkbox']:checked").each(function (index, e) {
            ids.push($(e).attr("checkid"));
        });

        if (ids.length == 0) {
            alert("未选取任何记录");
            return;
        }

        var idsString = ids.join(",");

        if (type == "1") {
            url = "https://www.kziche.com/admin/Order/employeeFreezing";
            param = {
                key: this.key,
                staff_ids: idsString,
                type: type
            };
        }
        if (type == "2") {
            url = "https://www.kziche.com/admin/Order/employeeFreezing";
            param = {
                key: this.key,
                staff_ids: idsString,
                type: type
            };
        }
        if (type == "3") {
            url = "https://www.kziche.com/admin/Order/delStaff";
            param = {
                key: this.key,
                staff_ids: idsString
            };
        }
        this.batchAjax(url, param);
    },

    batchAjax: function (tempUrl, param) {
        var me = this;
        $.ajax({
            url: tempUrl,
            type: 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    alert(res.msg);
                    this.tableParam.page = 1;
                    this.queryData(me.url, me.tableParam, true);
                } else {
                    alert(res.msg);
                }
            }.bind(this),
            error: function () {
                alert('页面出错');
            }.bind(this)
        });
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        if (data.length == 0) {
            this.pagement.clearPage();
        }
        this.table.setData(data);
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(11);
const compCheckbox = __webpack_require__(12);
const compDate = __webpack_require__(14);
const compFile = __webpack_require__(20);
const compSelect = __webpack_require__(8);
const compText = __webpack_require__(7);

// require("/ueditor/ueditor.config.js");
// require("/ueditor/ueditor.all.js");
// require("/ueditor/lang/zh-cn/zh-cn.js");

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "panel panel-default",

    template: _.template(htmlTpl),

    initialize: function (code) {
        this.$el.html(this.template({
            title: "表单页面",
            sub: "这个页面用于生成表单"
        }));

        this.checkbox = new compCheckbox();
        this.text = new compText();
        this.select = new compSelect();
        this.fileEl = new compFile();
        this.dateEl = new compDate({
            date: '2017-10-10'
        });

        this.listenTo(this, 'dataReady', this.fillPage);

        this.initParamOfPage();

        this.url = 'http://www.kzxueche.com/institutionapi/Baseinsti/security_guardList';
        this.param = {
            isexport: 1,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            key: '40kzm151243778659066910'
        };

        if (typeof code !== "undefined") {
            this.queryData(this.url, this.param);
        }
    },

    render: function () {
        this.$('#main').append(this.checkbox.render().el);
        this.$('#main').append(this.text.render().el);
        this.$('#main').append(this.dateEl.render().el);

        this.$('#main').append(this.select.render().el);
        this.$('#main').append(this.fileEl.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {},

    /**
     * 根据条件过去数据
     * @param  {object} param [条件]
     * @return {[type]}       [description]
     */
    queryData: function (url, param, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                console.log(res);
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                } else {
                    var temp = {};
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    fillPage: function (data) {
        console.log(data);
    },

    removeEl: function () {
        this.remove();
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Backbone, _, $) {const htmlTpl = __webpack_require__(6);
const compTable = __webpack_require__(4);
const compPage = __webpack_require__(5);
const compSearch = __webpack_require__(3);

module.exports = Backbone.View.extend({
    tagName: "div",

    className: "",

    template: _.template(htmlTpl),

    initialize: function () {
        this.$el.html(this.template({
            titles: ["系统管理", "开通城市"],
            back: false
        }));
        this.table = new compTable();
        this.pagement = new compPage();
        this.search = new compSearch();
        // var ue = UE.getEditor('editor');

        this.listenTo(this.search, "goSearch", this.goSearch); //监听查询事件
        this.listenTo(this.pagement, "pageChange", this.pageChange);
        this.listenTo(this, "dataReady", this.freshTable);
        this.initParamOfPage();

        this.url = 'http://www.kzxueche.com/institutionapi/Baseinsti/security_guardList';
        this.tableParam = {
            isexport: 1,
            searchCriteria: '',
            page: 1,
            pagesize: 15,
            key: '40kzm151243778659066910'
        };
        this.queryData(this.url, this.tableParam, true);
    },

    render: function () {
        this.$('#search').append(this.search.render().el);
        this.$('#cont').append(this.table.render().el);
        // this.$('#pg').append(this.pagement.render().el);
        return this;
    },

    /**
     * 主要用于配置页面各个组件的配置
     */
    initParamOfPage: function () {
        //列表初始配置
        var thead = ['安全员编号', "姓名", "性别", "身份证号", "联系电话", "联系地址", "驾驶证号", "在职状态", "入职日期", "同步状态"]; //表头
        var rows = ['secunum', { name: 'name', isSkip: true, link: "views/formExample", code: "id" }, 'sex', 'idcard', 'mobile', 'address', 'drilicence', 'employstatus_name', 'hiredate', 'synchro_flag']; //表列
        var opration = [{ name: '审核', elID: 'code', elName: "sh" }, { name: '编辑', elID: 'code', elName: "bj" }]; //操作的功能组
        this.table.setThead(thead);
        this.table.setRow(rows);
        this.table.setOpration(opration);
        this.table.setHasOpration(false);
        this.table.setHasCheckBox(true);

        //搜索栏配置
        var searchComponents = [{
            type: 'daterange',
            param: {
                title: "时间范围",
                startDate: "2017-11-27",
                endDate: "2017-11-28",
                startTime: "12:00:01"
            }
        }, {
            type: 'text',
            param: {
                title: "搜索条件",
                value: "",
                explain: "要查询的姓名、订单",
                name: "name"
            }
        }];
        this.search.setParam(searchComponents);
    },
    /**
     * 查询数据
     * @param  {string} url       [接口url]
     * @param  {object} param     [需要传入的参数]
     * @param  {boolean} firstTime [是否需要重新渲染分页]
     */
    queryData: function (url, param, firstTime, type) {
        $.ajax({
            url: url,
            type: type || 'get',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code == 200) {
                    this.trigger('dataReady', res.data);
                    if (firstTime) {
                        var totalPage = Math.ceil(res.count / this.pagement.getPageSize());
                        this.pagement.setParam({
                            totalPage: totalPage,
                            currentPage: 1
                        });
                        this.$('#pg').append(this.pagement.render().el);
                    }
                } else {
                    var temp = [];
                    this.trigger('dataReady', temp);
                }
            }.bind(this),
            error: function () {
                console.log('页面出错');
            }.bind(this)
        });
    },

    pageChange: function (currentPage) {
        this.tableParam.page = currentPage;
        this.queryData(this.url, this.tableParam, false);
    },

    goSearch: function (param) {
        // var dateRange = this.search.getElByName('daterange');
        // console.log(dateRange.getStartDate());
        // console.log(dateRange.getEndDate());
        console.log(param);
        //this.tableParam 属性设置
        // this.queryData(this.url,this.tableParam,false);
    },

    removeEl: function () {
        this.remove();
    },

    freshTable: function (data) {
        this.table.setData(data);
    }

});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(2)))

/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map