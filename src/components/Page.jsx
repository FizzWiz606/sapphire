import React, { Component } from "react";
import * as THREE from "three";

import { defaultVertexShader } from "../util/vertexShaders";
import { slideFragmentShader } from "../util/fragmentShaders";

import "./styles/Page.css";

class Page extends Component {
  constructor(props) {
    super(props);
    const children = this.props.children;

    console.log(children);

    this.currentView = 0;
    this.viewUpdated = false;

    this.page = null;

    this.images = [];
    this.imageURLs = Array.from(children)
      .filter((child) => child.type.name === "View")
      .map((child) => child.props.imageURL);

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
  }

  async componentDidMount() {
    this.init();
    await this.loadImages();
    this.attachListener();
    this.renderBackground();
  }

  render() {
    return (
      <div className="page" ref={(elem) => (this.page = elem)}>
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
        this.viewUpdated = true;
        this.updateView();
      })
    );
  }

  removeListener() {
    document.body.removeEventListener("click", this.listener);
  }

  updateView() {
    if (this.currentView < this.images.length - 1) this.currentView++;

    this.updateVisibleView();
  }

  /**
   * Utility function to load the required background images
   * and provide a Promise-based syntax for better management
   */
  loadImages() {
    let promises = [];

    this.imageURLs.forEach((url, index) => {
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

  /**
   * Utility function to bring the next View component into view
   */
  updateVisibleView() {
    Array.from(this.page.children)
      .filter((child) => child.classList.contains("view"))
      .map(
        (child) =>
          (child.style.transform = `translateY(calc(-100vh * ${this.currentView}))`)
      );
  }

  renderBackground() {
    const {
      CONTAINER_HEIGHT,
      CONTAINER_WIDTH,
      camera,
      scene,
      renderer,
      backgroundContainer,
      images,
    } = this;

    const { currentView } = this;

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
          value:
            images[
              currentView + 1 > this.images.length - 1
                ? currentView
                : currentView + 1
            ],
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
      let progress = mesh.material.uniforms.u_progress.value; //Initially 0

      if (this.viewUpdated) mesh.material.uniforms.u_progress.value += 0.025;

      if (progress > 1) {
        this.viewUpdated = false;
        cancelAnimationFrame(animationFrame);
        this.renderBackground();
      }
      renderer.render(scene, camera);
    };

    renderLoop();
  }
}

export default Page;
