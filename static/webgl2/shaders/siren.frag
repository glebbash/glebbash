#version 300 es

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

in vec2 v_vertex;
out vec4 o_color;

const float radius = 0.3;
const float slowness = 100.0;

void main() {
  bool red = int(u_time / (4.0 * slowness)) % 2 == 1;
  float offset = -8.0 + mod(u_time, 4.0 * slowness) / slowness;

  o_color = vec4(0, 0, 0, 1);
  if (red) {
    o_color.r = cos(v_vertex.x + offset);
  } else {
    o_color.b = cos(v_vertex.x + offset);
  }

  vec2 v = v_vertex * u_resolution / min(u_resolution.x, u_resolution.y);

  float dist = distance(v, vec2(0));
  float brightness = dist / radius;
  o_color /= brightness;
}
