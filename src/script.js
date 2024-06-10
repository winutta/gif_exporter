import "./style.css";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// import setup 
import {setup} from "./setup"

import App from "./App";


// import './style.css'
import * as THREE from 'three'
// import * as dat from 'dat.gui'

//////////////////

import { loadAssets } from "./loaders.js"





const root = createRoot(document.getElementById("root"));
root.render(
  // <StrictMode>
    <App />
  // </StrictMode>
);

function main() {

// BASIC SETUP

// renderer wont be available until the react stuff gets run.. 
// so need to check to availability? will get set on creation. but when to create???

// check variable needs to be available ahead of react callback.. 
// make a holder for callback settable things to check and run.. then when they get set run them. 
// run setup before app so it can be accessed in app. 
// 

var {scene,camera,renderer,renderers} = setup;






var timeObject = { value: 0 };
var updates = loadAssets(timeObject,scene,camera);

// console.log(scene,renderers,camera);

// RENDER LOOP

const fps = 30;

// maybe sync the render loop to the sequence update?

// onChange(sheet.sequence.pointer.position, (position) => {
//  get time delta and and render??
//   console.log('Position of the sequence changed to:', position)
// })

// or maybe just update time in uniform deltas and update the sequence position by that delta and render.
// this seems right..

var sequence_position = 0;
// var delta_ammount = duration/(frames+1);


function render(time)
{   
  
    timeObject.value = time*0.001;
    // camera.position.set(0,0,Math.sin(time*0.001)*100.);



    renderers.forEach((e)=>{
      // console.log("renderering");
      e.render(scene,camera);
    })

    updates.forEach(update=>{
      update();
    })



    // renderer.render(scene,camera);
    requestAnimationFrame ( render );

    
}

requestAnimationFrame ( render );

}

main();







//  add the threejs version of script here .

// in render function just iterate through renderers that need rendering.. 


