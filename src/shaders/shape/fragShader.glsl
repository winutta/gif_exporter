varying vec3 pos;
varying vec3 n;
varying float hVal;
uniform vec3 colorBase;
uniform vec3 colorHighLight;

void main() {

    // vec2 uv = vec2(vUv.x,1.-vUv.y);
    // vec3 col = vec3(vUv,0.);

  vec3 lightPos = vec3(1.,0.,1.);
  lightPos /= length(lightPos);

  float light = dot(lightPos,n);

  vec3 color = vec3(42., 11., 77.)/256.;
  vec3 color2 = vec3(93., 128., 107.)/256.;
  vec3 color3 = vec3(60., 54., 69.)/255.;
  // color3 = vec3(1.);

  color3 = colorHighLight/255.;

  float hMix = smoothstep(0.,2.,hVal);

  vec3 mixCol = mix(colorBase/255.,color3*hVal,hMix);
  vec3 col = colorBase/255. + mixCol*hVal/2.;
  col = mixCol;

  // col = (n);


  // col = color3*hVal/2.;
  // col = color3*8./2.;
  // vec3 col = mix(color,color2,hVal);


    // col = mix(col,vec3(0.11),depthSwitch);

  gl_FragColor = vec4(col,1.);
}     