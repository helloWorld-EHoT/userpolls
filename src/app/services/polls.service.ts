import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable()
export class PollsService {

  constructor(private http: HttpClient,
              private router: Router) {
  }

  init() {
    return this.getPolls();
  }

  getPolls() {
    return new Promise((resolve, reject) => {
      this.http.get('https://next.json-generator.com/api/json/get/NJlVOcRzB')
        .subscribe(
          res => {
            resolve(res);
          }, err => {
            console.error(err.error);
            reject(false);
          });
    });
  }
}
