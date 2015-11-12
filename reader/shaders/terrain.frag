#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D heightMap;
uniform sampler2D colorMap;

void main()
{
    gl_FragColor = texture2D(colorMap, vTextureCoord);
}