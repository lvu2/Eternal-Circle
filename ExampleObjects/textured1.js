/**
 * Created by lvu on 11/28/2016.
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
    image.src="data:image/jpeg;base64,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"
    //image.src = "data:image/png;base64,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"



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
        twgl.m4.setTranslation(modelM,this.position, modelM);
         var theta = Number(drawingState.realtime)/400.0;
        //twgl.m4.rotateY(modelM, theta, modelM);

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



        gl.drawArrays(gl.TRIANGLES, 0, 24);

        disableLocations(gl, this.attributes);
    }


    var test = new TexturedPlane();
        test.position[0] = 3;
        test.position[1] = 15;
        test.position[2] = -10;
        test.scale = [6, 6, 6];

        var test1 = new TexturedPlane();
        test1.position[0] = 3;
        test1.position[1] = 9;
        test1.position[2] = -10;
        test1.scale = [6, 6, 6];

        var test2 = new TexturedPlane();
        test2.position[0] = 3;
        test2.position[1] = 3;
        test2.position[2] = -10;
        test2.scale = [6, 6, 6];

        grobjects.push(test);
        grobjects.push(test1);
        grobjects.push(test2);

})();