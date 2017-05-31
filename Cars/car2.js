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

////////////////////////////////////delete this///////////
  OBJLoader.load('lowpolytree.obj', function(geometries) {// BEGIN
                    //console.log(geometries.vertices[0][0]);
            //data.dat = [];//[geometries.vertices.length*3];
           /* for(var i = 0; i < geometries.vertices.length; i++){
                for(var j = 0; j < 3; j++) {
                    //data[(i*3) + j] = geometries.vertices[i][j];
                }
            }*/
    /*for (var i = 0; i < geometries.length; i++) {
        var buffers = geometries[i];
        var geometry = new Geometry({
            buffers: [
                { name: 'a_pos', data: buffers.vertices, size: 3 },
                { name: 'a_normals', data: buffers.normals, size: 3 },
                { name: 'a_texCoords', data: buffers.textureCoords, size: 2 },
                { name: 'indices', data: buffers.indices, size: 1 }
            ]
        });*/
    })
//var Wolf = LoadedOBJFiles;

//})/////////////// END //////////////////////////////////
// use the included helper function to initialize the VBOs
// if you don't want to use this function, have a look at its
// source to see how to use the Mesh instance.
// have a look at the initMeshBuffers docs for an exmample of how to
// render the model at this point
        ////////////////////////////////////
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["greenCar-vs", "greenCar-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
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
                ] },
                vnormal : {numComponents:3, data: [
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
                ]},
                vertexColors : {numComponents:3, data: [
                    0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
                    1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
                    0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
                    1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
                    1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
                    0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,

                    0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
                    1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
                    0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
                    1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
                    1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
                    0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,

                    0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
                    1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
                    0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
                    1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
                    1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
                    0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,

                    0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
                    1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
                    0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
                    1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
                    1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
                    0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,
                ]}
            };
            //console.log(arrays);
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
           /* if(this.position[0]>3 && count%4 == 0){
                movX = 0;
                movY = .05;
                count++;
                turn = -1.5708;
            }
            if(this.position[2]> 3 && count%4 == 1){
                movX = -.05;
                movY = 0;
                count++;
                turn = turn - 1.5708;
            }
            if(this.position[0]<-3 && count%4 == 2){
                movX = 0;
                movY = -.05;
                count++;
                turn = turn - 1.5708;
            }
            if(this.position[2]<-3 && count%4 == 3){
                movX = .05;
                movY = 0;
                count++;
                turn = turn - 1.5708;
            }
            this.position[0] = this.position[0] + movX;
            this.position[2] = this.position[2] + movY;
            twgl.m4.rotateY(modelM, turn, modelM);*/
            if (this.position[0] < -9 || this.position[0] > 13) {
                inc = (-1)*inc;
            }
            this.position[0] += inc;
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
grobjects.push(new SpinningCube("car2",[-2, .75, 2], 1, [0,1,0], 'Y'));