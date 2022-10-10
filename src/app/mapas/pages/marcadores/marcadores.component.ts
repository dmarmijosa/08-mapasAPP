import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
interface MarksColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container {
        width: 100%;
        height: 100%;
      }
      .list-group {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99;
      }
      li {
        cursor: pointer;
      }
    `,
  ],
})
export class MarcadoresComponent implements AfterViewInit {
  mapa!: mapboxgl.Map;
  @ViewChild('mapa') divMapa!: ElementRef;

  zoomLevel: number = 15;
  center: [number, number] = [3.8432578, 39.9996512];
  arrMarks: MarksColor[] = [];
  constructor() {}

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel,
    });
    this.leerLocalStorage();

    // const markerHtml:HTMLElement=document.createElement('div')

    // markerHtml.innerHTML='Welcome to CSAssociatss';

    // const maker= new mapboxgl.Marker({
    //   element:markerHtml
    // })
    //                          .setLngLat(this.center)
    //                          .addTo(this.mapa)
  }

  irAMarcador(mark: mapboxgl.Marker | undefined) {
    this.mapa.flyTo({
      center: mark!.getLngLat(),
    });
  }
  agregarMarcador() {
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );
    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color,
    })
      .setLngLat(this.center)
      .addTo(this.mapa);
    this.arrMarks.push({
      color,
      marker: nuevoMarcador,
    });
    this.guardarMarcadoresLocalStorage();
    nuevoMarcador.on('dragend',()=>{
      this.guardarMarcadoresLocalStorage();
    })
  }
  guardarMarcadoresLocalStorage() {
    const langLatArr: MarksColor[] = [];
    this.arrMarks.forEach((m) => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();

      langLatArr.push({
        color: color,
        centro: [lng, lat],
      });
    });
    localStorage.setItem('marcadores', JSON.stringify(langLatArr));
  }

  leerLocalStorage() {
    if(!localStorage.getItem('marcadores')){
      return;

    }
    const lngLatArr:MarksColor[]= JSON.parse(localStorage.getItem('marcadores')!)
    lngLatArr.forEach( m=>{
      const newMarker = new mapboxgl.Marker({
        color:m.color,
        draggable:true
      })
        .setLngLat(m.centro!)
        .addTo(this.mapa);
        this.arrMarks.push({
          marker:newMarker,
          color:m.color
        });
        newMarker.on('dragend',()=>{
          this.guardarMarcadoresLocalStorage();
        })
    });

    
  }

  borrarMarcador(i:number){
    console.log(i);
    this.arrMarks[i].marker?.remove();
    this.arrMarks.splice(i,1);
    this.guardarMarcadoresLocalStorage();

  }
}
