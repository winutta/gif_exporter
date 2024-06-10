varying vec3 pos;
varying vec3 n;
uniform float iTime;
varying float hVal;
uniform float undulationScale;

/* skew constants for 3d simplex functions */
const float F3 =  0.3333333;
const float G3 =  0.1666667;

vec3 random3(vec3 c) {
float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
vec3 r;
r.z = fract(512.0*j);
j *= .125;
r.x = fract(512.0*j);
j *= .125;
r.y = fract(512.0*j);
return r-0.5;
}

float simplex3d(vec3 p) {
  /* 1. find current tetrahedron T and it's four vertices */
  /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
  /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/
  
  /* calculate s and x */
  vec3 s = floor(p + dot(p, vec3(F3)));
  vec3 x = p - s + dot(s, vec3(G3));
  
  /* calculate i1 and i2 */
  vec3 e = step(vec3(0.0), x - x.yzx);
  vec3 i1 = e*(1.0 - e.zxy);
  vec3 i2 = 1.0 - e.zxy*(1.0 - e);
  
  /* x1, x2, x3 */
  vec3 x1 = x - i1 + G3;
  vec3 x2 = x - i2 + 2.0*G3;
  vec3 x3 = x - 1.0 + 3.0*G3;
  
  /* 2. find four surflets and store them in d */
  vec4 w, d;
  
  /* calculate surflet weights */
  w.x = dot(x, x);
  w.y = dot(x1, x1);
  w.z = dot(x2, x2);
  w.w = dot(x3, x3);
  
  /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
  w = max(0.6 - w, 0.0);
  
  /* calculate surflet components */
  d.x = dot(random3(s), x);
  d.y = dot(random3(s + i1), x1);
  d.z = dot(random3(s + i2), x2);
  d.w = dot(random3(s + 1.0), x3);
  
  /* multiply d by w^4 */
  w *= w;
  w *= w;
  d *= w;
  
  /* 3. return the sum of the four surflets */
  return dot(d, vec4(52.0));
}

void main()
{
  // vUv = uv;
  pos = position;
  n = normal;

  float scaler = 1.;

  float bumpScaler = 1.7;
  bumpScaler = undulationScale;

  vec2 circler = vec2(cos(iTime),sin(iTime));

  float h = smoothstep(-.5,0.5,simplex3d(position*10.*bumpScaler + vec3(circler,0.5)*4. ));
  float h2 = simplex3d(position*.5*bumpScaler+ vec3(circler,(circler.y+circler.x)/2.) )*8.;
  h = (h + h2)/2.;
  hVal = h*0.8;

  vec3 norm = normalize(position);
  // n= normal;
  vec3 offset = normal*h/26.*1.;
  // offset = vec3(0.);

  // pos = (modelMatrix*vec4(position,1.0)).xyz;

  

  vec4 modelViewPosition = modelViewMatrix * vec4((position/2.+ offset) * scaler,1.0);
  // pos = (projectionMatrix * modelViewPosition).xyz;
  gl_Position = projectionMatrix * modelViewPosition;

}