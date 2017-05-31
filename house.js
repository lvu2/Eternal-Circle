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
    Cube = function Cube(name, position, size, color, rotate) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.color = color || [.7,.8,.9];
        this.rotate = rotate || 0;
    }
    Cube.prototype.init = function(drawingState) {
        var gl=drawingState.gl;
        var car2 = LoadedOBJFiles["house.obj"];

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
        for(var i = 0; i < car2.groups['Box001' ].faces.length; i++){
            var tmp = car2.groups['Box001' ].faces[i];
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
                vpos : { numComponents: 3, data: [
                    // house
                    -.5, .5,-.5,   0, .5,-.5,   0,  1,-.5,          0, .5,-.5,  .5, .5,-.5,   0,  1,-.5,    // z = 0; roof
                    -.5, .5, .5,   0, .5, .5,   0,  1, .5,          0, .5, .5,  .5, .5, .5,   0,  1, .5,    // z = 1; roof
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,    // z = 0
                    -.5,-.5, .5,  .5,-.5, .5,  .5, .5, .5,        -.5,-.5, .5,  .5, .5, .5, -.5, .5, .5,    // z = 1
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5,-.5, .5,        -.5,-.5,-.5,  .5,-.5, .5, -.5,-.5, .5,    // y = 0
                    -.5, .5,-.5,  .5, .5,-.5,  .5, .5, .5,        -.5, .5,-.5,  .5, .5, .5, -.5, .5, .5,    // y = 1
                    -.5,-.5,-.5, -.5, .5,-.5, -.5, .5, .5,        -.5,-.5,-.5, -.5, .5, .5, -.5,-.5, .5,    // x = 0
                     .5,-.5,-.5,  .5, .5,-.5,  .5, .5, .5,         .5,-.5,-.5,  .5, .5, .5,  .5,-.5, .5,     // x = 1

                    // left
                    -.5, .5,-.5,    0,   1,-.5,   0,1.05,-.5,          -.5, .5,-.5,   0,1.05,-.5,  -.5,.55,-.5,    // z = 0
                    -.5, .5, .5,    0,   1, .5,   0,1.05, .5,          -.5, .5, .5,   0,1.05, .5,  -.5,.55, .5,    // z = 1
                    -.5, .5,-.5,    0,   1,-.5,   0,   1, .5,          -.5, .5,-.5,   0,   1, .5,  -.5, .5, .5,    // y = 0
                    -.5,.55,-.5,    0,1.05,-.5,   0,1.05, .5,          -.5,.55,-.5,   0,1.05, .5,  -.5,.55, .5,    // y = 1
                    -.5, .5,-.5,  -.5, .55,-.5, -.5, .55, .5,          -.5, .5,-.5, -.5, .55, .5,  -.5, .5, .5,    // x = 0
                      0,  1,-.5,    0,1.05,-.5,   0,1.05, .5,            0,  1,-.5,   0,1.05, .5,    0,  1, .5,     // x = 1

                    // right
                     0,   1,-.5,  .5,  .5,-.5,  .5, .55,-.5,          0,   1,-.5,   .5,.55,-.5,   0,1.05,-.5,    // z = 0
                     0,   1, .5,  .5,  .5, .5,  .5, .55, .5,          0,   1, .5,   .5,.55, .5,   0,1.05, .5,    // z = 1
                     0,   1,-.5,  .5,  .5,-.5,  .5,  .5, .5,          0,   1,-.5,   .5, .5, .5,   0,   1, .5,    // y = 0
                     0,1.05,-.5,  .5, .55,-.5,  .5, .55, .5,          0,1.05,-.5,   .5,.55, .5,   0,1.05, .5,    // y = 1
                     0,   1,-.5,   0,1.05,-.5,   0,1.05, .5,          0,   1,-.5,    0,1.05, .5,  0,  1, .5,     // x = 0
                    .5,  .5,-.5,  .5, .55,-.5,  .5, .55, .5,         .5,  .5,-.5,   .5, .55, .5, .5, .5, .5,     // x = 1

                ] },
                vnormal : {numComponents:3, data: [
                    // house
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,  // z = 0; roof
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,     // z = 1; roof
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,

                    // left
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,

                    // right
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
                ]},
                //indices : data3
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
        }

    };
    Cube.prototype.draw = function(drawingState) {
        // we make a model matrix to place the cube in the world
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
         twgl.m4.rotateY(modelM,this.rotate, modelM);
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


})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.

grobjects.push(new Cube("house1",[ -12,1.5, -3], 3, [1, 0, 0], 1.5708)); // red
grobjects.push(new Cube("house2",[ -3,1.5, -7], 3, [0, 1, 0])); // green
grobjects.push(new Cube("house3",[ 13,1.5, -13], 3, [0, 0, 1], 1.5708)); // blue
grobjects.push(new Cube("house4",[ 10,1.5, 10], 3, [1, 1, 0], 1.5708)); // yellow
grobjects.push(new Cube("house5",[ 9,1.5, 0], 3, [1, 0, 1])); // magenta
grobjects.push(new Cube("house6",[ -9,1.5, -12], 3, [0, 1, 1])); // cyan
grobjects.push(new Cube("house7",[ -13,1.5, 12], 3, [1, .65, 0])); // orange

