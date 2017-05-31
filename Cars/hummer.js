/**
 * Created by lvu on 11/15/2016.
 */

/*
 a second example object for graphics town
 check out "simplest" first

 the cube is more complicated since it is designed to allow making many cubes

 we make a constructor function that will make instances of cubes - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
 (load time)
 2) there are things that are defined to be shared by all cubes - these need to be defined
 by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each cube instance
 */
var grobjects = grobjects || [];
// allow the two constructors to be "leaked" out
var Cube = undefined;
var SpinningCube = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Cubes
    Cube = function Cube(name, position, size, color) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
    }
    Cube.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        var tree = LoadedOBJFiles["Hummer.obj"];

        var data = [];//[geometries.vertices.length*3];
        for(var i = 0; i < tree.vertices.length; i++){
            for(var j = 0; j < 3; j++) {
                data[(i*3) + j] = tree.vertices[i][j];
            }
        }

        var data2 = [];//[geometries.vertices.length*3];
        for(var i = 0; i < tree.vertices.length; i++){
            for(var j = 0; j < 3; j++) {
                data2[(i*3) + j] = tree.vertices[i][j];
            }
        }
        for(var i = 0; i < tree.normals.length; i++){
            for(var j = 0; j < 3; j++) {
                data2[(i*3) + j] = tree.normals[i][j];
            }
        }
//get indices
        var data3 = [];
        var k = 0;
        for(var i = 0; i < tree.groups['undefined' ].faces.length; i++){
            var tmp = tree.groups['undefined' ].faces[i];
            for(var j = 0; j < 3; j++) {
                var tmp2 = tmp[j];
                data3[k] = tmp2[0];
                k++;
            }
        }


        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: data },
                vnormal : {numComponents:3, data: data2},
                indices: data3
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Cube.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Cube.prototype.center = function(drawingState) {
        return this.position;
    }


    ////////
    // constructor for Cubes
    SpinningCube = function SpinningCube(name, position, size, color, axis) {
        Cube.apply(this,arguments);
        this.axis = axis || 'X';
    }
    var inc = .05;
    var movX = .05;
    var movY = 0;
    var count = 0;
    var turn = 1.5708;
    var turn2 = 1.5708;
    SpinningCube.prototype = Object.create(Cube.prototype);
    SpinningCube.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        var theta = Number(drawingState.realtime)/200.0;
        if (this.axis == 'X') {
            var modelM = twgl.m4.scaling([-this.size,this.size,this.size]);
           if(this.position[0]>3 && count%4 == 0){
                movX = 0;
                movY = .05;
                count++;
                turn2 = turn - 1.5708;
            }
            if(this.position[2]> 3 && count%4 == 1){
                movX = -.05;
                movY = 0;
                count++;
                turn2 = turn - 1.5708;
            }
            if(this.position[0]<-3 && count%4 == 2){
                movX = 0;
                movY = -.05;
                count++;
                turn2 = turn - 1.5708;
            }
            if(this.position[2]<-3 && count%4 == 3){
                movX = .05;
                movY = 0;
                count++;
                turn2 = turn - 1.5708;
            }
            this.position[0] = this.position[0] + movX;
            this.position[2] = this.position[2] + movY;
            twgl.m4.rotateY(modelM, turn2, modelM);
            //twgl.m4.translate(modelM, [drawingState.realtime,1,1], modelM);
        } else if (this.axis == 'Z') {
            twgl.m4.rotateZ(modelM, theta, modelM);
        } else {
            if(this.position[0]>3 && count%4 == 0){
                movX = 0;
                movY = .05;
                count++;
                turn = turn -1.5708;
                turn2 = turn;
            }
            if(this.position[2]> 3 && count%4 == 1){
                movX = -.05;
                movY = 0;
                count++;
                turn = turn - 1.5708;
                turn2 = -3*1.5708;
            }
            if(this.position[0]<-3 && count%4 == 2){
                movX = 0;
                movY = -.05;
                count++;
                turn = turn - 1.5708;
                turn2 = turn;
            }
            if(this.position[2]<-3 && count%4 == 3){
                movX = .05;
                movY = 0;
                count++;
                turn = turn - 1.5708;
                turn2 = 3*1.5708;
            }
            this.position[0] = this.position[0] + movX;
            this.position[2] = this.position[2] + movY;
            twgl.m4.rotateY(modelM, turn, modelM);
            //twgl.m4.translate(modelM, [drawingState.realtime,1,1], modelM);
        }
        twgl.m4.setTranslation(modelM,this.position,modelM);
        // the drawing coce is straightforward - since twgl deals with the GL stuff for us
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            cubecolor:this.color, model: modelM });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    SpinningCube.prototype.center = function(drawingState) {
        return this.position;
    }


})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
//grobjects.push(new SpinningCube("scube 1",[-2,0.5, -2],1) );
grobjects.push(new SpinningCube("redCar_left",[-2, 0, 2], .003, [1,0,0], 'Y'));
grobjects.push(new SpinningCube("redCar_right",[ -2, 0, 2], .003 , [1,0,0], 'X'));
//grobjects.push(new SpinningCube("scube 4",[ 2,0.5,  2],1));
