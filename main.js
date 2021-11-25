const canvas=document.getElementById("canvas");
const context=canvas.getContext("2d");


function Plotter(){
			
}


function Arm(x,y,length,angle){
	this.position={x,y};
	this.length=length;
	this.angle=angle;
	this.endPosition=this.getOtherSide();
}

Arm.prototype.draw=function(){
	context.beginPath()
	context.moveTo(this.position.x,this.position.y);
	this.endPosition=this.getOtherSide();
	context.lineTo(this.endPosition.x, this.endPosition.y);
	context.strokeStyle="black";
	context.stroke();
}


Arm.prototype.clampAngle=function(){
	if(this.angle<0){
		this.angle=360+this.angle;
	}
}


Arm.prototype.getOtherSide=function(){
	this.clampAngle();

	let dx=Math.cos(degreesToRadians(this.angle))*this.length;
	let dy=Math.sin(degreesToRadians(this.angle))*this.length;

	//if(this.angle<0)dy*=-1;			
	
	if(this.angle>90&&this.angle<180){dx*=-1;}
	if(this.angle>180&&this.angle<270){dx*=-1;dy*=-1;console.log(this.angle);}
	if(this.angle>270&&this.angle<360){dy*=-1;}
		
	return{x:this.position.x+dx,y:this.position.y+dy}
}


Arm.prototype.setOtherSide=function(point){
	let hlength=distanceBetweenTwoPoints(this.position,point);
	let vertLength=Math.abs(this.position.y-point.y);

	this.angle=Math.asin(vertLength/hlength);
	console.log(hlength);
	console.log(vertLength);
	console.log(this.angle);
}





function distanceBetweenTwoPoints(point1,point2){
	let distX=point1.x-point2.x;
	let distY=point1.y-point2.y;
	console.log(distX)
	console.log(distY)
	return Math.sqrt((distX*distX)+(distY*distY))
		
}



function degreesToRadians(angle){
	return angle*(Math.PI/180);	
}

function radiansToDegrees(angle){
	return angle*(180/Math.PI);
}



let arm1=new Arm(250,250,100,26-90);
let arm2=new Arm(arm1.endPosition.x,arm1.endPosition.y,100,0)



function setPlotterXY(x,y,arm1,arm2){
	let dx=Math.abs(arm1.position.x-x)
	let dy=Math.abs(arm1.position.y-y)
	let h=Math.sqrt(dx**2+dy**2);

	let hangle=radiansToDegrees(Math.asin(dx/h));
	//hangle=hangle-90;

	
	angles=getAnglesOfTriangle(arm1.length,arm2.length,h);
	//arm1.angle=hangle-angles.B
	arm1.angle=angles.B-hangle+90;

	arm1.draw()
	arm2.angle=((Math.abs(hangle-angles.B)+angles.C)-180)*-1
	arm2.position=arm1.endPosition;


	context.strokeText(hangle,10,10);
	context.strokeText(arm1.angle,10,30);
	context.strokeText(arm2.angle,10,50);
	context.beginPath();
	context.moveTo(arm1.position.x,arm1.position.y);
	context.lineTo(x,y);
	context.strokeStyle="red";
	context.stroke();

}




function update(e){
	context.clearRect(0,0,500,500);
	let rect=canvas.getBoundingClientRect();
	let xPos=e.clientX-rect.left;
	let yPos=e.clientY-rect.top;

	setPlotterXY(xPos,yPos,arm1,arm2);
	arm1.draw();
	arm2.draw();
}


//window.addEventListener("mousemove",update);
arm1.angle=25;
arm1.draw();

//function loop(){
	//context.clearRect(0,0,500,500);
	//arm1.angle++;
	//arm2.angle+=2;
	//arm2.position=arm1.getOtherSide();
	//arm1.draw();
	//arm2.draw();
	//window.requestAnimationFrame(loop);
//}
//window.requestAnimationFrame(loop);




function getAnglesOfTriangle(a,b,c){
	//get the first angle with the law of cosines
	
	//law of cosines is c^=a^2+b^2-2*a*b*cos(C)
	//
	//formula is C=acos(

	//Law of cosines
	let C=Math.acos(
		((a**2)+(b**2)-(c**2))
		/
		(2*a*b)
	)
	C=radiansToDegrees(C)

	//law of cosines
	let A=Math.acos(
		((b**2)+(c**2)-(a**2))
		/
		(2*b*c)
	);
	A=radiansToDegrees(A)

	//180 degrees in a triangle
	let B=180-A-C;
	

	return {A:A,B:B,C:C}
}
