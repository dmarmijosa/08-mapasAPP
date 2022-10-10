import { AfterViewInit, Component, ElementRef,  OnDestroy,  ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      .mapa-container{
        width:100%;
        height:100%;
      }
      .row{
        background-color:white;
        position: fixed;
        bottom:50px;
        left:50px;
        padding: 10px;
        border-radius: 5px;
        z-index:999;
        width:400px;
      }
    `
  ]
  
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {
  
  mapa!:mapboxgl.Map;
  @ViewChild('mapa') divMapa!:ElementRef;

  zoomLevel:number=15;
  center:[number,number]=[3.8432578,39.9996512];

  constructor() { 

  }

  ngAfterViewInit(): void {
     this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center:this.center,
      zoom:this.zoomLevel
    });
    this.mapa.on('zoom',(event)=>{
      const zoomActual=this.mapa.getZoom();
      this.zoomLevel=zoomActual;
    });
    this.mapa.on('zoomend',(env)=>{
      if(this.mapa.getZoom()>18){
        this.mapa.zoomTo(18)
      }
    });
    //movimiento del mapa 

    this.mapa.on('move',(event)=>{
      const target = event.target;
      const {lng,lat} = target.getCenter();
      this.center=[lng,lat];

    });
  }
  zoomOut(){
    this.mapa.zoomOut();
    
  }
  zoomIn(){
    this.mapa.zoomIn();
  }
  zoomCambio(valor:string){
    this.mapa.zoomTo(parseInt(valor));
    
  }
  ngOnDestroy(): void {
    this.mapa.off('zoom',()=>{});
    this.mapa.off('zoomend',()=>{});
    this.mapa.off('move',()=>{});
  }

}
