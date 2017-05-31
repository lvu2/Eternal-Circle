/**
 * Created by Louis Vu on 11/9/16.
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
        // create the shaders once - for all cubes
        if (!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["mine-vs", "mine-fs"]);
        }
        if (!buffers) {
            var arrays = {
                vpos : { numComponents: 3, data: [
                    // middle
                    -3.5,-.05,-.5,  3.5,-.05,-.5,  3.5, .05,-.5,        -3.5,-.05,-.5,  3.5, .05,-.5, -3.5, .05,-.5,    // z = 0
                    -3.5,-.05, .5,  3.5,-.05, .5,  3.5, .05, .5,        -3.5,-.05, .5,  3.5, .05, .5, -3.5, .05, .5,    // z = 1
                    -3.5,-.05,-.5,  3.5,-.05,-.5,  3.5,-.05, .5,        -3.5,-.05,-.5,  3.5,-.05, .5, -3.5,-.05, .5,    // y = 0
                    -3.5, .05,-.5,  3.5, .05,-.5,  3.5, .05, .5,        -3.5, .05,-.5,  3.5, .05, .5, -3.5, .05, .5,    // y = 1
                    -3.5,-.05,-.5, -3.5, .05,-.5, -3.5, .05, .5,        -3.5,-.05,-.5, -3.5, .05, .5, -3.5,-.05, .5,    // x = 0
                     3.5,-.05,-.5,  3.5, .05,-.5,  3.5, .05, .5,         3.5,-.05,-.5,  3.5, .05, .5,  3.5,-.05, .5,     // x = 1

                    // left
                    -8.5,-2.55,-.5,  -3.5,-.05,-.5,   -3.5, .05,-.5,     -8.5,-2.55,-.5,   -3.5, .05,-.5,  -8.5, -2.45,-.5,    // z = 0
                    -8.5,-2.55, .5,  -3.5,-.05, .5,   -3.5, .05, .5,     -8.5,-2.55, .5,   -3.5, .05, .5,  -8.5, -2.45, .5,    // z = 1
                    -8.5,-2.55,-.5,  -3.5,-.05,-.5,   -3.5,-.05, .5,     -8.5,-2.55,-.5,   -3.5,-.05, .5,   -8.5,-2.55, .5,    // y = 0
                    -8.5, -2.45,-.5, -3.5, .05,-.5,  -3.5, .05, .5,      -8.5, -2.45,-.5,  -3.5, .05, .5,  -8.5, -2.45, .5,    // y = 1
                    -8.5,-2.55,-.5,  -8.5, -2.45,-.5,  -8.5, -2.45, .5,    -8.5,-2.55,-.5,   -8.5, -2.45, .5,  -8.5,-2.55, .5,    // x = 0
                    -3.5,-.05,-.5,  -3.5, .05,-.5,  -3.5, .05, .5,      -3.5,-.05,-.5,   -3.5, .05, .5,  -3.5,-.05, .5,     // x = 1

                    // right
                    3.5,-.05,-.5,  8.5,-2.55,-.5,   8.5, -2.45,-.5,     3.5,-.05,-.5,   8.5, -2.45,-.5,  3.5, .05,-.5,    // z = 0
                    3.5,-.05, .5,  8.5,-2.55, .5,   8.5, -2.45, .5,     3.5,-.05, .5,   8.5, -2.45, .5,  3.5, .05, .5,    // z = 1
                    3.5,-.05,-.5,  8.5,-2.55,-.5,   8.5,-2.55, .5,      3.5,-.05,-.5,   8.5,-2.55, .5,   3.5,-.05, .5,    // y = 0
                    3.5, .05,-.5,  8.5, -2.45,-.5,  8.5, -2.45, .5,     3.5, .05,-.5,   8.5, -2.45, .5,  3.5, .05, .5,    // y = 1
                    3.5,-.05,-.5,  3.5, 0.05,-.5,   3.5, 0.05, .5,      3.5,-.05,-.5,   3.5, .05, .5,    3.5,-.05, .5,    // x = 0
                    8.5,-2.55,-.5, 8.5, -2.45,-.5,  8.5, -2.45, .5,     8.5,-2.55,-.5,  8.5, -2.45, .5,  8.5,-2.55, .5     // x = 1

                ] },
                vnormal : {numComponents:3, data: [
                    // middle
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
                ]}
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


})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.

grobjects.push(new Cube("bridge1",[ 2,2, -20],1, [.75,.75,.75]));
grobjects.push(new Cube("bridge2",[ -7,2, -30],1, [.75,.75,.75]));

