import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { animate, style, keyframes, state, transition, trigger } from '@angular/animations';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-h2o',
  templateUrl: './h2o.component.html',
  styleUrl: './h2o.component.scss'
})
export class H2oComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef;
  private context!: CanvasRenderingContext2D;
  private radius: number = 25;
  molecules: any[] = [];
  temperature = 25

  ngAfterViewInit(): void {
    // @ts-ignore
    this.context = (this.canvasRef.nativeElement as HTMLCanvasElement).getContext('2d');
    this.resizeCanvas()
    this.createMolecules();
    this.drawMolecules();
    this.animateMolecules();
  }

  handleCanvasClick(event: MouseEvent): void {
    const mouseX = event.clientX - this.canvasRef.nativeElement.getBoundingClientRect().left;
    const mouseY = event.clientY - this.canvasRef.nativeElement.getBoundingClientRect().top;

    this.appendMolecule(mouseX, mouseY);
  }

  private appendMolecule(x: number, y: number): void {
    let angle =  60 * (Math.PI/180)
    let angle_2 =  60+60 * (Math.PI/180)

    let i_y = Math.sin(angle)
    let i_x = Math.cos(angle)

    let i_y2 = Math.sin(angle_2)
    let i_x2 = Math.cos(angle_2)
    this.molecules.push({
      oxygen: {
        x,
        y,
        e1: {
          i: false,
          angle: 225
        },
        e2:{
          i: false,
          angle: 315
        },
        i: this.molecules.length
      },
      hydrogen1: {
        x: (x + i_x),
        y: (y + i_y)
      },
      hydrogen2: {
        x: (x + i_x2),
        y: (y + i_y2)
      }
    });
  }

  private createMolecules(): void {
    for (let i = 0; i < 50; i++) {
      let x_c = Math.random() * this.canvasRef.nativeElement.width;
      let y_c = Math.random() * this.canvasRef.nativeElement.height
      let angle =  45 * (Math.PI/180)
      let angle_2 =  135 * (Math.PI/180)

      let i_y = Math.sin(angle)
      let i_x = Math.cos(angle)

      let i_y2 = Math.sin(angle_2)
      let i_x2 = Math.cos(angle_2)

      this.molecules.push({
        oxygen: {
          x: x_c,
          y: y_c,
          e1: {
            i: false,
            angle: 225
          },
          e2:{
            i: false,
            angle: 315
          },
          i: i
        },
        hydrogen1: {
          x: (x_c + i_x),
          y: (y_c + i_y)
        },
        hydrogen2: {
          x: (x_c + i_x2),
          y: (y_c + i_y2)
        }
      });
    }
  }

  private drawMolecules(): void {
    for (const molecule of this.molecules) {
      this.drawAtom(molecule.oxygen.x, molecule.oxygen.y, 'red', 16);
      this.drawAtom(molecule.hydrogen1.x, molecule.hydrogen1.y, 'blue', 8);
      this.drawAtom(molecule.hydrogen2.x, molecule.hydrogen2.y, 'blue', 8);

      //this.drawBond(molecule.oxygen.x, molecule.oxygen.y, molecule.hydrogen1.x, molecule.hydrogen1.y);
      // this.drawBond(molecule.oxygen.x, molecule.oxygen.y, molecule.hydrogen2.x, molecule.hydrogen2.y);
      // Draw labels with coordinates
      this.drawLabel(molecule.oxygen.x, molecule.oxygen.y, `O(${molecule.oxygen.i})`);
    }
  }

  private drawLabel(x: number, y: number, text: string): void {
    this.context.font = '12px Arial';
    this.context.fillStyle = 'black';
    this.context.fillText(text, x - 25, y - 25); // Adjust the label position as needed
  }

  private drawAtom(x: number, y: number, color: string, radius: number): void {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.fillStyle = color;
    this.context.fill();
    this.context.stroke();
  }

  private drawBond(x1: number, y1: number, x2: number, y2: number): void {
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  }

  private findNearestNeighbor(molecule: any, mode:number=1): any {
    let nearestNeighbor = null;
    let minDistance = Infinity;

    for (const otherMolecule of this.molecules) {
      if (otherMolecule !== molecule) {
        const dx = molecule.oxygen.x - otherMolecule.oxygen.x;
        const dy = molecule.oxygen.y - otherMolecule.oxygen.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
          if(mode == 1){
            minDistance = distance;
            nearestNeighbor = otherMolecule.oxygen;
          }else if(mode == 2 && (!otherMolecule.oxygen.e1.i || !otherMolecule.oxygen.e2.i)){
            minDistance = distance;
            nearestNeighbor = otherMolecule;
          }
        }
      }
    }

    return nearestNeighbor;
  }

  private drawLinesToNearestNeighbors(): void {
    for (const molecule of this.molecules) {
      const nearestNeighbor = this.findNearestNeighbor(molecule);

      if (nearestNeighbor) {
        this.drawLine(molecule.oxygen.x, molecule.oxygen.y, nearestNeighbor.x, nearestNeighbor.y);
      }
    }
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number): void {
    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  }

  private animateMolecules(): void {
    setInterval(() => {
      this.clearCanvas();
      this.moveMolecules();
      this.drawMolecules();
      this.drawLinesToNearestNeighbors()
    }, 16); // Adjust the interval based on your desired frame rate
  }

  private clearCanvas(): void {
    this.context.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.resizeCanvas();
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement as HTMLCanvasElement;
    canvas.width = window.innerWidth*.8;
    canvas.height = window.innerHeight*.8;
    this.clearCanvas();
    this.drawMolecules();
  }

  private moveRandom(molecule: any){
    let r_sign =Math.random()
    let sign = r_sign <= .3 ? -1 : 1
    let r_sign_Y =Math.random()
    let sign_y = r_sign_Y <= .3 ? -1 : 1
    molecule.oxygen.x += (Math.random()* (sign)* this.temperature); // Random movement in X direction
    molecule.oxygen.y += (Math.random() * (sign_y) * this.temperature); // Random movement in Y direction

    this.checkBoundaries(molecule);
  }

  private checkBoundaries (molecule:any){
    // Wrap around if molecules go beyond canvas boundaries
    if (molecule.oxygen.x > this.canvasRef.nativeElement.width){
      molecule.oxygen.x = 0
    }else if (molecule.oxygen.x < 0){
      molecule.oxygen.x = this.canvasRef.nativeElement.width
    }
    if (molecule.oxygen.y > this.canvasRef.nativeElement.height){
      molecule.oxygen.y = 0
    }else if (molecule.oxygen.y < 0){
      molecule.oxygen.y = this.canvasRef.nativeElement.height
    }
  }

  private rotateHAtoms(molecule: any, type: number = 1){
    let actual_degrees = (Math.asin((molecule.hydrogen1.y-molecule.oxygen.y)/this.radius) * 180) / Math.PI
    actual_degrees = actual_degrees ? actual_degrees : 30;
    let degrees = type == 2? 45:(Math.random() * ((actual_degrees+this.temperature+20) - (actual_degrees-this.temperature-20)))
    let angle = degrees * (Math.PI/180)
    let angle_2 =  (degrees+90) * (Math.PI/180)

    let i_y = this.radius * Math.sin(angle)
    let i_x = this.radius * Math.cos(angle)

    let i_y2 = this.radius * Math.sin(angle_2)
    let i_x2 = this.radius * Math.cos(angle_2)

    molecule.hydrogen1.x = molecule.oxygen.x + i_x
    molecule.hydrogen2.x = molecule.oxygen.x + i_x2
    molecule.hydrogen1.y = molecule.oxygen.y + i_y
    molecule.hydrogen2.y = molecule.oxygen.y + i_y2
  }

  private moveMolecules(): void {
    for (let c = 0; c < this.molecules.length; c++) {
      const molecule = this.molecules[c]
      if (this.temperature > 10){
        this.moveRandom(molecule)
        this.rotateHAtoms(molecule)
      }else if (this.temperature <= 10 && this.temperature >0){
        const nearestNeighbor = this.findNearestNeighbor(molecule);
        let distance_Y = nearestNeighbor.y - molecule.oxygen.y
        let distance = nearestNeighbor.x - molecule.oxygen.x
        let r_d = Math.sqrt(distance_Y*distance_Y + distance*distance)
        if (r_d>=100){
          molecule.oxygen.y += distance_Y/this.temperature
          molecule.oxygen.x += distance/this.temperature
        }else if (r_d<= 100 && r_d >=90){
          this.moveRandom(molecule)
        }else{
          molecule.oxygen.y -= distance_Y/this.temperature
          molecule.oxygen.x -= distance/this.temperature
        }
        this.checkBoundaries(molecule)
        this.rotateHAtoms(molecule)
      }else{
        this.rotateHAtoms(molecule, 2)
        if (molecule.oxygen.i != 0){
          const nearestNeighbor = this.findNearestNeighbor(molecule, 2);
          let is_in = false
          for (let i = 0; i < this.molecules.length; i++) {
            if (this.molecules[i].oxygen.e1.i == molecule.oxygen.i || this.molecules[i].oxygen.e2.i == molecule.oxygen.i){
              is_in = true
            }
          }
          if (!is_in){
            this.checkBoundaries(molecule);
            this.checkBoundaries(nearestNeighbor);

            if (!(nearestNeighbor.oxygen.e1.i)){
              const px = nearestNeighbor.oxygen.x + ((this.radius+25) * Math.cos((nearestNeighbor.oxygen.e1.angle)* (Math.PI/180)))
              const py = nearestNeighbor.oxygen.y + ((this.radius+25) * Math.sin(nearestNeighbor.oxygen.e1.angle* (Math.PI/180)))
              let exist = false
              for (let k = 0; k < this.molecules.length; k++) {
                let tmp = this.molecules[k]
                if (tmp.oxygen.x >= px -this.radius && tmp.oxygen.y >= py - this.radius && tmp.oxygen.y <= py+this.radius && tmp.oxygen.x <= px+this.radius){
                  exist = true
                }
              }
              if (!exist){
                nearestNeighbor.oxygen.e1.i = molecule.oxygen.i
                molecule.oxygen.x = px
                molecule.oxygen.y = py
                break;
              }
            }else if (!nearestNeighbor.oxygen.e2.i) {

              let px = nearestNeighbor.oxygen.x + ((this.radius + 25) * Math.cos(nearestNeighbor.oxygen.e2.angle * (Math.PI / 180)))
              let py = nearestNeighbor.oxygen.y + ((this.radius + 25) * Math.sin(nearestNeighbor.oxygen.e2.angle * (Math.PI / 180)))
              let exist = false
              for (let k = 0; k < this.molecules.length; k++) {
                let tmp = this.molecules[k]
                if (tmp.oxygen.x >= px - this.radius && tmp.oxygen.y >= py - this.radius && tmp.oxygen.y <= py + this.radius && tmp.oxygen.x <= px + this.radius) {
                  exist = true
                }
              }
              if (!exist) {
                nearestNeighbor.oxygen.e2.i = molecule.oxygen.i
                molecule.oxygen.x = px
                molecule.oxygen.y = py
                break;
              }
            }
          }
        }else{
          molecule.oxygen.x = this.canvasRef.nativeElement.width / 2
          molecule.oxygen.y = this.canvasRef.nativeElement.height / 2
        }
      }
    }
  }

  clearBridges($event: Event) {
    for (const m of this.molecules){
      m.oxygen.e1.i = false
      m.oxygen.e2.i = false
    }
  }

  protected readonly window = window;

  addMolecule(number: number) {
    let x_c = Math.random() * this.canvasRef.nativeElement.width;
    let y_c = Math.random() * this.canvasRef.nativeElement.height
    if(number == 1){
      this.appendMolecule(x_c, y_c);
    }else{
      this.molecules = this.molecules.slice(0,this.molecules.length-1)
    }
  }
}
