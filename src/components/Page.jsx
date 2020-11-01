import React, { Component } from "react";

import * as THREE from "three";

import "./styles/Page.css";

class Page extends Component {
  constructor() {
    super();
    this.state = {
      u_input: 0,
    };
  }

  componentDidMount() {
    this.renderBackground();
  }

  render() {
    return (
      <div className="page">
        <div className="background-container"></div>
      </div>
    );
  }

  renderBackground() {
    let clicked = false;
    document.body.addEventListener("click", () => {
      clicked = true;
    });
    //Set Up and Initialization
    const CAMERA_DISTANCE = 1000;

    const container = document.querySelector("div.background-container");

    const CONTAINER_WIDTH = container.clientWidth;
    const CONTAINER_HEIGHT = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(CONTAINER_WIDTH, CONTAINER_HEIGHT);

    const FOV =
      (2 * Math.atan(CONTAINER_HEIGHT / (2 * CAMERA_DISTANCE)) * 180) / Math.PI;
    const camera = new THREE.PerspectiveCamera(
      FOV,
      CONTAINER_WIDTH / CONTAINER_HEIGHT,
      0.1,
      1000
    );
    camera.position.z = CAMERA_DISTANCE;
    const scene = new THREE.Scene();

    //Geometry
    const geometry = new THREE.PlaneGeometry(CONTAINER_WIDTH, CONTAINER_HEIGHT);

    //Material
    const textures = [];

    const loadImages = (callback) => {
      const promises = [];
      const images = [
        "https://images.pexels.com/photos/2128042/pexels-photo-2128042.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        "https://images.pexels.com/photos/2603464/pexels-photo-2603464.jpeg?cs=srgb&dl=pexels-aleksandar-pasaric-2603464.jpg&fm=jpg",
      ];
      images.forEach((url, i) => {
        let promise = new Promise((resolve) => {
          textures[i] = new THREE.TextureLoader().load(url, resolve);
        });
        promises.push(promise);
      });

      Promise.all(promises).then(() => {
        callback();
      });
    };

    const run = () => {
      const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `;

      const fragmentShader = `
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
      const material = new THREE.ShaderMaterial({
        uniforms: {
          u_resolution: {
            value: new THREE.Vector4(),
          },
          u_texture1: {
            value: textures[0],
          },
          u_texture2: {
            value: textures[1],
          },
          u_progress: {
            value: 0.0,
            min: 0.0,
            max: 1.0,
          },
          u_intensity: {
            value: 0.5,
          },
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
      });

      let imageAspect =
        material.uniforms.u_texture1.value.image.height /
        material.uniforms.u_texture1.value.image.width;
      let a1;
      let a2;
      if (CONTAINER_HEIGHT / CONTAINER_WIDTH > imageAspect) {
        a1 = (CONTAINER_WIDTH / CONTAINER_HEIGHT) * imageAspect;
        a2 = 1;
      } else {
        a1 = 1;
        a2 = CONTAINER_HEIGHT / CONTAINER_WIDTH / imageAspect;
      }

      material.uniforms.u_resolution.value.x = CONTAINER_WIDTH;
      material.uniforms.u_resolution.value.y = CONTAINER_HEIGHT;
      material.uniforms.u_resolution.value.z = a1;
      material.uniforms.u_resolution.value.w = a2;

      //Mesh
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      container.appendChild(renderer.domElement);

      const renderLoop = () => {
        requestAnimationFrame(renderLoop);
        let progress = mesh.material.uniforms.u_progress.value;
        if (progress > 1) {
          clicked = false;
          mesh.material.uniforms.u_progress.value = 1;
        }
        if (clicked) mesh.material.uniforms.u_progress.value += 0.03;
        renderer.render(scene, camera);
      };

      renderLoop();
    };

    loadImages(run);
  }
}

export default Page;
