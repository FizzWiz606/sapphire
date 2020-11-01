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

    document.body.addEventListener("click", () => {
      this.setState({ u_input: this.state.u_input + 0.1 });
    });
  }

  render() {
    return (
      <div className="page">
        <div className="background-container"></div>
      </div>
    );
  }

  renderBackground() {
    //Set Up and Initialization
    const CAMERA_DISTANCE = 1000;

    const container = document.querySelector("div.background-container");

    const CONTAINER_WIDTH = container.clientWidth;
    const CONTAINER_HEIGHT = container.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(CONTAINER_WIDTH, CONTAINER_HEIGHT);

    const FOV =
      (2 * Math.atan(CONTAINER_WIDTH / 2 / CAMERA_DISTANCE) * 180) / Math.PI;
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
    const fragmentShader = `
        uniform float u_input;
        void main(){
            gl_FragColor = vec4(u_input, 0.0, 1.0, 1.0);
        }
    `;
    const material = new THREE.ShaderMaterial({
      uniforms: { u_input: { type: "float", value: this.state.u_input } },
      fragmentShader: fragmentShader,
    });

    //Mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    container.appendChild(renderer.domElement);

    const renderLoop = () => {
      requestAnimationFrame(renderLoop);
      mesh.rotation.z += 0.01;
      mesh.material.uniforms.u_input.value = this.state.u_input;
      renderer.render(scene, camera);
    };

    renderLoop();
  }
}

export default Page;
