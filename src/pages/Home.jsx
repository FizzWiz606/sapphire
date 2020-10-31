import React, { Component } from "react";
import * as THREE from "three";

import "./styles/Home.css";

class Home extends Component {
  componentDidMount() {
    this.renderCube();
  }
  render() {
    return (
      <div className="page">
        <h1>This is the homepage</h1>
        <div className="container"></div>
      </div>
    );
  }

  renderCube() {
    const container = document.querySelector("div.container");

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    container.appendChild(renderer.domElement);

    function render() {
      requestAnimationFrame(render);
      renderer.render(scene, camera);

      cube.rotation.y += 0.1;
    }

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    render();
  }
}

export default Home;
