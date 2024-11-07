import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { finalize, from, map, mergeMap, of, switchMap, toArray } from "rxjs";
import { NgForOf, NgIf, NgStyle } from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, NgForOf, NgStyle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) { }

  title = 'tcc-build-generator';

  imageChampionUrl = "http://localhost:4200/assets/image/champion/";
  imageItemUrl = "https://ddragon.leagueoflegends.com/cdn/14.22.1/img/item/"

  champions: any = [];
  selectedChampion1: any = undefined;
  selectedChampion2: any = undefined;
  imageToShow: any = undefined;
  loadingChampions = true;

  ngOnInit() {
    this.http.get("http://localhost:4200/assets/champion.json")
      .pipe(
        switchMap((champion: any) => {
          const championsArray: any = [];
          Object.keys(champion.data).forEach(key => championsArray.push(champion.data[key]));

          return from(championsArray);
        }),
        mergeMap((champion: any) => {
          return this.getChampionImage(champion.image.full).pipe(
            map((displayImage: any) => {
              champion.displayImage = displayImage;
              this.champions.push(champion);
              return champion;
            })
          );
        }),
        toArray(),
        finalize(() => this.loadingChampions = false)
      ).subscribe((champion: any) => {
        console.log(this.champions);
      });

    this.getItemImage(1001);
    this.getSplashImage();
  }

  getSplashImage() {
    return this.http.get("https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Aatrox_0.jpg", { responseType: 'blob' }).subscribe(
      (blob:  any) => this.imageToShow = URL.createObjectURL(blob)
    );
  }

  getItemImage(id: any) {
    return this.http.get(this.imageItemUrl + id + ".png", { responseType: 'blob' }).pipe(
      map((blob:  any) => URL.createObjectURL(blob))
    );
  }

  getChampionImage(name: string) {
    return this.http.get(this.imageChampionUrl + name, { responseType: 'blob' }).pipe(
      map((blob:  any) => URL.createObjectURL(blob))
    );
  }

  onSelectChampion(fromTeam: number, championName: string) {
    if(fromTeam === 1) {
      this.selectedChampion1 = this.champions.find((champion: any) => champion.name === championName)
    } else {
      this.selectedChampion2 = this.champions.find((champion: any) => champion.name === championName)
    }
  }

  getDifficult(dificult: number): any {
    if (dificult >= 7) {
      return { difficult: "Difícil", color: "#D32F2F" };
    }

    if (dificult >= 5) {
      return { difficult: "Médio", color: "#F57C00" };
    }

    if (dificult < 5) {
      return { difficult: "Fácil", color: "#388E3C" };
    }
  }
}
