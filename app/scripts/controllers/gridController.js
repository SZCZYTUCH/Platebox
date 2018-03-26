(function () {
    'use strict';

    angular.module('PLATEBOX')
            .controller('gridController', ['$scope', '$rootScope', '$element', '$compile', '$timeout', function ($scope, $rootScope, $element, $compile, $timeout) {
                
                var self = this; 

                $scope.specs = {
                    w: 6,
                    h: 6,
                    size: 40

                };
                $scope.arr = 'test';
                $scope.grid = {};
                $scope.currentTrace = [];
                $scope.currentInvar = 'null';
                $scope.candidates = [];
                $scope.patch = [];
                $scope.scoreVar = {
                    sum: 0,
                    str: 'Punkty: '
                };
                $scope.animateInProgress = false;
                $scope.mainBlock = false;
                self.score = 0;

                self.areaBox = angular.element( $element.children()[0] );

                self.sampleArray = ['A', 'B', 'C', 'D', 'D', 'D', 'D', 'E'];

                self.classArrayC = ['plate-box-after-c-nw','plate-box-after-c-n', 'plate-box-after-c-ne', 'plate-box-after-c-w', 'plate-box-after-c-e', 'plate-box-after-c-sw', 'plate-box-after-c-s', 'plate-box-after-c-se'];
                self.classArrayX = ['plate-box-after-nw-x','plate-box-after-n-x','plate-box-after-ne-x','plate-box-after-w-x','plate-box-after-e-x','plate-box-after-sw-x','plate-box-after-s-x','plate-box-after-se-x'];
                self.classArrayI = {
                            nw   : [                     '','plate-box-after-nw-n','plate-box-after-nw-ne','plate-box-after-nw-w','plate-box-after-nw-e','plate-box-after-nw-sw','plate-box-after-nw-s','plate-box-after-nw-se'],
                             n   : ['plate-box-after-nw-n' ,                    '','plate-box-after-n-ne' ,'plate-box-after-n-w' ,'plate-box-after-n-e' ,'plate-box-after-n-sw' ,'plate-box-after-n-s' ,'plate-box-after-n-se'],
                            ne   : ['plate-box-after-nw-ne','plate-box-after-n-ne',                     '','plate-box-after-ne-w','plate-box-after-ne-e','plate-box-after-ne-sw','plate-box-after-ne-s','plate-box-after-ne-se'],
                             e   : ['plate-box-after-nw-e' ,'plate-box-after-n-e' ,'plate-box-after-ne-e' ,'plate-box-after-e-w' ,                    '','plate-box-after-e-sw' ,'plate-box-after-e-s' ,'plate-box-after-e-se'],
                            se   : ['plate-box-after-nw-se','plate-box-after-n-se','plate-box-after-ne-se','plate-box-after-se-w','plate-box-after-e-se','plate-box-after-se-sw','plate-box-after-se-s',                    ''],
                             s   : ['plate-box-after-nw-s' ,'plate-box-after-n-s' ,'plate-box-after-ne-s' ,'plate-box-after-s-w' ,'plate-box-after-e-s' ,'plate-box-after-s-sw' ,                    '','plate-box-after-se-s'],
                            sw   : ['plate-box-after-nw-sw','plate-box-after-n-sw','plate-box-after-ne-sw','plate-box-after-sw-w','plate-box-after-e-sw',                     '','plate-box-after-s-sw','plate-box-after-se-sw'],
                             w   : ['plate-box-after-nw-w' ,'plate-box-after-n-w' ,'plate-box-after-ne-w' ,                    '','plate-box-after-e-w' ,'plate-box-after-sw-w' ,'plate-box-after-s-w' ,'plate-box-after-se-w']
                };

                self.fillGrid = function(){
                    var k = 0;
                    for(var i = 0; i <= $scope.specs.w; i++){
                        for(var j = 0; j <= $scope.specs.h; j++){
                            var invar = _.sample(self.sampleArray);
                            $scope.grid['G'+i+j] = {x:i, y:j, xPos: i, yPos: j, pos: k, taken:false, invar: invar, oldInvar: null, element:null, overridePosition: null}; k++;
                        }
                    }
                };

                self.getBoxElement = function(tI, eventType){
                    var t = document.elementFromPoint(tI.clientX, tI.clientY);
                    var tE = angular.element(t);

                    if ( eventType === 'onDown' && tE.hasClass('plate-inn') ){
                        t = angular.element(tE).parent()[0];
                    }else if(eventType === 'onMove' && tE.hasClass('plate-inn')){
                        t = angular.element(tE).parent()[0];    
                    }else if (eventType === 'onMove' && tE.hasClass('plate-box')){
                        t = angular.element('<div></div>')[0];
                    } 

                    if (t.scope !== undefined) {
                        return t;
                    } else {
                        return -1;
                    }

                };

                self.getBefrBox = function(b){
                    return angular.element(angular.element(b).children()[0]);
                };

                self.getAftrBox = function(b){
                    return angular.element(angular.element(b).children()[1]);
                };

                self.checkCnddt = function(x, y, arr){
                    if (x >= 0 && y >= 0 && x <= $scope.specs.w && y <= $scope.specs.h){
                        if (!$scope.grid['G'+x+y].taken && $scope.currentInvar === $scope.grid['G'+x+y].invar){
                            arr.push($scope.grid['G'+x+y]);
                        }
                    }
                };

                self.fillCandidates = function(center_box){
                    var cntr_x = center_box.scope.box.x;
                    var cntr_y = center_box.scope.box.y;

                    var cands = [];

                    self.checkCnddt(cntr_x-1,cntr_y-1,cands); self.checkCnddt(cntr_x,cntr_y-1,cands); self.checkCnddt(cntr_x+1,cntr_y-1,cands);
                    self.checkCnddt(cntr_x-1,cntr_y  ,cands);                                         self.checkCnddt(cntr_x+1,cntr_y  ,cands);
                    self.checkCnddt(cntr_x-1,cntr_y+1,cands); self.checkCnddt(cntr_x,cntr_y+1,cands); self.checkCnddt(cntr_x+1,cntr_y+1,cands);

                    return cands;
                }; 

                self.markCandidates = function (candids) {
                    _.forEach(candids, function (c) {
                        c.patchPlateElement.addClass('plate-border');
                    });
                };

                self.clearCandidates = function(candids){
                    _.forEach(candids, function (c) {
                        c.patchPlateElement.removeClass('plate-border');
                    });
                };

                $scope.clearPatch = function(patchArray){
                    _.forEach(patchArray, function (pA) {
                        pA.patchPlateElement.removeAttr('class');
                    });
                };

                self.paintNode = function(n_1, n0, n1, classArray, intermediate){
                    if (n1.x < n0.x){
                        if (n1.y < n0.y){
                            //n-w
                            if (intermediate){
                                self.paintNode(null,n0,n_1,self.classArrayI.nw, false);
                            }else{
                                n0.patchPlateElement.addClass(classArray[0]);
                                n0.lastDirection = 'nw';
                            }
                        }else if(n1.y === n0.y){
                            //n
                            if (intermediate){
                                self.paintNode(null,n0,n_1,self.classArrayI.n, false);
                            }else{
                                n0.patchPlateElement.addClass(classArray[1]);
                                n0.lastDirection = 'n';
                            }
                        }else if (n1.y > n0.y){
                            //n-e
                            if (intermediate){
                                self.paintNode(null,n0,n_1,self.classArrayI.ne, false);
                            }else{
                                n0.patchPlateElement.addClass(classArray[2]);
                                n0.lastDirection = 'ne';
                            }
                        }
                    }else if(n1.x === n0.x){
                        if (n1.y < n0.y){
                            //w
                            if (intermediate){
                                self.paintNode(null,n0,n_1,self.classArrayI.w, false);
                            }else{
                                n0.patchPlateElement.addClass(classArray[3]);
                                n0.lastDirection = 'w';
                            }
                        }else if(n1.y === n0.y){
                            //should be imposible
                        }else if (n1.y > n0.y){
                            //e
                            if (intermediate){
                                self.paintNode(null,n0,n_1,self.classArrayI.e, false);
                            }else{
                                n0.patchPlateElement.addClass(classArray[4]);
                                n0.lastDirection = 'e';
                            }  
                        }
                    }else if (n1.x > n0.x){
                        if (n1.y < n0.y){
                            //s-w
                            if (intermediate){
                                self.paintNode(null,n0,n_1,self.classArrayI.sw, false);
                            }else{
                                n0.patchPlateElement.addClass(classArray[5]);
                                n0.lastDirection = 'sw';
                            }
                        }else if(n1.y === n0.y){
                            //s
                            if (intermediate){
                                self.paintNode(null,n0,n_1,self.classArrayI.s, false);
                            }else{
                                n0.patchPlateElement.addClass(classArray[6]);
                                n0.lastDirection = 's';
                            }
                        }else if (n1.y > n0.y){
                            //s-e
                            if (intermediate){
                                self.paintNode(null,n0,n_1,self.classArrayI.se, false);
                            }else{
                                n0.patchPlateElement.addClass(classArray[7]);
                                n0.lastDirection = 'se';
                            }
                        }
                    }
                };

                self.refreshPatch = function(patchArray){
                    $scope.clearPatch(patchArray);
                    var l = patchArray.length;
                    if (l === 1){
                        patchArray[0].patchPlateElement.addClass('plate-box-after-c');
                    }else if(l >= 2){
                        //paint first node
                        self.paintNode(null,patchArray[0],patchArray[1],self.classArrayC, false);
                        //paint last node
                        self.paintNode(null,patchArray[l-1],patchArray[l-2],self.classArrayX, false);
                        //paint intermediate nodes
                        for (var i = 0; i < (l-2) ;i++){
                            self.paintNode(patchArray[i],patchArray[i+1],patchArray[i+2],[], true);
                        }
                    }
                };

                self.moveAndRandomizeTaken = function(patchArray){
                    _.forEach(patchArray, function (pA) {
                        pA.overridePosition = -4000;
                        pA.invar = _.sample(self.sampleArray);
                    });
                };


                self.checkMeAndDropMe = function(plate, dropMeByNumber){
                    if (plate.taken){
                        if (plate.x > 0){
                            self.checkMeAndDropMe(   $scope.grid['G'+(plate.x-1)+(plate.y)]      , dropMeByNumber + 1);

                            plate.overridePosition = null;
                            plate.xPos = dropMeByNumber;

                        }else{
                            plate.overridePosition = null;
                            plate.xPos = dropMeByNumber;
                        }
                    }else{
                        if (plate.x > 0){
                            plate.xPos = plate.xPos + dropMeByNumber;
                            self.checkMeAndDropMe(   $scope.grid['G'+(plate.x-1)+(plate.y)]      , dropMeByNumber );
                        }else{
                            plate.xPos = plate.xPos + dropMeByNumber;
                        }
                    } 
                };

                self.dropDownPlates = function(){
                    for(var i = 0; i <= $scope.specs.w; i++){
                        self.checkMeAndDropMe($scope.grid['G'+$scope.specs.h+''+i], 0);
                    }
                };

                self.resetXY = function(){
                    _.forEach($scope.grid, function(gItem){
                        if (gItem.xPos !== gItem.x || gItem.yPos !== gItem.y){
                            var pointed_plate = $scope.grid['G'+gItem.xPos+gItem.yPos];
                            if (gItem.oldInvar === null){
                                pointed_plate.oldInvar = angular.copy(pointed_plate.invar);
                                pointed_plate.invar = angular.copy(gItem.invar);
                            }else{
                                pointed_plate.oldInvar = angular.copy(pointed_plate.invar);
                                pointed_plate.invar = angular.copy(gItem.oldInvar);
                            }                     
                        }
                    });
                    _.forEach($scope.grid, function(gItem){
                        gItem.xPos = gItem.x;
                        gItem.yPos = gItem.y; 
                        gItem.oldInvar = null;
                    });

                };

                self.resetTaken = function(){
                    _.forEach($scope.grid, function(gItem){
                        gItem.taken = false;
                    });
                };

                self.addAnim = function(){
                    $scope.animateInProgress = true;
                    _.forEach($scope.grid, function(gItem){
                        gItem.element.addClass('plate-box-animate');
                    });
                };

                self.removeAnim = function(){
                    _.forEach($scope.grid, function(gItem){
                        gItem.element.removeClass('plate-box-animate');
                    });
                    $scope.animateInProgress = false;
                };

                self.touchInfo = function(event){
                    var dataEvent; 
                    if (event.touches !== undefined){
                        dataEvent = event.touches.item(0);
                    }else{
                        dataEvent = event;
                    }

                    return {
                        screenX: dataEvent.screenX,
                        screenY: dataEvent.screenY,
                        clientX: dataEvent.clientX,
                        clientY: dataEvent.clientY,
                        pageX: dataEvent.pageX,
                        pageY: dataEvent.pageY
                    };
                };

                self.calculateProperLine = function (type) {
                    console.log('end');

                    (_.last($scope.patch)).taken = true;

                    self.destroyMoveBinds();
                    self.destroyBinds();

                    self.clearCandidates($scope.candidates);
                    $scope.candidates = [];
                    $scope.clearPatch($scope.patch);

                    self.moveAndRandomizeTaken($scope.patch);
                    $scope.$apply();

                    $timeout(function () {

                        self.addAnim();
                        self.dropDownPlates();

                        self.resetTaken();
                        
                        if (type){
                            self.scoreUpdate();
                        }

                        $scope.patch = [];
                        $scope.currentInvar = null;

                        $timeout(function () {

                            self.removeAnim();

                            $timeout(function () {
                                self.resetXY();
                                self.createBinds();
                                $scope.mainBlock = false;
                            }, 20);

                        }, 801);
                    }, 20);
                };

                self.scoreUpdate = function(){
                    console.log($scope.patch.length);
                    $scope.scoreVar.sum += $scope.patch.length;
                    $scope.scoreVar.str = ('Punkty: '+$scope.scoreVar.sum);
                };

                self.onDown = function(e){
                    console.log('start');
                    console.log(e);

                    var touchInfo = self.touchInfo(e);
                    var boxElement = self.getBoxElement(touchInfo,'onDown');


                    if (boxElement !== -1) {

                        $scope.currentInvar = boxElement.scope.box.invar;
                        $scope.candidates = self.fillCandidates(boxElement);
                        self.markCandidates($scope.candidates);
                        $scope.patch.push(boxElement.scope.box);
                        self.refreshPatch($scope.patch);

                        self.createMoveBinds();
                        $scope.$apply();
                    } else {

                    }
                };

                self.onMove = function(e){
                    console.log('moving');
                    if ($scope.currentInvar !== null){
                        var touchInfo = self.touchInfo(e);
                        var boxElement = self.getBoxElement(touchInfo, 'onMove');

                        if (boxElement !== -1) {
                            //check if same element
                            if ((_.nth($scope.patch, -1)) !== boxElement.scope.box){
                                //chack if user backpedaled
                                if ((_.nth($scope.patch, -2)) === boxElement.scope.box){
                                    //console.log('reversing patch');

                                    (_.last($scope.patch)).taken = false;
                                    $scope.clearPatch($scope.patch);
                                    $scope.patch.pop();
                                    self.refreshPatch($scope.patch);

                                    self.clearCandidates($scope.candidates);
                                    $scope.candidates = [];
                                    $scope.candidates = self.fillCandidates(boxElement);
                                    self.markCandidates($scope.candidates);


                                    $scope.$apply();
                                }else{
                                    //check if element in candidates
                                    if (_.includes($scope.candidates, boxElement.scope.box)){
                                        //console.log('good moving forward');

                                        (_.last($scope.patch)).taken = true;
                                        self.clearCandidates($scope.candidates);
                                        $scope.candidates = [];
                                        $scope.candidates = self.fillCandidates(boxElement);
                                        self.markCandidates($scope.candidates);
                                        $scope.patch.push(boxElement.scope.box);
                                        self.refreshPatch($scope.patch);

                                        $scope.$apply();
                                    }else{
                                        //console.log('bad');
                                    }
                                }
                            }
                        }
                    }else{
                        self.destroyMoveBinds();
                    }
                };

                self.onEnd = function (e) {
                    if ($scope.currentInvar !== null) {
                        if($scope.patch.length >= 3 ){
                            $scope.mainBlock = true;
                            self.calculateProperLine(true);
                        }else{
                            self.destroyMoveBinds();
                            self.clearCandidates($scope.candidates);
                            $scope.candidates = [];
                            $scope.clearPatch($scope.patch);
                            self.resetTaken(); 
                            $scope.patch = [];
                            $scope.currentInvar = null;

                            $scope.$apply();
                        } 
                    }
                };

                self.createBinds = function(){
                    if (device.platform.toLowerCase() === 'browser') {
                        self.areaBox.on('mousedown', self.onDown);
                        self.areaBox.on('mouseup', self.onEnd);
                        $element.on('mouseup', self.onEnd);
                    }else{
                        self.areaBox.on('touchstart', self.onDown);
                        self.areaBox.on('touchend', self.onEnd);
                        $element.on('touchend', self.onEnd);
                    }
                };

                self.destroyBinds = function(){
                    if (device.platform.toLowerCase() === 'browser') {
                        self.areaBox.off('mousedown', self.onDown);
                        self.areaBox.off('mouseup', self.onEnd);
                        $element.off('mouseup', self.onEnd);
                    }else{
                        self.areaBox.off('touchstart', self.onDown);
                        self.areaBox.off('touchend', self.onEnd);
                        $element.off('touchend', self.onEnd);
                    }
                }; 

                self.createMoveBinds = function () {
                    if (device.platform.toLowerCase() === 'browser') {
                        self.areaBox.on('mousemove', self.onMove);
                    } else {
                        self.areaBox.on('touchmove', self.onMove);
                    }
                };

                self.destroyMoveBinds = function(){
                    if (device.platform.toLowerCase() === 'browser') {
                        self.areaBox.off('mousemove', self.onMove);
                    } else {
                        self.areaBox.off('touchmove', self.onMove);
                    }
                };

                $scope.begin = function(box){
                    console.log('begin');
                    $scope.currentInvar = 'begin';
                };

                $scope.enter = function(box){
                    console.log('wat');
                };

                $scope.plateStyle = function(box){
                    if (box.overridePosition === null){
                        return {
                            transform: 'translate3d('+(box.yPos * $scope.specs.size)+'px,'+(box.xPos * $scope.specs.size)+'px,0)',
                            width: $scope.specs.size + 'px',
                            height: $scope.specs.size + 'px'
                        };
                    }else{
                        return {
                            transform: 'translate3d('+(box.yPos * $scope.specs.size)+'px,'+(box.overridePosition)+'px,0)',
                            width: $scope.specs.size + 'px',
                            height: $scope.specs.size + 'px'
                        };
                    } 
                };
                
                $scope.mainPlateStyle = function(){
                    return {'width': ($scope.specs.size * ($scope.specs.h + 1))+'px', 'height': ($scope.specs.size * ($scope.specs.w + 1))+'px'};
                };

                $scope.plateBackground = function(box){
                    return {'background-image':'url(./assets/images/mark_ico/back/'+box.invar+'.png)'};
                };
                
                $scope.reRoll = function(){
                    if (!$scope.mainBlock){
                        
                        $scope.mainBlock = true;
                        _.forEach($scope.grid, function (gridItem) {
                            gridItem.taken = true;
                            $scope.patch.push(gridItem);
                        });

                        $timeout(function () {
                            self.calculateProperLine(false);
                        },1);
                        
                    }
                };
                
                $scope.lastDirection = function(){
                    return ('lastDirection: ' + (_.last($scope.patch) || {lastDirection: null}).lastDirection);
                };

                self.fillGrid();
                self.createBinds();


            }]);

})();