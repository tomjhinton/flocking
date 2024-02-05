import { OrbitControls , shaderMaterial, Center, Text, Float, Point, Points} from '@react-three/drei'
import React, { useRef, useState, useMemo} from 'react'
import {  useFrame, extend } from '@react-three/fiber'
import vertexShader from './shaders/vertex.js'
import fragmentShader from './shaders/fragment.js'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'



let plane = new THREE.BoxGeometry( 20, 20, 20, 5, 5, 5 );





export default function Experience(){
 
    const picture = useLoader(TextureLoader,  `mondrian.jpeg`)

    const PointMaterial = shaderMaterial(

        {
            uTime: 0,
            uResolution: {x: screen.width, y: screen.height},
            uMouse: {x:0, y:0},
            pic: picture,

            
           
        },
        vertexShader,
        fragmentShader,
    
        
    )
    extend({PointMaterial})

    console.log(PointMaterial)

const ref = useRef()
// Hold state for hovered and clicked events
const [hovered, hover] = useState(false)
const [clicked, click] = useState(false)




const pointMaterial = useRef()
useFrame((  state, delta) => {
   pointMaterial.current.uTime += delta
console.log(state.mouse)
  //  ref.current.rotation.z += (delta * .2)
  pointMaterial.current.mouse = state.mouse
    if (
     pointMaterial.current.uResolution.x === 0 &&
     pointMaterial.current.uResolution.y === 0
    ) {
     pointMaterial.current.uResolution.x = screen.width;
     pointMaterial.current.uResolution.y = screen.height;
     
    }
})

let particlesCount =500

const particles = useMemo(() => {
  const positions = [];
  const velocities = [];

  for (let i = 0; i < particlesCount; i++) {
    velocities.push(Math.random()  , Math.random()  , Math.random()  );
  }

  return { positions, velocities };
}, [particlesCount]);

useFrame(() => {
  const positions = ref.current.geometry.attributes.position.array;
    let averageA = [0,0,0]


  for (let i = 0; i < positions.length /3; i++) {
    const i3 = i * 3;


    // Stop max speed
 
    if(Math.abs(particles.velocities[i3]) >20.){
      particles.velocities[i3]*=.5
    }
    if(Math.abs(particles.velocities[i3+1]) >20.){
      particles.velocities[i3+1]*=.5
    }
   
    if(Math.abs(particles.velocities[i3+2]) >20.){
      particles.velocities[i3+2]*=.5
    }
   
   
// Average Direction
    positions[i3] += particles.velocities[i3] * 0.02;
    positions[i3 + 1] += particles.velocities[i3 + 1] * 0.02;
    positions[i3 + 2] += particles.velocities[i3 + 2] * 0.02;
    
    
    
    averageA[0] += positions[i3]
    averageA[1] += positions[i3+1]
    averageA[2] += positions[i3+2]


  var pointA = new THREE.Vector3(positions[i3],positions[i3+1],positions[i3+2]);
  var pointB = new THREE.Vector3(averageA[0], averageA[1],averageA[2]);
 

  var directionVector = pointB.clone().sub(pointA);

// Normalize the direction vector
directionVector.normalize();



particles.velocities[i3] += directionVector.x *.1
particles.velocities[i3+1] += directionVector.y *.1
particles.velocities[i3+2] += directionVector.z *.1


// console.log(particles.velocities[i3])

  // particles[i3] = direction.subVectors( [positions[i3],positions[i3+1],positions[i3+2]], averageA )[0] ;
  // particles[i3+1] = direction.subVectors( [positions[i3],positions[i3+1],positions[i3+2]], averageA )[1] ;
  // particles[i3+2] = direction.subVectors( [positions[i3],positions[i3+1],positions[i3+2]], averageA )[2] ;

//   if(Math.abs(averageA[0] - positions[i3]) < .1 && Math.abs(averageA[1] - positions[i3+1]) < .1 && Math.abs(averageA[2] - positions[i3+2]) < .1){
//     particles.velocities[i3] *= -1;
    

// }


// Proximity
    for (let j = 3; j < positions.length/3; j++) {
      const j3 = j * 3;


  if(Math.abs(positions[j3] - positions[i3]) < .001 && Math.abs(positions[j3+1] - positions[i3+1]) < .001 && Math.abs(positions[j3+2] - positions[i3+2]) < .001){
    // particles.velocities[i3 + Math.floor(Math.random() * 3)] *= -1;
    console.log(positions[j3] - positions[i3])

}
    
}


   

   

    //  Bounce back when hitting the boundaries
    if (positions[i3] > 10 || positions[i3] < -10){
      particles.velocities[i3] *= -1;
  
    } 
    if (positions[i3 + 1] > 10 || positions[i3 + 1] < -10) {
      
      particles.velocities[i3 + 1] *= -1;
      
    }
    
    if (positions[i3 + 2] > 10 || positions[i3 + 2] < -10){
      
      particles.velocities[i3 + 2] *= -1;
    } 


  }

     averageA[0] /= positions.length/3
    averageA[1] /= positions.length/3
    averageA[2] /= positions.length/3
    

 

  ref.current.geometry.attributes.position.needsUpdate = true;
});


// Subscribe this component to the render-loop, rotate the mesh every frame
// useFrame((state, delta) => (ref.current.rotation.x += delta *.05))
    return(

<>
<OrbitControls makeDefault enableZoom={true} maxPolarAngle={Math.PI * .5}/>

         <Text
        
        font="FerriteCoreDX-Regular.otf"
        scale={1 }
       
        position={ [ .0, -2.250, 1 ] }
        fontSize={1.25}
        
        
        >
          {'Flock off'.toUpperCase()}
          <meshBasicMaterial color="#4AF626" toneMapped={false}
          side={THREE.DoubleSide}
          />
        </Text>



        <Points positions={plane.attributes.position.array} stride={3} ref={ref} rotation-x={Math.PI *  1.} >
        <pointMaterial ref={pointMaterial} depthWrite={false} transparent />
    </Points>

     
      </>
    )
}