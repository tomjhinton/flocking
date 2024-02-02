export default /* glsl */`uniform float uTime;

varying vec2 vUv;
uniform vec2 uResolution;
varying vec3 pos;
uniform sampler2D pic;


float PI = 3.142;
  
vec2 rotate2D (vec2 _st, float _angle) {
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;

}

void coswarp(inout vec3 trip, float warpsScale ){

  trip.xyz += warpsScale * .1 * sin(3. * trip.yzx + (1. * .15));
  trip.xyz += warpsScale * .05 * sin(11. * trip.yzx + (1. * .15));
  trip.xyz += warpsScale * .025 * sin(17. * trip.yzx + (1. * .15));
  
}  

void uvRipple(inout vec2 uv, float intensity){

vec2 p = uv -.5;


  float cLength=length(p);

   uv= uv +(p/cLength)*cos(cLength*15.0-uTime*.5)*intensity;

} 

float shape( in vec2 p, float sides ,float size)
{
  
   float d = 0.0;
  vec2 st = p *2.-1.;

  // Number of sides of your shape
  float N = sides ;

  // Angle and radius from the current pixel
  float a = atan(st.x,st.y)+PI ;
  float r = (2.* PI)/(N) ;

  // Shaping function that modulate the distance
  d = cos(floor(.5+a/r)*r-a)*length(st);
  

  return  1.0-smoothstep(size,size +.1,d);
}




void main() {
  vec2 uv = vUv;
  vec2 uv2 = uv;
  uv = (gl_FragCoord.xy - uResolution * .5) / uResolution.yy + 0.5;
// uv = gl_FragCoord.xy;
uv = fract(uv * 10.);

  
  vec4 tex = texture2D(pic, uv);

  
  vec2 coOrd = gl_PointCoord;


  

  float t = (uTime * .3) + pos.y;
  float t2 = (uTime * .3) + pos.x;
  float t3 = (uTime * .3) + pos.z;

  // coOrd = vec2(coOrd.x + sin(coOrd.y *( 10.0 * sin(t))) * 0.2,
  //   coOrd.y + sin(coOrd.x *( 10.0 * sin(t))) * 0.2);

 
  // coOrd = frag(coOrd * 4.);
  
 
 vec3 color = tex.rgb;

 



 
//   t = (uTime * .5) + length(uv-.5);
 
//   t2 = (uTime * .5) + uv.x;
 
//   t3 = (uTime * .5) + uv.y;

//  color = mix(color, 1.-color, cos(t));
//  color = mix(color, 1.-color, cos(t2));
//  color = mix(color, 1.-color, cos(t3));

//  uvRipple(color.rg, .5);

//  uvRipple(color.gb, .25);
 
//  coswarp(color, 3.);
  
 
      

   float alpha = 1.;

   alpha = 1.- step(shape(coOrd, 40., .8 ), .9 ) ;


     
        // color = pos;

  

        float distanceToCenter = distance(gl_PointCoord, vec2(.2));
    // alpha = uv2.x + uv2.y;

      

  
    gl_FragColor = vec4(vec3(color.r, color.g, color.b), alpha);
}`