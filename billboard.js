/**
 * Created by lvu on 11/15/2016.
 */

/**
 A Very Simple Textured Plane using native WebGL.

 Notice that it is possible to only use twgl for math.

 Also, due to security restrictions the image was encoded as a Base64 string.
 It is very simple to use somthing like this (http://dataurl.net/#dataurlmaker) to create one
 then its as simple as
     var image = new Image()
     image.src = <base64string>


 **/

var grobjects = grobjects || [];


(function() {
    "use strict";

    var vertexSource = ""+
        "precision highp float;" +
        "attribute vec3 aPosition;" +
        "attribute vec2 aTexCoord;" +
        "attribute vec3 vnormal;" +
        "varying vec2 vTexCoord;" +
        "uniform mat4 pMatrix;" +
        "uniform mat4 vMatrix;" +
        "uniform mat4 mMatrix;" +
        "varying vec3 outPos;" +
        "varying vec3 outNormal;" +
        "varying vec3 fNormal;" +

        "void main(void) {" +
        "outPos = (vMatrix * mMatrix * vec4(aPosition, 1.0)).xyz;" +
        "fNormal = vnormal;" +
        "outNormal = normalize(vMatrix * mMatrix * vec4(vnormal,0.0)).xyz;" +
        "  gl_Position = pMatrix * vMatrix * mMatrix * vec4(aPosition, 1.0);" +
        "  vTexCoord = aTexCoord;" +
        "}";

    var fragmentSource = "" +
        "precision highp float;" +
        "varying vec2 vTexCoord;" +
        "uniform mat4 vMatrix;" +
        "uniform mat4 mMatrix;" +
        "uniform sampler2D uTexture;" +
        "uniform vec3 uLight;" +
        "varying vec3 outPos;" +
        "varying vec3 outNormal;" +
        "varying vec3 fNormal;" +

        "const vec3  lightV    = vec3(0.0,0.0,1.0);" +
        "const float lightI    = 3.0;" +
        "const float ambientC  = 0.85;" +
        "const float diffuseC  = 1.3;" +
        "const float specularC = 1.0;" +
        "const float specularE = 16.0;" +
        "const vec3  lightCol  = vec3(1.0,1.0,1.0);" +
        "const vec3  objectCol = vec3(1.0,0.6,0.0);" +
        "vec2 blinnPhongDir(vec3 lightDir, vec3 n, float lightInt, float Ka," +
        "float Kd, float Ks, float shininess) {" +
        "vec3 s = normalize(lightDir);" +
        "vec3 v = normalize(-outPos);" +
        "vec3 h = normalize(v+s);" +
        "float diffuse = Ka + Kd * lightInt * max(0.0, dot(normalize(n), s));" +
        "float spec =  Ks * pow(max(0.0, dot(normalize(n),h)), shininess);" +
        "return vec2(diffuse, spec);" +
        "}" +


        "void main(void) {" +
        "vec3 texColor = texture2D(uTexture, vTexCoord).xyz;" +
        "vec3 n = (vMatrix * mMatrix * vec4(fNormal, 0.0)).xyz;" +
        "vec3 ColorS  = blinnPhongDir(uLight,n,0.0   ,0.0,     0.0,     specularC,specularE).y*lightCol;" +
        "vec3 ColorAD = blinnPhongDir(uLight,n,lightI,ambientC,diffuseC,0.0,      1.0      ).x*texColor;" +
        "gl_FragColor = vec4(ColorAD+ColorS,1.0);" +
        "}";


    var vertices = new Float32Array([
         0.5,  0.5,  0.0,
        -0.5,  0.5,  0.0,
        -0.5, -0.5,  0.0,

         0.5,  0.5,  0.0,
        -0.5, -0.5,  0.0,
         0.5, -0.5,  0.0

    ]);

    var uvs = new Float32Array([
       1.0, 1.0,
       0.0, 1.0,
       0.0, 0.0,

       1.0, 1.0,
       0.0, 0.0,
       1.0, 0.0
    ]);

     var normal = new Float32Array([
       0.0, 0.0, 1.0,
       0.0, 0.0, 1.0,
       0.0, 0.0, 1.0,

       0.0, 0.0, 1.0,
       0.0, 0.0, 1.0,
       0.0, 0.0, 1.0
    ]);

    //useful util function to simplify shader creation. type is either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
    var createGLShader = function (gl, type, src) {
        var shader = gl.createShader(type)
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            console.log("warning: shader failed to compile!")
            console.log(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    //see above comment on how this works.
    var image = new Image();
    image.src = "data:image/png;base64,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"


    //useful util function to return a glProgram from just vertex and fragment shader source.
    var createGLProgram = function (gl, vSrc, fSrc) {
        var program = gl.createProgram();
        var vShader = createGLShader(gl, gl.VERTEX_SHADER, vSrc);
        var fShader = createGLShader(gl, gl.FRAGMENT_SHADER, fSrc);
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
            console.log("warning: program failed to link");
            return null;

        }
        return program;
    }

    //creates a gl buffer and unbinds it when done.
    var createGLBuffer = function (gl, data, usage) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return buffer;
    }

    var findAttribLocations = function (gl, program, attributes) {
        var out = {};
        for(var i = 0; i < attributes.length;i++){
            var attrib = attributes[i];
            out[attrib] = gl.getAttribLocation(program, attrib);
        }
        return out;
    }

    var findUniformLocations = function (gl, program, uniforms) {
        var out = {};
        for(var i = 0; i < uniforms.length;i++){
            var uniform = uniforms[i];
            out[uniform] = gl.getUniformLocation(program, uniform);
        }
        return out;
    }

    var enableLocations = function (gl, attributes) {
        for(var key in attributes){
            var location = attributes[key];
            gl.enableVertexAttribArray(location);
        }
    }

    //always a good idea to clean up your attrib location bindings when done. You wont regret it later.
    var disableLocations = function (gl, attributes) {
        for(var key in attributes){
            var location = attributes[key];
            gl.disableVertexAttribArray(location);
        }
    }

    //creates a gl texture from an image object. Sometiems the image is upside down so flipY is passed to optionally flip the data.
    //it's mostly going to be a try it once, flip if you need to.
    var createGLTexture = function (gl, image, flipY) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        if(flipY){
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        }
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,  gl.LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

     var TexturedPlane = function () {
        this.name = "TexturedPlane"
        this.position = new Float32Array([0, 0, 0]);
        this.scale = new Float32Array([1, 1]);
        this.program = null;
        this.attributes = null;
        this.uniforms = null;
        this.buffers = [null, null]
        this.texture = null;
    }

    TexturedPlane.prototype.init = function (drawingState) {

        var gl = drawingState.gl;

        this.program = createGLProgram(gl, vertexSource, fragmentSource);
        this.attributes = findAttribLocations(gl, this.program, ["aPosition", "aTexCoord", "vnormal"]);
        this.uniforms = findUniformLocations(gl, this.program, ["pMatrix", "vMatrix", "mMatrix", "uTexture","uLight"]);

        this.texture = createGLTexture(gl, image, true);

        this.buffers[0] = createGLBuffer(gl, vertices, gl.STATIC_DRAW);
        this.buffers[1] = createGLBuffer(gl, uvs, gl.STATIC_DRAW);
        this.buffers[2] = createGLBuffer(gl, normal, gl.STATIC_DRAW);
    }

    TexturedPlane.prototype.center = function () {
        return this.position;
    }

    TexturedPlane.prototype.draw = function (drawingState) {

        var gl = drawingState.gl;

        gl.useProgram(this.program);
        gl.disable(gl.CULL_FACE);

        var modelM = twgl.m4.scaling([this.scale[0],this.scale[1], 1]);
        twgl.m4.setTranslation(modelM,this.position, modelM);

        gl.uniformMatrix4fv(this.uniforms.pMatrix, gl.FALSE, drawingState.proj);
        gl.uniformMatrix4fv(this.uniforms.vMatrix, gl.FALSE, drawingState.view);
        gl.uniformMatrix4fv(this.uniforms.mMatrix, gl.FALSE, modelM);
        gl.uniform3fv(this.uniforms.uLight,drawingState.sunDirection);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.uniforms.uTexture, 0);



        enableLocations(gl, this.attributes)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[0]);
        gl.vertexAttribPointer(this.attributes.aPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[1]);
        gl.vertexAttribPointer(this.attributes.aTexCoord, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[2]);
        gl.vertexAttribPointer(this.attributes.vnormal, 3, gl.FLOAT, false, 0, 0);



        gl.drawArrays(gl.TRIANGLES, 0, 6);

        disableLocations(gl, this.attributes);
    }


    var test = new TexturedPlane();
        test.position[1] = 10;
        test.scale = [3, 3];

    grobjects.push(test);

})();