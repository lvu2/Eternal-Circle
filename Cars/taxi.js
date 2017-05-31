/**
 * Created by lvu on 11/16/2016.
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
         var car2 = LoadedOBJFiles["taxi.obj"];

        var data = [];//[geometries.vertices.length*3];
        for(var i = 0; i < car2.vertices.length; i++){
            for(var j = 0; j < 3; j++) {
                data[(i*3) + j] = car2.vertices[i][j];
            }
        }

        var data2 = [];//[geometries.vertices.length*3];
        for(var i = 0; i < car2.vertices.length; i++){
            for(var j = 0; j < 3; j++) {
                data2[(i*3) + j] = car2.vertices[i][j];
            }
        }
        for(var i = 0; i < car2.normals.length; i++){
            for(var j = 0; j < 3; j++) {
                data2[(i*3) + j] = car2.normals[i][j];
            }
        }
//get indices
        var data3 = [];
        var k = 0;
        for(var i = 0; i < car2.groups['taxi' ].faces.length; i++){
            var tmp = car2.groups['taxi' ].faces[i];
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
                vpos : { numComponents: 3, data: data/*[
                    -1.2,-.5,-.5,  1,-.5,-.5,  1, 0,-.5,        -1.2,-.5,-.5,  1, 0,-.5, -1.2, 0,-.5,    // z = 0
                    -1.2,-.5, .5,  1,-.5, .5,  1, 0, .5,        -1.2,-.5, .5,  1, 0, .5, -1.2, 0, .5,    // z = 1
                    -1.2,-.5,-.5,  1,-.5,-.5,  1,-.5, .5,       -1.2,-.5,-.5,  1,-.5, .5, -1.2,-.5, .5,    // y = 0
                    -1.2, 0,-.5,  1, 0,-.5,  1, 0, .5,          -1.2, 0,-.5,  1, 0, .5, -1.2, 0, .5,    // y = 1
                    -1.2,-.5,-.5, -1.2, 0,-.5, -1.2, 0, .5,     -1.2,-.5,-.5, -1.2, 0, .5, -1.2,-.5, .5,    // x = 0
                       1,-.5,-.5,  1, 0,-.5,  1, 0, .5,            1,-.5,-.5,  1, 0, .5,  1,-.5, .5,     // x = 1

                    -.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,    // z = 0
                    -.5,-.5, .5,  .5,-.5, .5,  .5, .5, .5,        -.5,-.5, .5,  .5, .5, .5, -.5, .5, .5,    // z = 1
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5,-.5, .5,        -.5,-.5,-.5,  .5,-.5, .5, -.5,-.5, .5,    // y = 0
                    -.5, .5,-.5,  .5, .5,-.5,  .5, .5, .5,        -.5, .5,-.5,  .5, .5, .5, -.5, .5, .5,    // y = 1
                    -.5,-.5,-.5, -.5, .5,-.5, -.5, .5, .5,        -.5,-.5,-.5, -.5, .5, .5, -.5,-.5, .5,    // x = 0
                    .5,-.5,-.5,  .5, .5,-.5,  .5, .5, .5,         .5,-.5,-.5,  .5, .5, .5,  .5,-.5, .5,     // x = 1

                    // front wheel
                    .25,-.75,-.5,  .75,-.75,-.5,  .75, .5,-.5,        .25,-.75,-.5,   .75, .5,-.5,  .25, .5,-.5,    // z = 0
                    .25,-.75, .5,  .75,-.75, .5,  .75, .5, .5,        .25,-.75, .5,   .75, .5, .5,  .25, .5, .5,    // z = 1
                    .25,-.75,-.5,  .75,-.75,-.5,  .75,-.75, .5,       .25,-.75,-.5,   .75,-.75, .5,  .25,-.75, .5,    // y = 0
                    .25,.5,-.5,    .75, .5,-.5,  .75, .5, .5,         .25, .5,-.5,    .75, .5, .5,  .25, .5, .5,    // y = 1
                    .25,-.75,-.5,  .25, .5,-.5,  .25, .5, .5,         .25,-.75,-.5,   .25, .5, .5, .25,-.75, .5,    // x = 0
                    .75,-.75,-.5,  .75, .5,-.5,  .75, .5, .5,         .75,-.75,-.5,   .75, .5, .5,  .75,-.75, .5,     // x = 1

                    // back wheel
                    -.35,-.75,-.5,  -.85,-.75,-.5,  -.85, .5,-.5,        -.35,-.75,-.5,   -.85, .5,-.5,  -.35, .5,-.5,    // z = 0
                    -.35,-.75, .5,  -.85,-.75, .5,  -.85, .5, .5,        -.35,-.75, .5,   -.85, .5, .5,  -.35, .5, .5,    // z = 1
                    -.35,-.75,-.5,  -.85,-.75,-.5,  -.85,-.75, .5,       -.35,-.75,-.5,   -.85,-.75, .5, -.35,-.75, .5,    // y = 0
                    -.35,.5,-.5,    -.85, .5,-.5,  -.85, .5, .5,         -.35, .5,-.5,    -.85, .5, .5,  -.35, .5, .5,    // y = 1
                    -.35,-.75,-.5,  -.35, .5,-.5,  -.35, .5, .5,         -.35,-.75,-.5,   -.35, .5, .5,  -.35,-.75, .5,    // x = 0
                    -.85,-.75,-.5,  -.85, .5,-.5,  -.85, .5, .5,         -.85,-.75,-.5,   -.85, .5, .5,  -.85,-.75, .5     // x = 1
                ]*/ },
                vnormal : {numComponents:3, data: data2 /*[
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,

                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,

                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,

                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
                ]*/},
                indices : data3
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
    // var movX = .05;
    // var movY = 0;
    // var count = 0;
    // var turn = 0;
    SpinningCube.prototype = Object.create(Cube.prototype);
    SpinningCube.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        var theta = Number(drawingState.realtime)/200.0;
        if (this.axis == 'X') {
            twgl.m4.rotateX(modelM, theta, modelM);
        } else if (this.axis == 'Z') {
            twgl.m4.rotateZ(modelM, theta, modelM);
        } else {
           twgl.m4.rotateY(modelM, 0, modelM);
            if (this.position[2] < -9 || this.position[2] > 8) {
                inc = (-1)*inc;
            }
            this.position[2] += inc;
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
grobjects.push(new SpinningCube("taxi",[0, 0, 2], .6, [1,1,0], 'Y'));
