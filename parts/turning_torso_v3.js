// planview of turning torso
let w1 = 17;   // width front in meters
let l1 = 17;   // length of side walls front
let l2 = 5 ;   // length of first tapering part
let l3 = 15;   // length of last tapering part
let l4 = 10;    // distance from front face to column
let a1 = 10.1;   // angle [degrees] of first sidewalls to centerline
let a2 = 50 ;    // angle [degrees] of first tapering part to centerline
let a3 = 34 ;    // angle [degrees] of last tapering part to centerline
let b1 = 0.8 ;    // bulge-out of front wall
let b2 = 1.2 ;    // bulge-out of side walls
let d  = 10.6;    // diameter of column

let h  = 190 ;    // height of building
let nb = 9   ;   // number of blocks
let hgap = 2 ; // height of gap
let h1 = (h)/nb  ;   // height of block and gap
let hblock = h1-hgap // height per block

let atot = 90 ; // total rotation of tower
let a5 = atot / (nb)  ;   // rotation of block
let a4 = a5 * (h1-hgap)/h1 // rotation in each block, containing 5 floors of 6 in total

// convert degrees to radians
a1 = a1 * Math.PI / 180;
a2 = a2 * Math.PI / 180;
a3 = a3 * Math.PI / 180;

// definition of points in the planview
let p1x = 0
let p1y = -(w1/2)
let p2x = -b1
let p2y = 0
let p3x = 0
let p3y = +w1/2
let p4x = Math.cos(a1)*l1/2 - Math.sin(a1)*b2
let p4y = p3y + Math.sin(a1)*l1/2 + Math.cos(a1)*b2
let p5x = Math.cos(a1)*l1
let p5y = p3y + Math.sin(a1)*l1
let p6x = p5x + Math.cos(a2)*l2
let p6y = p5y - Math.sin(a2)*l2
let p7x = p6x + Math.cos(a3)*l3
let p7y = 0
let p8x = p6x
let p8y = -p6y
let p9x = p5x
let p9y = -p5y
let p10x = p4x
let p10y = -p4y


// combine x and y
let p1 = [ p1x, p1y];
let p2 = [ p2x, p2y];
let p3 = [ p3x, p3y];
let p4 = [ p4x, p4y];
let p5 = [ p5x, p5y];
let p6 = [ p6x, p6y];
let p7 = [ p7x, p7y];
let p8 = [ p8x, p8y];
let p9 = [ p9x, p9y];
let p10 = [ p10x, p10y];

// sketch of the planview
let planview = new Sketch(p1)
.ArcTo(p2,p3)
.ArcTo(p4,p5)
.LineTo(p6)
.LineTo(p7)
.LineTo(p8)
.LineTo(p9)
.ArcTo(p10,p1)
.End(false).Wire(true)

// translate the planview to have the center of rotation at the location of the column
planview1 = Translate([-l4,0,0],planview,false);

// build the first block of 5 floors
let block1 = Translate([0,0,hgap],RotatedExtrude(planview1, hblock, a4 , false))
let entrance = RotatedExtrude(planview1, hgap, a4*(hgap/h1), false )

// experiment to subtract windows from first block
// let window1 = Translate([-l4-2,w1/2-2,hgap+1.5],Box(2,1,1.5))
// let window2 = Translate([-l4-2,w1/2-4,hgap+1.5],Box(1.8,1,1.5))
// let window3 = Translate([-l4-2,w1/2-6,hgap+1.5],Box(1.6,1,1.5))
// let window4 = Translate([-l4-2,w1/2-8,hgap+1.5],Box(1.4,1,1.5))
// let window5 = Translate([-l4-2,w1/2-10,hgap+1.5],Box(1.4,1,1.5))
// let window6 = Translate([-l4-2,w1/2-12,hgap+1.5],Box(1.6,1,1.5))
// let window7 = Translate([-l4-2,w1/2-14,hgap+1.5],Box(1.8,1,1.5))
// let window8 = Translate([-l4-2,w1/2-16,hgap+1.5],Box(2,1,1.5))
// let block1w = Difference(block1, [window1, window2, window3, window4, window5, window6, window7, window8]);

// definition of the truss for each block
let truss1 = Translate([p5x-l4,p5y+0.5,0], Rotate([0,0,1],-28, Rotate([0,1,0], 90, Cylinder(0.40,23.6,false))))
let truss2 = Translate([p5x-l4,-p5y-0.5,0], Rotate([0,0,1],32, Rotate([0,1,0], 90, Cylinder(0.40,24.5,false))))
let truss3 = Rotate([0,0,1],a5,Translate([p5x-l4,-p5y-0.5,h1],
                Rotate([0,0,1],21.0, Rotate([0,1,0], 133, Cylinder(0.40,30.5,false)))))
let truss4 = Rotate([0,0,1],a5*0.85,Translate([p5x-l4,p5y+0.5,h1],
                Rotate([0,0,1],-36.5, Rotate([0,1,0], 128, Cylinder(0.40,32.5,false)))))
let truss5 = Rotate([0,1,0],-1.35, Rotate([1,0,0],-a5*1.25,Translate([27.5,0.7,0], Cylinder(0.40,h1+0.5,false))))

// repeat 8 blocks and trusses above the first block
for (level = 1 ; level <= 8 ; level++)
{
    let blockn = Rotate([0,0,1], a5 *(level), Translate([0,0,((h1*level))],block1, true))
    let truss1n =  Rotate([0,0,1], a5 *(level), Translate([0,0,(h1*level)],truss1, true))
    let truss2n =  Rotate([0,0,1], a5 *(level), Translate([0,0,(h1*level)],truss2, true))
    let truss3n =  Rotate([0,0,1], a5 *(level), Translate([0,0,(h1*level)],truss3, true))
    let truss4n =  Rotate([0,0,1], a5 *(level), Translate([0,0,(h1*level)],truss4, true))
    let truss5n =  Rotate([0,0,1], a5 *(level), Translate([0,0,(h1*level)],truss5, true))
}
let truss1top =  Rotate([0,0,1], a5 *(nb), Translate([0,0,(h1*(nb))],truss1, true))
let truss2top=  Rotate([0,0,1], a5 *(nb), Translate([0,0,(h1*(nb))],truss2, true))
let column = Translate([0,0,0],Cylinder(d/2, h , false))
