import React, { Component } from "react";
import * as THREE from "three";

import { defaultVertexShader } from "../util/vertexShaders";
import { morphFragmentShader } from "../util/fragmentShaders";

import "./styles/Page.css";

class Page extends Component {
  constructor(props) {
    super(props);
    const children = this.props.children;

    this.state = {
      viewUpdated: false,
      currentView: 0,
      imageURLs: children.map((child) => child.props.imageURL),
      images: [],
    };
  }

  componentDidMount() {
    this.renderBackground();
  }

  render() {
    return (
      <div className="page">
        <div className="background-container"></div>
        {this.props.children}
      </div>
    );
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
            this.setState(
              {
                images: [...this.state.images, image],
              },
              resolve
            );
          });
        })
      );
    });

    return new Promise((resolve, reject) => {
      Promise.all(promises).then(resolve);
    });
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
        vertexShader: defaultVertexShader,
        fragmentShader: morphFragmentShader,
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
        if (clicked) mesh.material.uniforms.u_progress.value += 0.025;
        renderer.render(scene, camera);
      };

      renderLoop();
    };

    loadImages(run);
  }
}

export default Page;
