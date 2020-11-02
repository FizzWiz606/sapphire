import React, { Component } from "react";
import * as THREE from "three";

import { defaultVertexShader } from "../util/vertexShaders";
import { morphFragmentShader } from "../util/fragmentShaders";
import { slideFragmentShader } from "../util/fragmentShaders";

import "./styles/Page.css";

class Page extends Component {
  constructor(props) {
    super(props);
    const children = this.props.children;

    this.state = {
      viewUpdated: false,
      currentView: 0,
      imageURLs: children.map((child) => child.props.imageURL),
    };

    this.images = [];

    //Initialize Three.JS variables and constants
    this.renderer = null;
    this.scene = null;
    this.camera = null;

    this.CAMERA_DISTANCE = 0;
    this.CONTAINER_HEIGHT = 0;
    this.CONTAINER_WIDTH = 0;

    this.backgroundContainer = null;

    //Event listener
    this.listener = null;
    this.clicked = false;
  }

  async componentDidMount() {
    this.init();
    await this.loadImages();
    this.attachListener();
    this.renderBackground();
  }

  componentDidUpdate() {
    this.renderBackground();
  }

  render() {
    return (
      <div className="page">
        <div
          className="background-container"
          ref={(elem) => (this.backgroundContainer = elem)}
        ></div>
        {this.props.children}
      </div>
    );
  }

  /**
   * Utility function to initialize Three.js constants and variables
   */
  init() {
    this.CAMERA_DISTANCE = 1000;
    this.CONTAINER_WIDTH = this.backgroundContainer.clientWidth;
    this.CONTAINER_HEIGHT = this.backgroundContainer.clientHeight;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.CONTAINER_WIDTH, this.CONTAINER_HEIGHT);

    const FOV =
      (2 *
        Math.atan(this.CONTAINER_HEIGHT / (2 * this.CAMERA_DISTANCE)) *
        180) /
      Math.PI;
    this.camera = new THREE.PerspectiveCamera(
      FOV,
      this.CONTAINER_WIDTH / this.CONTAINER_HEIGHT,
      0.1,
      1000
    );

    this.camera.position.z = this.CAMERA_DISTANCE;
    this.scene = new THREE.Scene();
  }

  attachListener() {
    document.body.addEventListener(
      "click",
      (this.listener = () => {
        this.clicked = true;
      })
    );
  }

  removeListener() {
    document.body.removeEventListener("click", this.listener);
  }

  /**
   * Utility function to load the required background images
   * and provide a Promise-based syntax for better management
   */
  loadImages() {
    let promises = [];

    this.state.imageURLs.forEach((url, index) => {
      promises.push(
        new Promise((resolve, reject) => {
          new THREE.TextureLoader().load(url, (image) => {
            this.images[index] = image;
            resolve();
          });
        })
      );
    });

    return new Promise((resolve, reject) => {
      Promise.all(promises).then(resolve);
    });
  }

  async renderBackground() {
    const {
      CONTAINER_HEIGHT,
      CONTAINER_WIDTH,
      camera,
      scene,
      renderer,
      backgroundContainer,
      images,
    } = this;

    const { currentView } = this.state;

    //Geometry
    const geometry = new THREE.PlaneGeometry(CONTAINER_WIDTH, CONTAINER_HEIGHT);

    //Material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_resolution: {
          value: new THREE.Vector4(),
        },
        u_texture1: {
          value: images[currentView],
        },
        u_texture2: {
          value: images[currentView + 1],
        },
        u_progress: {
          value: 0.0,
          min: 0.0,
          max: 1.0,
        },
        u_intensity: {
          value: 50,
        },
      },
      vertexShader: defaultVertexShader,
      fragmentShader: slideFragmentShader,
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

    backgroundContainer.appendChild(renderer.domElement);

    const renderLoop = () => {
      let animationFrame = requestAnimationFrame(renderLoop);
      let progress = mesh.material.uniforms.u_progress.value;
      if (progress > 1) {
        this.clicked = false;
        cancelAnimationFrame(animationFrame);
        this.setState({ currentView: currentView + 1 });
      }
      if (this.clicked) mesh.material.uniforms.u_progress.value += 0.025;
      renderer.render(scene, camera);
    };

    renderLoop();
  }
}

export default Page;
