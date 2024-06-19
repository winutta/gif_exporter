//  Loaders

import * as THREE from 'three'
import { setup } from "./setup"
import vertShader from "./shaders/vertShader.glsl"
import fragShader from "./shaders/fragShader.glsl"
import shapevertShader from "./shaders/shape/vertShader.glsl"
import shapefragShader from "./shaders/shape/fragShader.glsl"
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js' 
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import studio from '@theatre/studio'
import { getProject, types, onChange, val } from '@theatre/core'

// import * as CCapture from "ccapture.js"
// import { CCapture}  from "ccapture.js"

import "./ccapture.js/src/CCapture.js"

// console.log(window.CCapture,CCapture);

var CCapture = window.CCapture;





var capturer = new CCapture({format: "gif", workersPath: "./ccapture.js/src/"});
// capturer.start();


const extensionConfig = {
    id: 'hello-world-extension',
    toolbars: {
        global(set, studio) {
            set([
                {
                    type: 'Icon',
                    title: 'Example Button',
                    svgSource: '👁',
                },
            ])
        },
    },
    panes: [],
}
studio.extend(extensionConfig)
studio.initialize();
// let container = document.getElementById("section1")
// console.log(container);



var project = getProject('All')

var sheet = project.sheet('Animated scene')
// console.log(project)

console.log("studio:", studio, "project: ", project, )


// get the ui div.
var able_to_play_sequence = false;
var canvas;


project.ready.then(() => {
    // let container = document.getElementById("section1")
    let studio_root = document.getElementById("theatrejs-studio-root");
    let valuer_element = studio_root.shadowRoot.querySelectorAll("div.sc-dPZUQH")[0];
    let keyframer_element = studio_root.shadowRoot.querySelectorAll("div.sc-dPZUQH")[0];
    // let something = document.getElementById("pointer-root");
    // console.log(studio_root.shadowRoot.querySelectorAll("div.sc-dPZUQH")[0]);
    // console.log(valuer_element);

    // studio_root.scrollWidth - 350;
    keyframer_element.style.width = (studio_root.scrollWidth - 350).toString();

    valuer_element.style.width = "350px";
    // valuer_element.style.left = "10%";
    valuer_element.style.position = "absolute";
    valuer_element.style.top = "120px";
    valuer_element.style.right = "10px";
    // valuer_element.classList.add("trial");



    // studio_root.style.opacity = "95%"
    // studio_root.className = "trial";
    // container.appendChild(studio_root);
    // studio_root.style.width = "50%"
    able_to_play_sequence = true;

    console.log(setup);
    canvas = setup.renderers[1].domElement;
    console.log(canvas);
})

var capture_gif_flag = false;

// onChange(sheet.sequence.pointer.position,(pos)=>{
    
//     if(Math.abs(pos-3)<0.05){
//         //finished animation.
//         console.log("close enough!",pos)
        
//         sheet.sequence.pause();
//     } else {
//         console.log(pos);
//     }
// })

// need only set sequence position..

// with duration, and either FPS or total frames I can get a position delta to increment the sequence. 

// use a range..
//start stop frames width height

// what controls how long the gif actually is?

var startTime = 0;
var stopTime = 3;
// var pos_delta = duration/(frames-1); // -1 to account for 0 position frame. or in a loop could exclude the last frame.. idk
var updating_animation = false;

let clock = new THREE.Clock();
let timeDelta = 0;


function update_animation(){
    if(updating_animation){
        timeDelta = clock.getDelta();
        sheet.sequence.position += timeDelta;
        if(sheet.sequence.position>stopTime){
            //stop updating and capturing.
            updating_animation = false;
            // sheet.sequence.position = 0;
            stop_capture(true);
        }
    }

}

var capturer_var;

function export_animation(){
    // console.log("hi");
    if(able_to_play_sequence){

        sheet.sequence.position = setup.export_config.range_val[0]; // set to start of range
        // timeDelta = clock.getDelta();
        // updating_animation = true;
        console.log(val(sheet.sequence.pointer));
        

        var completed = sheet.sequence.play({
            iterationCount: 1,
            // range: [0,1], 
            range: setup.export_config.range_val, 
        })

        capturer_var = new CCapture({format: "gif", workersPath: "./ccapture.js/src/"});

        // need to dispose??
        capturer_var.start();


        completed.then((val)=>{
            console.log(val);
            sheet.sequence.pause();
            stop_capture(val);
        })

        

        // this is problematic?? causes jumping..
        // start capturing in render loop
        capture_gif_flag = true;
        // first_time = true;
        //start animation
    
        //
    }
}

window.export_animation = export_animation;





// on animation finish
function stop_capture(val){
    capturer_var.stop();
    capture_gif_flag = false;
    if(val){
        capturer_var.save();
    }
    
}


// var { scene, camera } = setup;



export function loadAssets(timeObject,scene,camera) {

    var updates = [];

    var first_time = true;

    function update_gif_renderer(){
        if(capture_gif_flag){
            capturer_var.capture(canvas);
        }
    }   

    updates.push(update_gif_renderer);

    // updates.push(update_animation);

    const manager = new THREE.LoadingManager();

    manager.onStart = function (url, itemsLoaded, itemsTotal) {

        console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

    };

    manager.onLoad = function () {

        console.log('Loading complete!');

        // remove preloader cover.

        // const curtain = document.getElementById("curtain");

        // curtain.style.visibility = "hidden";
        // curtain.classList.add("hidden");

    };


    manager.onProgress = function (url, itemsLoaded, itemsTotal) {

        console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        var pct = itemsLoaded / itemsTotal;

        //scale loading bar

        // const loader = document.getElementById("loader");

        // var pxs = pct*180;
        // loader.style.width = pxs.toString() + "px";


    };

    manager.onError = function (url) {

        console.log('There was an error loading ' + url);

    };


    const gltfLoader = new GLTFLoader(manager);
    const textureLoader = new THREE.TextureLoader(manager);
    const rgbeLoader = new RGBELoader(manager);


    let box_geom = new THREE.BoxGeometry(1,1,1,100,100,100);
    let box_mat = new THREE.MeshBasicMaterial({color:"red"});
    let box_mesh = new THREE.Mesh(box_geom,box_mat);

    const material = new THREE.ShaderMaterial({
	    uniforms:{
	        iTime: {value: 0},
	        colorBase: {value: new THREE.Vector3(0.)},
	        colorHighLight: {value: new THREE.Vector3(60., 54., 69.)},
	        undulationScale: {value: 1.},
	    },
	    vertexShader: shapevertShader,
	    fragmentShader: shapefragShader,
	});

    box_mesh.material = material;

    // scene.add(box_mesh);

    const SphereGeometry = new THREE.SphereGeometry(1.,500,500);
	const CylinderGeometry = new THREE.CylinderGeometry(0.8,0.8,1.8,250,250 );
	const ConeGeometry = new THREE.ConeGeometry(1.,2.,300,300)
	const BoxGeometry = new THREE.BoxGeometry(1.5,1.5,1.5,100,100,100);
	const TorusGeometry = new THREE.TorusGeometry(0.8,0.5,250,250);

    const parent_empty = new THREE.Group();
    scene.add(parent_empty);
	
	const torusMesh = new THREE.Mesh(TorusGeometry,material);
	// torusMesh.visible = false;
    parent_empty.add(torusMesh);



	const boxMesh = new THREE.Mesh(BoxGeometry,material);
	boxMesh.visible = false;
    parent_empty.add(boxMesh);

	const coneMesh = new THREE.Mesh(ConeGeometry,material);
	coneMesh.visible = false;
	coneMesh.position.set(0,0.2,0);
	parent_empty.add(coneMesh);

	const cylinderMesh = new THREE.Mesh(CylinderGeometry,material);
	cylinderMesh.visible = false;
	parent_empty.add(cylinderMesh);

	const sphereMesh = new THREE.Mesh(SphereGeometry,material);
	sphereMesh.visible = false;
	var currentObj = sphereMesh;
	parent_empty.add(sphereMesh);

    var meshes = {
		torus: torusMesh,
		box: boxMesh,
		cone: coneMesh,
		cylinder: cylinderMesh,
		sphere: sphereMesh,
	}

    const torusKnotObj = sheet.object('Shape Animated Values', {
        // Note that the rotation is in radians
        // (full rotation: 2 * Math.PI)
        transform: types.compound({
            rotation: types.compound({
                x: types.number(parent_empty.rotation.x, { range: [-2, 2] }),
                y: types.number(parent_empty.rotation.y, { range: [-2, 2] }),
                z: types.number(parent_empty.rotation.z, { range: [-2, 2] }),
              }),
              position: types.compound({
                  x: types.number(parent_empty.position.x, { range: [-5, 5] }),
                  y: types.number(parent_empty.position.y, { range: [-5, 5] }),
                  z: types.number(parent_empty.position.z, { range: [-5, 5] }),
              }),
              scale: types.compound({
                  x: types.number(parent_empty.scale.x, { range: [0.1, 5] }),
                  y: types.number(parent_empty.scale.y, { range: [0.1, 5] }),
                  z: types.number(parent_empty.scale.z, { range: [0.1, 5] }),
              }),
        }),
        shape: types.stringLiteral("torus",
        {
            torus: "torus",
            box: "box",
            cone: "cone",
            cylinder: "cylinder",
            sphere: "sphere"
        }),
        colors: types.compound({
            base: types.rgba({ r: 0, g: 0, b: 0, a: 1 }),
            highlight: types.rgba({ r: 60/255., g: 54/255., b: 69/255., a: 1 }),
            background: types.rgba({ r: 120/255., g: 54/255., b: 69/255., a: 1 }),
        }),
        noise: types.compound({
            position: types.number(0,{range:[0,100]}),
            scale: types.number(1,{range: [0,10]})
        }),
      })


    function reset_keyframes() {
        // window.localStorage.removeItem("theatre-0.4.persistent")

        // studio.initialize();
        // let container = document.getElementById("section1")
        // console.log(container);

        // // iterate through keyframes

        // console.log(val(torusKnotObj.props));

        // var props = val(torusKnotObj.props);

        // var keyframes = [];


        // for (const property in props){
        //     if (typeof props[property] == "object") {
                
        //     } else {

        //     }
        //     console.log(`${property}: ${props[property]}`);
        // }

        // var keyframes = sheet.sequence.__experimental_getKeyframes(torusKnotObj.props.transform.position.x);
        // console.log(keyframes);

        studio.transaction(({ set, unset }) => {
            unset(torusKnotObj.props);
        })

        // project = getProject('All')

        // sheet = project.sheet('Animated scene')

        // studio.ui.hide();
        // studio.ui.restore();



    }

    window.reset_keyframes = reset_keyframes;


    // studio.transaction(({set,unset})=>{
    //     unset(torusKnotObj.props)
    // })

    function makeInvisible(){
		for(var mesh in meshes){
			meshes[mesh].visible = false;
		}
	}

    function setColor(value,reciever,key_val){
        const {r,g,b} = value;
        reciever[key_val] = new THREE.Color(r,g,b);
    }
      
    torusKnotObj.onValuesChange((values) => {
        const { x, y, z } = values.transform.rotation
        parent_empty.position.copy(values.transform.position);
      
        parent_empty.rotation.set(x * Math.PI, y * Math.PI, z * Math.PI)

        parent_empty.scale.copy(values.transform.scale);

        makeInvisible();
        meshes[values.shape].visible = true;

        const bgc = values.colors.background;
        scene.background = new THREE.Color(bgc.r, bgc.g, bgc.b);

        const bc = values.colors.base;
        material.uniforms.colorBase.value.set(bc.r*255,bc.g*255,bc.b*255);

        const hc = values.colors.highlight;
        material.uniforms.colorHighLight.value.set(hc.r*255,hc.g*255,hc.b*255);

        material.uniforms.iTime.value = values.noise.position;

        material.uniforms.undulationScale.value = values.noise.scale;

    })

    

    return updates;



    //load assets, create geometry,material -> mesh as needed, add meshes to the scene




}
