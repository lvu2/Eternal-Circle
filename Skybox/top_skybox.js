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

    /*image.src = "data:image/png;base64,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"*/
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
        twgl.m4.setTranslation(modelM,[this.position[0]+ drawingState.dp[0],this.position[1]+ drawingState.dp[1],this.position[2]+ drawingState.dp[2]], modelM);
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
        test.position[1] = 150;
        test.position[2] = -20;
        test.scale = [100, 100, 100];



        grobjects.push(test);


})();