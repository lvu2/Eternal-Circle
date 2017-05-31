/**
 * Created by lvu on 11/29/2016.
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
//method3
    var vertexSource = ""+
/*        "precision highp float;" +

    "attribute vec3 aPosition;" +
    "attribute vec3 aNormal;" +
    "varying vec3 outNormal;" +
    "varying vec3 outPos;" +
                    "attribute vec3 aColor;" +
        "attribute vec3 aNormal;" +
        "varying vec3 fColor;" +
        "varying vec3 fNormal;" +

    //"uniform mat4 view;" +
    //"uniform mat4 proj;" +
    //"uniform mat4 model;" +
    //"uniform vec3 lightdir;" +
    //"uniform vec3 cubecolor;" +
        "uniform mat4 pMatrix;" +
        "uniform mat4 vMatrix;" +
        "uniform mat4 mMatrix;" +
        "attribute vec2 aTexCoord;" +
        "varying vec2 fTexCoord;" +

    "void main(void) {" +
        "gl_Position = pMatrix * vMatrix * mMatrix * vec4(aPosition, 1.0);" +
        "outPos =  (vMatrix * mMatrix * vec4(aPosition, 1.0)).xyz;" +
                        "  fColor = aColor;" +
            "  fNormal = aNormal;" +
        "outNormal = normalize(vMatrix * mMatrix * vec4(aNormal,0.0)).xyz;" +
            "  fTexCoord = aTexCoord;" +
    "};"*/
    //method 1&2
        "precision highp float;" +
        "attribute vec3 aPosition;" +
        "attribute vec3 aColor;" +
        "attribute vec3 aNormal;" +
        "attribute vec2 aTexCoord;" +
        "varying vec2 fTexCoord;" +
        "varying vec3 fPosition;" +
        "varying vec3 fColor;" +
        "varying vec3 fNormal;" +
        "uniform mat4 pMatrix;" +
        "uniform mat4 vMatrix;" +
        "uniform mat4 mMatrix;" +
        "void main(void) {" +
        "  gl_Position = pMatrix * vMatrix * mMatrix * vec4(aPosition, 1.0);" +
            "  fColor = aColor;" +
            "  fNormal = aNormal;" +
            "  fPosition = (vMatrix * mMatrix * vec4(aPosition, 1.0)).xyz;" +
        "  fTexCoord = aTexCoord;" +
        "}";

    var fragmentSource = "" +
// method 3
    /*"precision highp float;" +
    "varying vec3 outNormal;" +
    "varying vec3 outPos;" +
    //"uniform vec3 lightdir;" +
    "varying vec3 fColor;" +
"float pulse(float val, float dst) {" +
  "return floor(mod(val*dst,1.0)+.5);" +
"}" +
    "void main(void) {" +
"vec3 color = vec3(1, pulse(outPos.y,10.0),1);" +
        "vec3 n = normalize(outNormal);" +
        "vec3 e = normalize(-outPos);" +
        "vec3 l = normalize(lightdir);" +
        "vec3 h = normalize(e+l);" +
        "float diffuse = .5 + .5*abs(dot(outNormal, (1,1,1) ));" +
        "float specular = pow(max(dot(n,h),0.0),2.0);" +
        "vec3 outColor1 = fColor * diffuse;" +
        //vec3 outColor = cubecolor * specular;
        "vec3 outColor = color*specular;" +
        "gl_FragColor = vec4(outColor, 1.0);" +
    "}"*/
//method1
        "precision highp float;" +
        "varying vec2 fTexCoord;" +
        "varying vec3 fColor;" +
        "uniform sampler2D uTexture;" +
        "void main(void) {" +
        "  gl_FragColor = texture2D(uTexture, fTexCoord);" +
        "}";

// method2
     /* "precision highp float;" +
      "varying vec3 fPosition;" +
      "varying vec3 fColor;" +
      "varying vec3 fNormal;" +
      "varying vec2 fTexCoord;" +
      //uniform mat4 uMVn;" +
        "uniform mat4 vMatrix;" +
      //uniform sampler2D texSampler1;" +
      "uniform sampler2D uTexture;" +

      "const vec3  lightV    = vec3(0.0,0.0,1.0);" +
      "const float lightI    = 1.0;" +
      "const float ambientC  = 0.15;" +
      "const float diffuseC  = 0.3;" +
      "const float specularC = 1.0;" +
      "const float specularE = 16.0;" +
      "const vec3  lightCol  = vec3(1.0,1.0,1.0);" +
      "const vec3  objectCol = vec3(1.0,0.6,0.0);" +
      "vec2 blinnPhongDir(vec3 lightDir, vec3 n, float lightInt, float Ka," +
        "float Kd, float Ks, float shininess) {" +
        "vec3 s = normalize(lightDir);" +
        "vec3 v = normalize(-fPosition);" +
        "vec3 h = normalize(v+s);" +
        "float diffuse = Ka + Kd * lightInt * max(0.0, dot(n, s));" +
        "float spec =  Ks * pow(max(0.0, dot(n,h)), shininess);" +
        "return vec2(diffuse, spec);" +
      "}" +

      "void main(void) {" +
        "vec3 dNormal=texture2D(uTexture,fTexCoord).xyz;" +
        "vec3 n_perturbed = normalize(dNormal+fNormal);" +
        "vec3 n = (vMatrix * vec4(n_perturbed, 0.0)).xyz;" +
        "vec3 ColorS  = blinnPhongDir(lightV,n,0.0   ,0.0,     0.0,     specularC,specularE).y*lightCol;" +
        "vec3 ColorAD = blinnPhongDir(lightV,n,lightI,ambientC,diffuseC,0.0,      1.0      ).x*fColor;" +
        "gl_FragColor = vec4(ColorAD+ColorS,1.0);" +
      "}"*/

    var vertices = new Float32Array([
         0.5,  0.5,  0.5,//1
        -0.5,  0.5,  0.5,//2
        -0.5, -0.5,  0.5,//3

         0.5,  0.5,  0.5,//1
        -0.5, -0.5,  0.5,//3
         0.5, -0.5,  0.5,//4

         0.5,  0.5,  -0.5,//5
         0.5, 0.5,   0.5,//1
         0.5, -0.5,  0.5,//4

         0.5, 0.5,  -0.5,//5
         0.5, -0.5,  0.5,//4
         0.5, -0.5,  -0.5,//6


         0.5,  0.5,  -0.5,//1
        -0.5,  0.5,  -0.5,//2
        -0.5, -0.5,  -0.5,//3

         0.5,  0.5,  -0.5,//1
        -0.5, -0.5,  -0.5,//3
         0.5, -0.5,  -0.5,//4

         -0.5,  0.5,  -0.5,//5
         -0.5, 0.5,   0.5,//1
         -0.5, -0.5,  0.5,//4

         -0.5, 0.5,  -0.5,//5
         -0.5, -0.5,  0.5,//4
         -0.5, -0.5,  -0.5,//6

    ]);

    var uvs = new Float32Array([
       1.0, 1.0,
       0.0, 1.0,
       0.0, 0.0,

       1.0, 1.0,
       0.0, 0.0,
       1.0, 0.0,

        1.0, 1.0,
       0.0, 1.0,
       0.0, 0.0,

        1.0, 1.0,
       0.0, 0.0,
       1.0, 0.0,

                1.0, 1.0,
       0.0, 1.0,
       0.0, 0.0,

        1.0, 1.0,
       0.0, 0.0,
       1.0, 0.0,

                1.0, 1.0,
       0.0, 1.0,
       0.0, 0.0,

        1.0, 1.0,
       0.0, 0.0,
       1.0, 0.0,
    ]);
 // vertex normals
    var vertexNormals = new Float32Array(
        [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,    0, 0, 1,   0, 0, 1,
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,    1, 0, 0,   1, 0, 0,
            0, 0, -1,   0, 0, -1,   0, 0, -1,   0, 0, -1,    0, 0, 1,   0, 0, -1,
           -1, 0, 0,   -1, 0, 0,   -1, 0, 0,   -1, 0, 0,    -1, 0, 0,   -1, 0, 0,
             ]);

    // vertex colors
    var vertexColors = new Float32Array(
        [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,  0, 0, 1,  0, 0, 1,
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,  1, 0, 0,
            0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,  0, 0, 1,  0, 0, 1,
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,  1, 0, 0,
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
    image.src = "data:image/jpeg;base64,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"


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
                // Prevents s-coordinate wrapping (repeating).
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
// Prevents t-coordinate wrapping (repeating).
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        //gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

     var TexturedPlane = function () {
        this.name = "TexturedPlane"
        this.position = new Float32Array([0, 0, 0]);
        this.scale = new Float32Array([1, 1, 1]);
        this.program = null;
        this.attributes = null;
        this.uniforms = null;
        this.buffers = [null, null]
        this.texture = null;
    }

    TexturedPlane.prototype.init = function (drawingState) {
        var gl = drawingState.gl;

        this.program = createGLProgram(gl, vertexSource, fragmentSource);
        this.attributes = findAttribLocations(gl, this.program, ["aPosition", "aTexCoord","aNormal","aColor"]);
        this.uniforms = findUniformLocations(gl, this.program, ["pMatrix", "vMatrix", "mMatrix", "uTexture"]);

        this.texture = createGLTexture(gl, image, true);

        this.buffers[0] = createGLBuffer(gl, vertices, gl.STATIC_DRAW);
        this.buffers[1] = createGLBuffer(gl, uvs, gl.STATIC_DRAW);
        this.buffers[2] = createGLBuffer(gl, vertexNormals, gl.STATIC_DRAW);
        this.buffers[3] = createGLBuffer(gl, vertexColors, gl.STATIC_DRAW);
    }

    TexturedPlane.prototype.center = function () {
        return this.position;
    }

    TexturedPlane.prototype.draw = function (drawingState) {
        var gl = drawingState.gl;

        gl.useProgram(this.program);
        gl.disable(gl.CULL_FACE);

        var modelM = twgl.m4.scaling([this.scale[0],this.scale[1], this.scale[2]]);
        twgl.m4.setTranslation(modelM,this.position, modelM);
         var theta = Number(drawingState.realtime)/400.0;
        twgl.m4.rotateX(modelM, 1.5708, modelM);

        gl.uniformMatrix4fv(this.uniforms.pMatrix, gl.FALSE, drawingState.proj);
        gl.uniformMatrix4fv(this.uniforms.vMatrix, gl.FALSE, drawingState.view);
        gl.uniformMatrix4fv(this.uniforms.mMatrix, gl.FALSE, modelM);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.uniforms.uTexture, 0);



        enableLocations(gl, this.attributes)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[0]);
        gl.vertexAttribPointer(this.attributes.aPosition, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[1]);
        gl.vertexAttribPointer(this.attributes.aTexCoord, 2, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[2]);
        gl.vertexAttribPointer(this.attributes.aNormal, 3, gl.FLOAT, false, 0, 0);

                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[3]);
        gl.vertexAttribPointer(this.attributes.aColor, 3, gl.FLOAT, false, 0, 0);



        gl.drawArrays(gl.TRIANGLES, 0, 6);

        disableLocations(gl, this.attributes);
    }


    var test = new TexturedPlane();
        test.position[0] = 0;
        test.position[1] = 50.1;
        test.position[2] = -20;
        test.scale = [100, 100, 100];



        grobjects.push(test);


})();