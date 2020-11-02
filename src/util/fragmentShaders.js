export const morphFragmentShader = `
    uniform float u_progress;
    uniform sampler2D u_texture1;
    uniform sampler2D u_texture2;
    uniform float u_intensity;
    uniform vec4 u_resolution;
    
    varying vec2 vUv;
    void main()	{
        vec2 newUV = (vUv - vec2(0.5))*u_resolution.zw + vec2(0.5);
        vec4 d1 = texture2D(u_texture1, newUV);
        vec4 d2 = texture2D(u_texture2, newUV);
        float displace1 = (d1.r + d1.g + d1.b)*0.33;
        float displace2 = (d2.r + d2.g + d2.b)*0.33;
        
        vec4 t1 = texture2D(u_texture1, vec2(newUV.x, newUV.y + u_progress * (displace2 * u_intensity)));
        vec4 t2 = texture2D(u_texture2, vec2(newUV.x, newUV.y + (1.0 - u_progress) * (displace1 * u_intensity)));
        gl_FragColor = mix(t1, t2, u_progress);
    }
`;

export const slideFragmentShader = `
    uniform float time;
		uniform float u_progress;
        uniform float u_intensity;
        
		uniform sampler2D u_texture1;
        uniform sampler2D u_texture2;
        
		uniform vec4 u_resolution;
		varying vec2 vUv;
		mat2 rotate(float a) {
			float s = sin(a);
			float c = cos(a);
			return mat2(c, -s, s, c);
		}
		const float PI = 3.1415;
		const float angle1 = PI *0.25;
		const float angle2 = -PI *0.75;
		void main()	{
			vec2 newUV = (vUv - vec2(0.5))*u_resolution.zw + vec2(0.5);
			vec2 uvDivided = fract(newUV*vec2(u_intensity,1.));
			vec2 uvDisplaced1 = newUV + rotate(3.1415926/4.)*uvDivided*u_progress*0.1;
			vec2 uvDisplaced2 = newUV + rotate(3.1415926/4.)*uvDivided*(1. - u_progress)*0.1;
			vec4 t1 = texture2D(u_texture1,uvDisplaced1);
			vec4 t2 = texture2D(u_texture2,uvDisplaced2);
			gl_FragColor = mix(t1, t2, u_progress);
		}

`;
